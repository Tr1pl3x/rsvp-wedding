// Screenshot a local HTML file (mockup QA before republishing).
import { chromium } from "playwright";

const [file, out, width = "420"] = process.argv.slice(2);
const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({
  viewport: { width: Number(width), height: 900 },
});
await page.goto("file:///" + file.replaceAll("\\", "/"), {
  waitUntil: "networkidle",
});
await page.waitForTimeout(600);
await page.screenshot({ path: out, fullPage: true });
console.log("saved", out);
await browser.close();
