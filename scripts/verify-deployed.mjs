// Post-promote smoke test for the DEPLOYED environments (playground + production).
//   node scripts/verify-deployed.mjs
//
// Asserts status codes as well as page text — a lesson from the 2026-07-04
// incident, where error responses still contained plausible-looking HTML.
// Admin-login checks need PREVIEW_ADMIN_PASSWORD / PROD_ADMIN_PASSWORD in
// .env.local (gitignored); they are SKIPPED when absent.
import { config } from "dotenv";

config({ path: ".env.local" });

const ENVS = [
  {
    name: "playground",
    base: "https://rsvp-wedding-git-dev-pyae-sones-projects-aa9a4476.vercel.app",
    password: process.env.PREVIEW_ADMIN_PASSWORD,
    seededGuest: true, // dev DB carries the test guests
    badge: "Dev",
  },
  {
    name: "production",
    base: "https://rsvp-wedding-psi.vercel.app",
    password: process.env.PROD_ADMIN_PASSWORD,
    seededGuest: false, // prod guest list is empty until go-live
    badge: null, // production header intentionally carries no env badge
  },
];

const results = [];
function record(env, check, ok, detail = "") {
  results.push({ env, check, status: ok, detail });
}

const HICCUP = /A Small Hiccup|Something went wrong/;

async function get(url, opts = {}) {
  const res = await fetch(url, { redirect: "manual", ...opts });
  const body = res.headers.get("content-type")?.includes("text")
    ? await res.text()
    : "";
  return { status: res.status, body, headers: res.headers };
}

for (const env of ENVS) {
  const { name, base } = env;
  try {
    // landing
    const landing = await get(`${base}/`);
    record(
      name,
      "landing page",
      landing.status === 200 &&
        landing.body.includes("Harry") &&
        !HICCUP.test(landing.body),
      `HTTP ${landing.status}`,
    );

    // seeded guest (playground only) — the durable README demo invite
    if (env.seededGuest) {
      const guest = await get(`${base}/rsvp/demo-invite`);
      record(
        name,
        "seeded invite (demo-invite)",
        guest.status === 200 &&
          guest.body.includes("Hi Alex Taylor,") &&
          !HICCUP.test(guest.body),
        `HTTP ${guest.status}`,
      );
    }

    // junk token -> clean not-found, never the error boundary
    const junk = await get(`${base}/rsvp/__smoke_test__`);
    record(
      name,
      "bad token -> not found",
      [200, 404].includes(junk.status) &&
        junk.body.includes("Invitation Not Found") &&
        !HICCUP.test(junk.body),
      `HTTP ${junk.status}`,
    );

    // admin gate
    const admin = await get(`${base}/admin`);
    record(
      name,
      "admin redirects to login",
      admin.status === 307 &&
        (admin.headers.get("location") ?? "").includes("/admin/login"),
      `HTTP ${admin.status}`,
    );

    // robots + og image
    const robots = await get(`${base}/robots.txt`);
    record(
      name,
      "robots.txt",
      robots.status === 200 && robots.body.includes("Disallow: /admin"),
      `HTTP ${robots.status}`,
    );
    const og = await fetch(`${base}/opengraph-image`);
    record(
      name,
      "og image",
      og.status === 200 &&
        (og.headers.get("content-type") ?? "").includes("image/png"),
      `HTTP ${og.status}`,
    );

    // authed admin dashboard (the blind spot) — needs the password
    if (!env.password) {
      record(name, "admin dashboard (login)", null, "SKIPPED — no password in .env.local");
    } else {
      const { chromium } = await import("playwright");
      const browser = await chromium.launch({ channel: "msedge" });
      try {
        const page = await browser.newPage();
        await page.goto(`${base}/admin`, { waitUntil: "networkidle" });
        await page.fill('input[name="password"]', env.password);
        await page.getByRole("button", { name: /Enter|Checking/ }).click();
        await page.waitForURL(/\/admin$/, { timeout: 15000 });
        await page.waitForTimeout(1500);
        const text = await page.locator("body").innerText();
        // Dev must show its amber badge; prod must NOT show any env badge.
        const badgeOk = env.badge
          ? text.toUpperCase().includes(env.badge.toUpperCase())
          : !/\bPROD\b|\bDEV\b/i.test(text);
        record(
          name,
          "admin dashboard (login)",
          text.includes("Guest List") &&
            text.includes("RESPONDED") &&
            badgeOk &&
            !HICCUP.test(text),
          `badge=${env.badge ?? "none expected"}`,
        );
      } catch (e) {
        record(name, "admin dashboard (login)", false, String(e).slice(0, 80));
      } finally {
        await browser.close();
      }
    }
  } catch (e) {
    record(name, "environment reachable", false, String(e).slice(0, 80));
  }
}

// report
let failed = 0;
console.log("");
for (const r of results) {
  const mark = r.status === null ? "SKIP" : r.status ? "PASS" : "FAIL";
  if (r.status === false) failed++;
  console.log(
    `${mark.padEnd(5)} [${r.env.padEnd(10)}] ${r.check.padEnd(28)} ${r.detail}`,
  );
}
console.log(
  `\n${failed === 0 ? "ALL GOOD" : `${failed} CHECK(S) FAILED`} — ${results.length} checks run`,
);
if (failed > 0) process.exitCode = 1;
