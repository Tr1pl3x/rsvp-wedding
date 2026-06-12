// Manually rotate the top flap to fixed angles (bypassing framer) to check
// how the 3D faces render at each angle.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const OUT = "scripts/shots/probe";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto("http://localhost:3000/rsvp/test-token", {
  waitUntil: "networkidle",
});
await page.waitForTimeout(1000);

// The flaps are the first four children (after the defs svg) of the
// envelope root. Identify them by transform-origin.
const info = await page.evaluate(() => {
  const root = document.querySelector('[aria-label="Open the invitation"]');
  const flaps = [...root.querySelectorAll(":scope > div")].filter((d) =>
    d.style.transformOrigin,
  );
  return flaps.map((f) => ({
    origin: f.style.transformOrigin,
    transform: getComputedStyle(f).transform,
    transformStyle: getComputedStyle(f).transformStyle,
    willChange: getComputedStyle(f).willChange,
  }));
});
console.log(JSON.stringify(info, null, 2));

for (const angle of [20, 60, 120, 170]) {
  await page.evaluate((a) => {
    const root = document.querySelector('[aria-label="Open the invitation"]');
    const flaps = [...root.querySelectorAll(":scope > div")].filter((d) =>
      d.style.transformOrigin,
    );
    // top flap has origin "50% 0%"
    const top = flaps.find((f) => f.style.transformOrigin.includes("0%"));
    top.style.transform = `rotateX(${a}deg)`;
  }, angle);
  await page.waitForTimeout(150);
  await page.screenshot({ path: `${OUT}/rotX-${angle}.png` });
}
await browser.close();
