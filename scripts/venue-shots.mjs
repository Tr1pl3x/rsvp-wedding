// Drive the venue carousel: capture default, then click through both arrows.
// Usage: node scripts/venue-shots.mjs [chromium|webkit]
import { chromium, webkit } from "playwright";
import { mkdirSync } from "node:fs";

const engine = process.argv[2] === "webkit" ? "webkit" : "chromium";
const OUT = `scripts/shots/venue-${engine}`;
mkdirSync(OUT, { recursive: true });

const browser =
  engine === "webkit"
    ? await webkit.launch()
    : await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto("http://localhost:3000/rsvp/kenji-watanabe", {
  waitUntil: "networkidle",
});
await page.waitForTimeout(1500);
await page.mouse.click(195, 422);
await page.waitForTimeout(4500);

await page.evaluate(() => window.scrollTo({ top: 1150, behavior: "instant" }));
await page.waitForTimeout(1400);
await page.screenshot({ path: `${OUT}/slide-1.png` });

const next = page.getByRole("button", { name: "Next photo" });
await next.click();
await page.waitForTimeout(900);
await page.screenshot({ path: `${OUT}/slide-2.png` });

await next.click();
await page.waitForTimeout(900);
await page.screenshot({ path: `${OUT}/slide-3.png` });

// wrap-around check: next from the last slide returns to the first
await next.click();
await page.waitForTimeout(900);
await page.screenshot({ path: `${OUT}/slide-wrap.png` });

console.log("done");
await browser.close();
