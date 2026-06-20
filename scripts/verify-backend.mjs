// Verifies the mock-backed data layer: per-token SSR names, real submission +
// persistence, the return-visit, the pre-seeded responded guest, and not-found.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const OUT = "scripts/shots/backend";
mkdirSync(OUT, { recursive: true });
const base = "http://localhost:3000";

const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));

// 1. SSR name for a specific token (Marco Vidal -> greeted "Marco")
await page.goto(`${base}/rsvp/marco-vidal/respond`, { waitUntil: "networkidle" });
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}/1-form-marco.png` });

// 2. Real submission -> persists via Server Action -> confirmation
await page.getByText("Yes, I'll be there").click();
await page.waitForTimeout(500);
await page.locator('button[aria-pressed="false"]').first().click();
await page.getByLabel("Dietary requirements").fill("Pescatarian");
await page.getByRole("button", { name: /Submit RSVP/ }).click();
await page.waitForTimeout(1200);
await page.screenshot({ path: `${OUT}/2-confirm-marco.png` });

// 3. Return-visit: reload the same token -> confirmation directly (persisted)
await page.goto(`${base}/rsvp/marco-vidal/respond`, { waitUntil: "networkidle" });
await page.waitForTimeout(700);
await page.screenshot({ path: `${OUT}/3-returnvisit-marco.png` });

// 4. Pre-seeded responded guest (Priya, beef) -> confirmation directly
await page.goto(`${base}/rsvp/priya-anand/respond`, { waitUntil: "networkidle" });
await page.waitForTimeout(700);
await page.screenshot({ path: `${OUT}/4-seeded-priya.png` });

// 5. Decline flow for another token (Théo)
await page.goto(`${base}/rsvp/theo-laurent/respond`, { waitUntil: "networkidle" });
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}/5a-form-theo.png` });
await page.getByText("Unfortunately, I can't come").click();
await page.getByLabel(/A note to the couple/).fill("Congratulations to you both!");
await page.getByRole("button", { name: /Submit RSVP/ }).click();
await page.waitForTimeout(1200);
await page.screenshot({ path: `${OUT}/5b-confirm-theo.png` });

// 6. Invalid token -> not-found page
await page.goto(`${base}/rsvp/no-such-token-xyz/respond`, { waitUntil: "networkidle" });
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}/6-notfound.png` });

// 7. Invitation envelope greets by name (Priya)
await page.goto(`${base}/rsvp/priya-anand`, { waitUntil: "networkidle" });
await page.waitForTimeout(1400);
await page.screenshot({ path: `${OUT}/7-envelope-priya.png` });

console.log("console errors:", errors.length ? errors : "none");
await browser.close();
