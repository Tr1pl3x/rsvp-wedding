// Drives the full-page RSVP form and screenshots every state.
// Run: node scripts/verify-rsvp.mjs
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const OUT = "scripts/shots/rsvp";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));

const URL = "http://localhost:3000/rsvp/test-token/respond";
await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForTimeout(600);

// 1. Initial form — attending not chosen, submit disabled
await page.screenshot({ path: `${OUT}/1-initial.png` });

// 2. Choose "Yes" — meal carousel + dietary appear
await page.getByText("Yes, I'll be there").click();
await page.waitForTimeout(700);
await page.screenshot({ path: `${OUT}/2-attending.png` });
await page.screenshot({ path: `${OUT}/2b-attending-full.png`, fullPage: true });

// 3. Select the first dish via its tick box
await page.locator('button[aria-pressed="false"]').first().click();
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/3-dish-selected.png` });

// 4. Advance the carousel with the next arrow, then screenshot
await page.getByRole("button", { name: "Next dish" }).click();
await page.waitForTimeout(700);
await page.getByRole("button", { name: "Next dish" }).click();
await page.waitForTimeout(700);
await page.screenshot({ path: `${OUT}/4-carousel-advanced.png` });

// 5. Fill dietary, then submit -> confirmation (attending)
await page.getByLabel("Dietary requirements").fill("No shellfish, please.");
await page.waitForTimeout(200);
await page.getByRole("button", { name: "Submit RSVP" }).click();
await page.waitForTimeout(900);
await page.screenshot({ path: `${OUT}/5-confirmation-attending.png` });
await page.screenshot({ path: `${OUT}/5b-confirmation-attending-full.png`, fullPage: true });

// 6. Declining flow — reload, choose "No"
await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForTimeout(500);
await page.getByText("Unfortunately, I can't come").click();
await page.waitForTimeout(700);
await page.screenshot({ path: `${OUT}/6-declining.png` });

// 7. Note + submit -> confirmation (declining)
await page.getByLabel(/A note to the couple/).fill("Wishing you both all the happiness!");
await page.getByRole("button", { name: "Submit RSVP" }).click();
await page.waitForTimeout(900);
await page.screenshot({ path: `${OUT}/7-confirmation-declining.png` });

console.log("console errors:", errors.length ? errors : "none");
await browser.close();
