// Dev-only smoke driver: screenshots the envelope, the opening animation,
// the revealed sections, and the RSVP modal. Run: node scripts/verify-page.mjs
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const OUT = "scripts/shots";
mkdirSync(OUT, { recursive: true });

// iPhone-ish viewport — guests will overwhelmingly open this on a phone
const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));

await page.goto("http://localhost:3000/rsvp/test-token", {
  waitUntil: "networkidle",
});

// 1. Sealed envelope after all entry text has appeared
await page.waitForTimeout(4500);
await page.screenshot({ path: `${OUT}/1-envelope-closed.png` });

// 2. Mid-open: click the seal, catch the flaps in motion
await page.mouse.click(195, 422);
await page.waitForTimeout(900);
await page.screenshot({ path: `${OUT}/2-flaps-opening-early.png` });
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}/3-flaps-opening-late.png` });

// 3. Fully revealed hero
await page.waitForTimeout(1500);
await page.screenshot({ path: `${OUT}/4-hero-revealed.png` });

// 4. Scroll through sections
const sections = [
  ["5-schedule", 1.0],
  ["6-location", 2.0],
  ["7-dresscode", 2.9],
  ["8-details", 3.7],
  ["9-cta", 4.7],
];
for (const [name, vh] of sections) {
  await page.evaluate((y) => window.scrollTo(0, window.innerHeight * y), vh);
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `${OUT}/${name}.png` });
}

// 5. RSVP modal: form, error state, confirmation
await page.getByRole("button", { name: "RSVP" }).click();
await page.waitForTimeout(800);
await page.screenshot({ path: `${OUT}/10-rsvp-form.png` });
await page.getByRole("button", { name: "Submit" }).click();
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/11-rsvp-error.png` });
await page.getByText("Yes, I will be there").click();
await page.getByLabel("Dietary requirements").fill("Vegetarian, no peanuts");
await page.getByRole("button", { name: "Submit" }).click();
await page.waitForTimeout(900);
await page.screenshot({ path: `${OUT}/12-rsvp-confirmation.png` });

console.log("console errors:", errors.length ? errors : "none");
await browser.close();
