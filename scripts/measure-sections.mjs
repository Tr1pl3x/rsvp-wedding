// Log rendered section heights on the invite at phone width.
import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto("http://localhost:3000/rsvp/kenji-watanabe", {
  waitUntil: "networkidle",
});
await page.waitForTimeout(1500);
await page.mouse.click(195, 422);
await page.waitForTimeout(4500);

const sections = await page.evaluate(() =>
  [...document.querySelectorAll("main section")].map((s) => ({
    h: s.offsetHeight,
    label: (s.querySelector("h2, h1")?.textContent ?? "hero").slice(0, 24),
  })),
);
console.log(JSON.stringify(sections, null, 2));
await browser.close();
