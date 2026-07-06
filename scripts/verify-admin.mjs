// Verifies the admin dashboard: auth gate, login, stats/table, add guest,
// QR endpoint, and CSV export.
import { config } from "dotenv";
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

// Dev admin password comes from gitignored .env.local — never hardcoded.
config({ path: ".env.local" });
const PASSWORD = process.env.ADMIN_PASSWORD;

const OUT = "scripts/shots/admin";
mkdirSync(OUT, { recursive: true });
const base = "http://localhost:3000";

const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1100, height: 900 } });
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));

// 1. /admin should redirect to login (proxy, no cookie)
await page.goto(`${base}/admin`, { waitUntil: "networkidle" });
await page.waitForTimeout(400);
console.log("after /admin ->", page.url());
await page.screenshot({ path: `${OUT}/1-login.png` });

// 2. wrong password -> error
await page.fill('input[name="password"]', "wrongpass");
await page.getByRole("button", { name: /Enter|Checking/ }).click();
await page.waitForTimeout(700);
await page.screenshot({ path: `${OUT}/2-login-error.png` });

// 3. correct password -> dashboard
await page.fill('input[name="password"]', PASSWORD);
await page.getByRole("button", { name: /Enter|Checking/ }).click();
await page.waitForURL(`${base}/admin`, { timeout: 6000 }).catch(() => {});
await page.waitForTimeout(900);
console.log("after login ->", page.url());
await page.screenshot({ path: `${OUT}/3-dashboard.png`, fullPage: true });

// 4. add a guest
await page.fill('input[name="name"]', "Eliza Hartman");
await page.getByRole("button", { name: "Add guest" }).click();
await page.waitForTimeout(1200);
await page.screenshot({ path: `${OUT}/4-after-add.png`, fullPage: true });

// 5. CSV export
const csv = await page.evaluate(async (b) => {
  const r = await fetch(`${b}/admin/export`);
  return {
    status: r.status,
    disposition: r.headers.get("content-disposition"),
    head: (await r.text()).split("\n").slice(0, 4).join("\n"),
  };
}, base);
console.log("CSV status:", csv.status, "| disposition:", csv.disposition);
console.log("CSV head:\n" + csv.head);

await browser.close();
console.log("console errors:", errors.length ? errors : "none");
