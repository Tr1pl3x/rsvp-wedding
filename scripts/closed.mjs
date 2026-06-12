// Screenshot the closed envelope on phone-sized and tall-phone viewports.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

mkdirSync("scripts/shots", { recursive: true });
const browser = await chromium.launch({ channel: "msedge" });

for (const [name, viewport] of [
  ["closed-iphone", { width: 390, height: 844 }],
  ["closed-iphone-promax", { width: 430, height: 932 }],
]) {
  const page = await browser.newPage({ viewport });
  await page.goto("http://localhost:3000/rsvp/test-token", {
    waitUntil: "networkidle",
  });
  await page.waitForTimeout(4200);
  await page.screenshot({ path: `scripts/shots/${name}.png` });
  await page.close();
}
await browser.close();
