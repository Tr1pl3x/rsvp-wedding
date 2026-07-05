// Capture the envelope-drop window frame by frame to hunt a shadow artifact.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const OUT = "scripts/shots/dropframes";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto("http://localhost:3000/rsvp/kenji-watanabe", {
  waitUntil: "networkidle",
});
await page.waitForTimeout(1500);

const t0 = Date.now();
await page.mouse.click(195, 422);
for (let target = 1900; target <= 3100; target += 100) {
  const wait = target - (Date.now() - t0);
  if (wait > 0) await page.waitForTimeout(wait);
  await page.screenshot({ path: `${OUT}/t${String(target).padStart(4, "0")}.png` });
}
await browser.close();
console.log("done");
