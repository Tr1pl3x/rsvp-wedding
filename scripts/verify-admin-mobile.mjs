// Checks the admin at a phone viewport: card layout + empty-password rejection.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const OUT = "scripts/shots/admin";
mkdirSync(OUT, { recursive: true });
const base = "http://localhost:3000";

const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));

await page.goto(`${base}/admin`, { waitUntil: "networkidle" });
await page.waitForTimeout(400);

// Empty password must be rejected (fail-closed fix)
await page.getByRole("button", { name: /Enter|Checking/ }).click();
await page.waitForTimeout(700);
const emptyErr = await page
  .locator('[role="alert"]')
  .textContent()
  .catch(() => "");
console.log("empty-password ->", JSON.stringify((emptyErr || "").trim()));

// Log in and view the mobile dashboard
await page.fill('input[name="password"]', "huahin2026");
await page.getByRole("button", { name: /Enter|Checking/ }).click();
await page.waitForURL(`${base}/admin`, { timeout: 6000 }).catch(() => {});
await page.waitForTimeout(900);
await page.screenshot({ path: `${OUT}/6-mobile-dashboard.png`, fullPage: true });

console.log("console errors:", errors.length ? errors : "none");
await browser.close();
