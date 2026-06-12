// Sample each flap's computed transform during the opening animation and
// report the rotation angle over time.
import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto("http://localhost:3000/rsvp/test-token", {
  waitUntil: "networkidle",
});
await page.waitForTimeout(1000);

const result = await page.evaluate(async () => {
  const root = document.querySelector('[aria-label="Open the invitation"]');
  const flaps = [...root.querySelectorAll(":scope > div")].filter(
    (d) => d.style.transformOrigin,
  );
  const names = ["top", "left", "right", "bottom"];

  // angle around X or Y extracted from matrix3d
  const angleOf = (el, axis) => {
    const t = getComputedStyle(el).transform;
    if (t === "none") return 0;
    const m = t.match(/matrix3d\(([^)]+)\)/);
    if (!m) return `2d:${t}`;
    const v = m[1].split(",").map(Number);
    // m[5]=m22=cosX (rotateX), m[0]=m11=cosY (rotateY)
    // sin from m[6]=m23 (rotateX) / m[2]=m13 (rotateY, negated)
    if (axis === "x")
      return Math.round((Math.atan2(v[6], v[5]) * 180) / Math.PI);
    return Math.round((Math.atan2(-v[2], v[0]) * 180) / Math.PI);
  };

  root.dispatchEvent(new MouseEvent("click", { bubbles: true }));

  const samples = [];
  const t0 = performance.now();
  while (performance.now() - t0 < 2600) {
    samples.push({
      t: Math.round(performance.now() - t0),
      top: angleOf(flaps[0], "x"),
      left: angleOf(flaps[1], "y"),
      right: angleOf(flaps[2], "y"),
      bottom: angleOf(flaps[3], "x"),
    });
    await new Promise((r) => setTimeout(r, 150));
  }
  return samples;
});

for (const s of result)
  console.log(
    `t=${String(s.t).padStart(4)}  top=${s.top}  left=${s.left}  right=${s.right}  bottom=${s.bottom}`,
  );
await browser.close();
