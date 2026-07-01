// Verifies admin v2: meals row + confirmed seats, seats per guest, newest-on-top,
// search/filter, invite modal + copy→mark-sent, settings save → guest deadline.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const OUT = "scripts/shots/admin-v2";
mkdirSync(OUT, { recursive: true });
const base = "http://localhost:3000";

const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1120, height: 950 } });
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));

// login
await page.goto(`${base}/admin`, { waitUntil: "networkidle" });
await page.fill('input[name="password"]', "huahin2026");
await page.getByRole("button", { name: /Enter|Checking/ }).click();
await page.waitForURL(`${base}/admin`, { timeout: 6000 }).catch(() => {});
await page.waitForTimeout(1000);
await page.screenshot({ path: `${OUT}/1-dashboard.png`, fullPage: true });

// add guest -> should appear on top (Newest default sort)
await page.fill('input[name="name"]', "Wendell Okonkwo");
await page.getByRole("button", { name: "Add guest" }).click();
await page.waitForTimeout(1300);
await page.screenshot({ path: `${OUT}/2-after-add-newest.png`, fullPage: true });

// filter: Attending
await page.locator("#filter").selectOption("attending");
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}/3-filter-attending.png`, fullPage: true });

// search
await page.locator("#filter").selectOption("everyone");
await page.fill('input[type="search"]', "mar");
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}/4-search.png`, fullPage: true });
await page.fill('input[type="search"]', "");
await page.waitForTimeout(300);

// invite modal (top guest = Wendell)
await page.getByRole("button", { name: "Invite" }).first().click();
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUT}/5-invite-modal.png` });
await page.getByRole("button", { name: /Copy message/ }).click();
await page.waitForTimeout(900);
await page.screenshot({ path: `${OUT}/6-invite-copied.png` });
await page.keyboard.press("Escape");
await page.waitForTimeout(500);
// confirm the copied guest is now "Sent"
await page.screenshot({ path: `${OUT}/6b-after-modal.png`, fullPage: true });

// settings
await page.getByRole("link", { name: "Settings" }).click();
await page.waitForTimeout(800);
await page.screenshot({ path: `${OUT}/7-settings.png`, fullPage: true });
await page.fill("#rsvpDeadline", "30 September 2026");
await page.getByRole("button", { name: /Save settings|Saving/ }).click();
await page.waitForTimeout(1100);
await page.screenshot({ path: `${OUT}/8-settings-saved.png` });

// guest side reflects the new deadline
const gp = await browser.newPage({ viewport: { width: 390, height: 844 } });
await gp.goto(`${base}/rsvp/test-token/respond`, { waitUntil: "networkidle" });
await gp.waitForTimeout(500);
const deadlineText = await gp
  .locator("text=/Please RSVP before/")
  .textContent()
  .catch(() => "");
console.log("guest deadline text:", JSON.stringify((deadlineText || "").trim()));
await gp.screenshot({ path: `${OUT}/9-guest-deadline.png` });

console.log("console errors:", errors.length ? errors : "none");
await browser.close();
