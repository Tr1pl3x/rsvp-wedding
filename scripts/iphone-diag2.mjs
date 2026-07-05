// Deeper probe: which whileInView reveals are stuck at opacity 0 on the
// emulated iPhone, does real-increment scrolling wake them, and does a
// hand-rolled IntersectionObserver fire for the same element?
import { webkit, devices } from "playwright";

const browser = await webkit.launch();
const ctx = await browser.newContext({ ...devices["iPhone 14 Pro"] });
const page = await ctx.newPage();
page.on("pageerror", (e) => console.log("[pageerror]", e.message.slice(0, 300)));

await page.goto("http://localhost:3000/rsvp/kenji-watanabe", {
  waitUntil: "networkidle",
});
await page.waitForTimeout(1500);
await page.touchscreen.tap(196, 426);
await page.waitForTimeout(4700);

// scroll down in real increments like a human thumb would
for (let y = 200; y <= 1200; y += 200) {
  await page.evaluate((top) => window.scrollTo(0, top), y);
  await page.waitForTimeout(180);
}
await page.waitForTimeout(1200);

const report = await page.evaluate(async () => {
  const zeros = [...document.querySelectorAll("main *")]
    .filter((el) => getComputedStyle(el).opacity === "0" && el.offsetHeight > 40)
    .slice(0, 12)
    .map((el) => ({
      cls: (el.className || "").toString().slice(0, 60),
      h: el.offsetHeight,
      top: Math.round(el.getBoundingClientRect().top + window.scrollY),
    }));

  const btn = document.querySelector('button[aria-label="Next photo"]');
  const wrapper = btn?.closest("section")?.querySelector(".mx-auto.mt-12");
  let ioFired = "no-wrapper";
  if (wrapper) {
    ioFired = await new Promise((resolve) => {
      const io = new IntersectionObserver(
        (entries) => resolve(`fired isIntersecting=${entries[0].isIntersecting}`),
        { rootMargin: "-80px" },
      );
      io.observe(wrapper);
      setTimeout(() => resolve("never-fired"), 1500);
    });
  }
  return { scrollY: window.scrollY, zeros, manualIO: ioFired };
});
console.log(JSON.stringify(report, null, 2));
await browser.close();
