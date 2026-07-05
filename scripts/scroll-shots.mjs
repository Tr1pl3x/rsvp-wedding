// Capture the full invite scroll at phone size.
// Usage: node scripts/scroll-shots.mjs [chromium|webkit]
import { chromium, webkit } from "playwright";
import { mkdirSync } from "node:fs";

const engine = process.argv[2] === "webkit" ? "webkit" : "chromium";
const OUT = engine === "webkit" ? "scripts/shots/latte-webkit" : "scripts/shots/latte";
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
await page.screenshot({ path: `${OUT}/0-envelope.png` });

// Open the envelope and let the full choreography + reveal play out
await page.mouse.click(195, 422);
await page.waitForTimeout(4500);

const total = await page.evaluate(() => document.body.scrollHeight);
const step = 800;
let shot = 1;
for (let y = 0; y < total; y += step) {
  await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
  await page.waitForTimeout(900); // let whileInView reveals settle
  await page.screenshot({ path: `${OUT}/${shot}-scroll.png` });
  shot++;
  if (shot > 12) break;
}
console.log(`captured ${shot - 1} scroll shots, page height ${total}px`);

// RSVP form in the same palette
await page.goto("http://localhost:3000/rsvp/kenji-watanabe/respond", {
  waitUntil: "networkidle",
});
await page.waitForTimeout(1200);
await page.screenshot({ path: `${OUT}/form.png` });

// Public landing page (mirrors the hero treatment)
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.waitForTimeout(800);
await page.screenshot({ path: `${OUT}/landing.png` });
await browser.close();
