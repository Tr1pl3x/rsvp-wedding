// Deadline date-picker E2E: legacy value converts, picking a date saves ISO,
// guests see prose, then restore the seed value.
import { chromium } from "playwright";
import { config } from "dotenv";

config({ path: ".env.local", quiet: true });

const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1100, height: 800 } });
const results = [];
const record = (check, ok, detail = "") => {
  results.push(ok);
  console.log(`${ok ? "PASS" : "FAIL"}  ${check}${detail ? `  (${detail})` : ""}`);
};

// login
await page.goto("http://localhost:3000/admin/login", { waitUntil: "networkidle" });
await page.fill("#password", process.env.ADMIN_PASSWORD ?? "");
await page.click('button[type="submit"]');
await page.waitForURL("**/admin", { timeout: 15000 });

// settings: date input with converted value + prose preview
await page.goto("http://localhost:3000/admin/settings", { waitUntil: "networkidle" });
const input = page.locator("#rsvpDeadline");
record("deadline input is type=date", (await input.getAttribute("type")) === "date");
const initial = await input.inputValue();
record("legacy/seed value converts to ISO", /^\d{4}-\d{2}-\d{2}$/.test(initial), initial);
record(
  "prose preview shown",
  (await page.getByText("Guests will see:").textContent())?.includes("September") ?? false,
);

// pick a different date and save
await input.fill("2026-10-03");
await page.getByRole("button", { name: /Save settings/i }).click();
await page.getByText("Saved.", { exact: true }).waitFor({ timeout: 15000 });

// guest pages render the prose
const invite = await (await page.goto("http://localhost:3000/rsvp/test-token")).text();
record("invite shows '3 October 2026'", invite.includes("3 October 2026"));
const respond = await (await page.goto("http://localhost:3000/rsvp/test-token/respond")).text();
record("respond shows '3 October 2026'", respond.includes("3 October 2026"));

// restore the seed deadline
await page.goto("http://localhost:3000/admin/settings", { waitUntil: "networkidle" });
await page.locator("#rsvpDeadline").fill("2026-09-15");
await page.getByRole("button", { name: /Save settings/i }).click();
await page.getByText("Saved.", { exact: true }).waitFor({ timeout: 15000 });
const restored = await (await page.goto("http://localhost:3000/rsvp/test-token")).text();
record("restored to '15 September 2026'", restored.includes("15 September 2026"));

await browser.close();
console.log(results.every(Boolean) ? "\nALL GOOD" : "\nFAILURES");
process.exit(results.every(Boolean) ? 0 : 1);
