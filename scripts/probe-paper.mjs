import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto("http://localhost:3000/rsvp/kenji-watanabe", {
  waitUntil: "networkidle",
});
const token = await page.evaluate(() =>
  getComputedStyle(document.documentElement).getPropertyValue("--color-paper"),
);
console.log("paper token:", JSON.stringify(token));
await browser.close();
