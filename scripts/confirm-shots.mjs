// Confirmation page with the thank-you photo: attending + declined guests.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const OUT = "scripts/shots/confirm";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

for (const [token, name] of [
  ["priya-anand", "attending"],
  ["amara-okafor", "declined"],
]) {
  await page.goto(`http://localhost:3000/rsvp/${token}/respond`, {
    waitUntil: "networkidle",
  });
  await page.waitForTimeout(1500);
  const h = await page.evaluate(() => document.body.scrollHeight);
  console.log(`${name}: page height ${h}px (viewport 844)`);
  await page.screenshot({ path: `${OUT}/${name}.png` });
}
await browser.close();
console.log("done");
