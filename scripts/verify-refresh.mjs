// Proves the refresh button: dashboard open -> an RSVP arrives elsewhere ->
// click refresh -> row updates in place (no full reload, filters preserved).
import { config } from "dotenv";
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

// Dev admin password comes from gitignored .env.local — never hardcoded.
config({ path: ".env.local" });
const PASSWORD = process.env.ADMIN_PASSWORD;

const OUT = "scripts/shots/refresh";
mkdirSync(OUT, { recursive: true });
const base = "http://localhost:3000";

const browser = await chromium.launch({ channel: "msedge" });
const admin = await browser.newPage({ viewport: { width: 1120, height: 900 } });
const errors = [];
admin.on("pageerror", (e) => errors.push(String(e)));

// open dashboard
await admin.goto(`${base}/admin`, { waitUntil: "networkidle" });
await admin.fill('input[name="password"]', PASSWORD);
await admin.getByRole("button", { name: /Enter|Checking/ }).click();
await admin.waitForURL(`${base}/admin`, { timeout: 8000 }).catch(() => {});
await admin.waitForTimeout(900);

// type into search (client state that must survive the refresh)
await admin.fill('input[type="search"]', "mar");
await admin.waitForTimeout(400);
const marcoRow = admin.locator("tbody tr", { hasText: "Marco Vidal" });
const before = await marcoRow.innerText();
console.log("before:", before.replace(/\s+/g, " ").slice(0, 80));

// meanwhile, Marco RSVPs in another tab
const guest = await browser.newPage({ viewport: { width: 390, height: 844 } });
await guest.goto(`${base}/rsvp/marco-vidal/respond`, { waitUntil: "networkidle" });
await guest.getByText("Yes, I'll be there").click();
await guest.waitForTimeout(400);
await guest.locator('button[aria-pressed="false"]').nth(3).click(); // ribeye
await guest.getByRole("button", { name: /Submit RSVP/ }).click();
await guest.waitForTimeout(1500);
await guest.close();

// dashboard unchanged until refresh is clicked
await admin.getByRole("button", { name: "Refresh data" }).click();
await admin.waitForTimeout(1500);
const after = await marcoRow.innerText();
const search = await admin.locator('input[type="search"]').inputValue();
console.log("after :", after.replace(/\s+/g, " ").slice(0, 80));
console.log("search box still contains:", JSON.stringify(search));
await admin.screenshot({ path: `${OUT}/after-refresh.png` });

console.log("errors:", errors.length ? errors : "none");
await browser.close();
