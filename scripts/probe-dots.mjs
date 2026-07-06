// Check the attire tone dots: position, reveal state, computed styles.
import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto("http://localhost:3000/rsvp/kenji-watanabe", {
  waitUntil: "networkidle",
});
await page.waitForTimeout(1500);
await page.mouse.click(195, 422);
await page.waitForTimeout(5000);

const target = await page.evaluate(() => {
  const strip = document.querySelector('[role="img"][aria-label^="Ideal colour"]');
  if (!strip) return null;
  return strip.getBoundingClientRect().top + window.scrollY;
});
console.log("strip document y:", target);
await page.evaluate((y) => window.scrollTo(0, y - 400), target);
await page.waitForTimeout(2200);

const state = await page.evaluate(() => {
  const strip = document.querySelector('[role="img"][aria-label^="Ideal colour"]');
  const dots = [...strip.children].map((d) => {
    const cs = getComputedStyle(d);
    return { opacity: cs.opacity, transform: cs.transform.slice(0, 40), w: d.offsetWidth, bg: cs.backgroundColor };
  });
  return { rectTop: Math.round(strip.getBoundingClientRect().top), dots: dots.slice(0, 3), count: dots.length };
});
console.log(JSON.stringify(state, null, 2));
await page.screenshot({ path: "scripts/shots/dots-probe.png" });
await browser.close();
