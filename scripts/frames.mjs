// Capture the envelope opening frame-by-frame to debug flap rotation.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const OUT = "scripts/shots/frames";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto("http://localhost:3000/rsvp/test-token", {
  waitUntil: "networkidle",
});
await page.waitForTimeout(1500);

const t0 = Date.now();
await page.mouse.click(195, 422);
for (let i = 1; i <= 18; i++) {
  const target = i * 200;
  const wait = target - (Date.now() - t0);
  if (wait > 0) await page.waitForTimeout(wait);
  await page.screenshot({
    path: `${OUT}/t${String(target).padStart(4, "0")}.png`,
  });
}
await browser.close();
