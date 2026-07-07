// Verifies the RSVP deadline lockout end to end against the local dev server:
//   1. deadline in the past  -> unanswered guest sees the closed notice (no form)
//   2. deadline in the past  -> invite CTA is the muted "RSVPs have closed" pill
//   3. deadline in the future-> form is back (lockout is fully settings-driven)
//   4. guest submits, then deadline passes -> confirmation still shown
// Restores the original deadline and re-arms the test guest afterwards.
//   node scripts/verify-lockout.mjs
import { execSync } from "node:child_process";
import { chromium } from "playwright";

const base = "http://localhost:3000";
const TOKEN = "marco-vidal"; // the E2E submit-test guest
const PAST = "2020-01-01";
const FUTURE = "2099-12-31";

const run = (cmd) => execSync(cmd, { stdio: "pipe" }).toString().trim();
const setDeadline = (v) => run(`npx tsx scripts/set-deadline.ts ${v}`);
const lastLine = (s) => s.split(/\r?\n/).filter(Boolean).pop();

const original = lastLine(run("npx tsx scripts/set-deadline.ts"));
console.log(`current deadline: ${original || "(unset)"}`);

const results = [];
const check = (name, ok, detail = "") => {
  results.push(ok);
  console.log(`${ok ? "PASS " : "FAIL "} ${name}${detail ? `  (${detail})` : ""}`);
};

const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

try {
  run(`npx tsx scripts/reset-rsvp.ts ${TOKEN}`);

  // -- locked, unanswered guest --------------------------------------------
  setDeadline(PAST);
  await page.goto(`${base}/rsvp/${TOKEN}/respond`, { waitUntil: "networkidle" });
  const noticeShown = await page
    .getByText("RSVPs Have Closed")
    .isVisible()
    .catch(() => false);
  const formGone = (await page.locator('input[name="attending"]').count()) === 0;
  check("closed notice replaces the form", noticeShown && formGone);

  // -- locked invite CTA ----------------------------------------------------
  await page.goto(`${base}/rsvp/${TOKEN}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  const html = await page.content();
  const ctaMuted = html.includes("RSVPs have closed");
  const rsvpLinkGone = !html.includes(`/rsvp/${TOKEN}/respond`);
  check("invite CTA muted, respond link gone", ctaMuted && rsvpLinkGone);

  // -- reopened via settings alone -----------------------------------------
  setDeadline(FUTURE);
  await page.goto(`${base}/rsvp/${TOKEN}/respond`, { waitUntil: "networkidle" });
  const formBack = (await page.locator('input[name="attending"]').count()) > 0;
  check("moving the deadline forward reopens the form", formBack);

  // -- responded guest keeps confirmation while locked ----------------------
  await page.getByText("Yes, I'll be there").click();
  await page.waitForTimeout(1200);
  await page.getByText("CHOOSE THIS DISH").first().click();
  await page.waitForTimeout(400);
  await page.getByRole("button", { name: /Submit RSVP/i }).click();
  await page.waitForTimeout(2500);
  const submitted = await page
    .getByText("Thank You!")
    .isVisible()
    .catch(() => false);
  check("guest can submit while open", submitted);

  setDeadline(PAST);
  await page.goto(`${base}/rsvp/${TOKEN}/respond`, { waitUntil: "networkidle" });
  const confirmationKept = await page
    .getByText("Thank You!")
    .isVisible()
    .catch(() => false);
  check("responded guest still sees confirmation while locked", confirmationKept);
} finally {
  await browser.close();
  if (original) setDeadline(original);
  run(`npx tsx scripts/reset-rsvp.ts ${TOKEN}`);
  console.log(`restored deadline to ${original || "(unset)"}, reset ${TOKEN}`);
}

const failed = results.filter((r) => !r).length;
console.log(failed === 0 ? "\nALL GOOD" : `\n${failed} CHECK(S) FAILED`);
if (failed > 0) process.exitCode = 1;
