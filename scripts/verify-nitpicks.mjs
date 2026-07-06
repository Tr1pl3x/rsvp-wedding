import { config } from "dotenv";
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

// Dev admin password comes from gitignored .env.local — never hardcoded.
config({ path: ".env.local" });
const PASSWORD = process.env.ADMIN_PASSWORD;

const OUT = "scripts/shots/nitpicks";
mkdirSync(OUT, { recursive: true });
const base = "http://localhost:3000";

const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1120, height: 950 } });
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));

await page.goto(`${base}/admin`, { waitUntil: "networkidle" });
await page.fill('input[name="password"]', PASSWORD);
await page.getByRole("button", { name: /Enter|Checking/ }).click();
await page.waitForURL(`${base}/admin`, { timeout: 6000 }).catch(() => {});
await page.waitForTimeout(900);
await page.screenshot({ path: `${OUT}/1-dashboard-desktop.png`, fullPage: true });

// Add-guest button -> modal
await page.getByRole("button", { name: "Add guest" }).first().click();
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}/2-add-guest-modal.png` });
await page.keyboard.press("Escape");
await page.waitForTimeout(400);

// Mobile: controls layout + card labels
await page.setViewportSize({ width: 390, height: 844 });
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(800);
await page.screenshot({ path: `${OUT}/3-mobile-dashboard.png`, fullPage: true });

console.log("console errors:", errors.length ? errors : "none");
await browser.close();
