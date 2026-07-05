// Reproduce the venue-carousel report on an emulated iPhone (WebKit, DPR 3,
// iOS UA, touch) and dump the layout numbers + console errors.
import { webkit, devices } from "playwright";
import { mkdirSync } from "node:fs";

mkdirSync("scripts/shots/iphone", { recursive: true });

const browser = await webkit.launch();
const ctx = await browser.newContext({ ...devices["iPhone 14 Pro"] });
const page = await ctx.newPage();
page.on("console", (m) => {
  if (m.type() === "error" || m.type() === "warning")
    console.log(`[console.${m.type()}]`, m.text().slice(0, 200));
});
page.on("pageerror", (e) => console.log("[pageerror]", e.message.slice(0, 300)));
page.on("requestfailed", (r) => {
  if (r.url().includes("venue")) console.log("[requestfailed]", r.url().slice(0, 120));
});

await page.goto("http://localhost:3000/rsvp/kenji-watanabe", {
  waitUntil: "networkidle",
});
await page.waitForTimeout(1500);
await page.touchscreen.tap(196, 426);
await page.waitForTimeout(4700);
await page.evaluate(() => window.scrollTo({ top: 1150, behavior: "instant" }));
await page.waitForTimeout(1600);

const diag = await page.evaluate(() => {
  const btn = document.querySelector('button[aria-label="Next photo"]');
  const carousel = btn ? btn.parentElement : null;
  const chain = [];
  let el = carousel;
  for (let i = 0; el && i < 7; i++) {
    const cs = getComputedStyle(el);
    chain.push({
      tag: el.tagName,
      cls: (el.className || "").toString().slice(0, 70),
      w: el.offsetWidth,
      h: el.offsetHeight,
      opacity: cs.opacity,
      display: cs.display,
    });
    el = el.parentElement;
  }
  const imgs = [...document.querySelectorAll("img")]
    .filter((i) => (i.currentSrc || i.src || "").includes("venue"))
    .map((i) => ({
      src: (i.currentSrc || i.src).split("/").pop().slice(0, 60),
      w: i.offsetWidth,
      h: i.offsetHeight,
      complete: i.complete,
      naturalW: i.naturalWidth,
    }));
  return { found: !!btn, chain, imgs, scrollY: window.scrollY };
});
console.log(JSON.stringify(diag, null, 2));
await page.screenshot({ path: "scripts/shots/iphone/location.png" });
console.log("screenshot saved");
await browser.close();
