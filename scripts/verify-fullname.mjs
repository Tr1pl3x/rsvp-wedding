// Adds "Pyae Sone Oo" via the real admin flow, then screenshots the envelope
// greeting, the RSVP form, and the confirmation with the full name.
import { config } from "dotenv";
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

// Dev admin password comes from gitignored .env.local — never hardcoded.
config({ path: ".env.local" });
const PASSWORD = process.env.ADMIN_PASSWORD;

const OUT = "scripts/shots/fullname";
mkdirSync(OUT, { recursive: true });
const base = "http://localhost:3000";

const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1120, height: 900 } });
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));

// login + add the guest
await page.goto(`${base}/admin`, { waitUntil: "networkidle" });
await page.fill('input[name="password"]', PASSWORD);
await page.getByRole("button", { name: /Enter|Checking/ }).click();
await page.waitForURL(`${base}/admin`, { timeout: 8000 }).catch(() => {});
await page.waitForTimeout(900);
await page.getByRole("button", { name: "Add guest" }).first().click();
const dialog = page.getByRole("dialog");
await dialog.locator('input[name="name"]').fill("Pyae Sone Oo");
await dialog.getByRole("button", { name: /Add guest|Adding/ }).click();
await page.waitForTimeout(1400);

// newest-first puts him on top; read his token from the first row
const token = (
  await page.locator("tbody tr").first().locator(".font-mono").textContent()
).trim();
console.log("token:", token);

// envelope greeting on a phone viewport
const phone = await browser.newPage({ viewport: { width: 390, height: 844 } });
phone.on("pageerror", (e) => errors.push(String(e)));
await phone.goto(`${base}/rsvp/${token}`, { waitUntil: "networkidle" });
await phone.waitForTimeout(2200);
await phone.screenshot({ path: `${OUT}/1-envelope.png` });

// RSVP form greeting + confirmation with full name
await phone.goto(`${base}/rsvp/${token}/respond`, { waitUntil: "networkidle" });
await phone.waitForTimeout(600);
await phone.screenshot({ path: `${OUT}/2-form.png` });
await phone.getByText("Yes, I'll be there").click();
await phone.waitForTimeout(500);
await phone.locator('button[aria-pressed="false"]').first().click();
await phone.getByRole("button", { name: /Submit RSVP/ }).click();
await phone.waitForTimeout(1500);
await phone.screenshot({ path: `${OUT}/3-confirmation.png` });

console.log("console errors:", errors.length ? errors : "none");
await browser.close();
