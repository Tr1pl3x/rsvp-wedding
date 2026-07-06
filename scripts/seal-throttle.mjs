// Reproduce the slow-network seal load: throttle to slow 4G, screenshot the
// envelope early (mid-download) and late (settled). Early frame must show
// clean paper or the finished seal — never a partial square.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const OUT = "scripts/shots/seal-throttle";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const cdp = await page.context().newCDPSession(page);
await cdp.send("Network.enable");
await cdp.send("Network.emulateNetworkConditions", {
  offline: false,
  latency: 150,
  downloadThroughput: (1.2 * 1024 * 1024) / 8, // ~1.2 Mbps
  uploadThroughput: (0.6 * 1024 * 1024) / 8,
});

await page.goto("http://localhost:3000/rsvp/kenji-watanabe", {
  waitUntil: "commit",
});
await page.waitForTimeout(900);
await page.screenshot({ path: `${OUT}/early.png` });
await page.waitForTimeout(4500);
await page.screenshot({ path: `${OUT}/settled.png` });
console.log("done");
await browser.close();
