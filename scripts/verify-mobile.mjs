// Full guest-journey verification on emulated phones.
//   node scripts/verify-mobile.mjs            (both engines)
//   node scripts/verify-mobile.mjs webkit     (iPhone only)
// Uses marco-vidal (seeded: sent, not yet responded) so kenji stays pristine.
import { chromium, webkit, devices } from "playwright";
import { mkdirSync } from "node:fs";
import { execSync } from "node:child_process";

const TOKEN = "marco-vidal";
const BASE = "http://localhost:3000";
const only = process.argv[2];

const TARGETS = [
  { name: "iphone", engine: webkit, device: devices["iPhone 14 Pro"] },
  { name: "android", engine: chromium, device: devices["Pixel 7"] },
].filter((t) => !only || t.name === (only === "webkit" ? "iphone" : only));

const results = [];
function record(env, check, ok, detail = "") {
  results.push({ env, check, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  [${env}] ${check}${detail ? `  (${detail})` : ""}`);
}

for (const target of TARGETS) {
  // each platform submits the RSVP — reset the guest so both get a fresh form
  execSync(`npx tsx scripts/reset-rsvp.ts ${TOKEN}`, { stdio: "ignore" });
  const OUT = `scripts/shots/mobile-${target.name}`;
  mkdirSync(OUT, { recursive: true });
  const browser = await target.engine.launch(
    target.engine === chromium ? { channel: "msedge" } : {},
  );
  const ctx = await browser.newContext({ ...target.device });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message.slice(0, 160)));
  page.on("requestfailed", (r) => {
    if (!r.url().includes("hot-reload") && !r.failure()?.errorText.includes("Cancel"))
      errors.push(`reqfail ${r.url().slice(-60)}`);
  });
  const vw = target.device.viewport;

  const noHorizOverflow = () =>
    page.evaluate(() => {
      const el = document.scrollingElement;
      return el.scrollWidth <= el.clientWidth + 1;
    });

  // ---- 1. envelope + reveal ----
  await page.goto(`${BASE}/rsvp/${TOKEN}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1600);
  const sealVisible = await page.evaluate(() => {
    const img = [...document.querySelectorAll("img")].find((i) =>
      (i.currentSrc || i.src).includes("rsvp-seal"),
    );
    if (!img || img.offsetHeight < 50 || img.naturalWidth === 0) return false;
    // the load-gate wrapper must have opened
    return getComputedStyle(img.parentElement).opacity === "1";
  });
  record(target.name, "wax seal renders", sealVisible);
  await page.screenshot({ path: `${OUT}/1-envelope.png` });

  await page.touchscreen.tap(Math.round(vw.width / 2), Math.round(vw.height / 2));
  await page.waitForTimeout(4800);
  const heroOk = await page.evaluate(() => {
    const img = [...document.querySelectorAll("img")].find((i) =>
      (i.currentSrc || i.src).includes("front-page-web"),
    );
    return !!img && img.offsetHeight > 300 && img.naturalWidth > 0;
  });
  record(target.name, "envelope opens onto photo hero", heroOk);
  await page.screenshot({ path: `${OUT}/2-hero.png` });

  // ---- 2. incremental scroll through the whole invite ----
  const total = await page.evaluate(() => document.body.scrollHeight);
  let overflowClean = true;
  for (let y = 250; y < total; y += 250) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(90);
    if (!(await noHorizOverflow())) overflowClean = false;
  }
  record(target.name, "no horizontal overflow across scroll", overflowClean);
  await page.waitForTimeout(900);

  const hidden = await page.evaluate(
    () =>
      [...document.querySelectorAll("main *")].filter(
        (el) => getComputedStyle(el).opacity === "0" && el.offsetHeight > 40,
      ).length,
  );
  record(target.name, "all scroll reveals fired", hidden === 0, `${hidden} still hidden`);

  // ---- 3. venue carousel ----
  await page.evaluate(() => {
    document.querySelector('button[aria-label="Next photo"]')?.scrollIntoView({ block: "center" });
  });
  await page.waitForTimeout(1300);
  const carousel = await page.evaluate(() => {
    const btn = document.querySelector('button[aria-label="Next photo"]');
    if (!btn) return null;
    const frame = btn.parentElement;
    const strip = frame.querySelector("div");
    const slide = strip.firstElementChild;
    return {
      visible: frame.offsetHeight > 100 && getComputedStyle(frame).opacity !== "0",
      wrapperOpacity: getComputedStyle(frame.parentElement).opacity,
      touchAction: getComputedStyle(strip).touchAction,
      slideH: slide.offsetHeight,
    };
  });
  record(
    target.name,
    "venue carousel visible",
    !!carousel && carousel.visible && carousel.wrapperOpacity === "1",
    carousel ? `h=${carousel.slideH}` : "not found",
  );
  record(
    target.name,
    "carousel allows vertical page scroll",
    !!carousel && /pan-y/.test(carousel.touchAction),
    carousel?.touchAction,
  );
  await page.click('button[aria-label="Next photo"]');
  await page.waitForTimeout(900);
  const slid = await page.evaluate(() => {
    const btn = document.querySelector('button[aria-label="Next photo"]');
    const frame = btn.parentElement;
    const firstSlide = frame.querySelector("div").firstElementChild;
    return firstSlide.getBoundingClientRect().right <= frame.getBoundingClientRect().left + 6;
  });
  record(target.name, "carousel advances to slide 2", slid);
  await page.screenshot({ path: `${OUT}/3-carousel.png` });

  // ---- 4. RSVP form ----
  await page.goto(`${BASE}/rsvp/${TOKEN}/respond`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  await page.getByText("Yes, I'll be there").tap();
  await page.waitForTimeout(900);

  const fontOk = await page.evaluate(() => {
    const ta = document.querySelector("textarea");
    return ta ? getComputedStyle(ta).fontSize : "no-textarea";
  });
  record(target.name, "textarea font >= 16px (no iOS focus zoom)", fontOk === "16px", fontOk);

  await page.click('button[aria-label="Next dish"]');
  await page.waitForTimeout(700);
  const chooseButtons = page.locator('button[aria-label^="Choose:"]');
  await chooseButtons.nth(1).click();
  await page.waitForTimeout(400);
  const choiceShown = await page.getByText("Your choice:").isVisible();
  record(target.name, "dish selected via carousel", choiceShown);

  await page.fill("#dietary", "No peanuts, please.");
  await page.screenshot({ path: `${OUT}/4-form.png` });
  await page.getByRole("button", { name: /Submit RSVP/i }).click();
  await page.waitForTimeout(2600);
  const confirmed = await page.evaluate(() => {
    const h1 = document.querySelector("h1");
    const pol = [...document.querySelectorAll("img")].find((i) =>
      (i.currentSrc || i.src).includes("thankyou-web"),
    );
    return {
      thanks: h1?.textContent?.includes("Thank You") ?? false,
      polaroid: !!pol && pol.naturalWidth > 0,
    };
  });
  record(target.name, "submit reaches confirmation", confirmed.thanks);
  record(target.name, "keepsake polaroid loads", confirmed.polaroid);
  await page.screenshot({ path: `${OUT}/5-confirmation.png` });

  // ---- 5. return visit + landing ----
  await page.goto(`${BASE}/rsvp/${TOKEN}/respond`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1400);
  const returnVisit = await page.evaluate(
    () => document.querySelector("h1")?.textContent?.includes("Thank You") ?? false,
  );
  record(target.name, "return visit shows confirmation", returnVisit);

  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  record(target.name, "landing page has no overflow", await noHorizOverflow());

  record(target.name, "no page errors / failed requests", errors.length === 0, errors.slice(0, 3).join(" | "));
  await browser.close();
}

const failed = results.filter((r) => !r.ok);
console.log(failed.length ? `\n${failed.length} FAILURE(S)` : "\nALL GOOD — " + results.length + " checks");
process.exit(failed.length ? 1 : 0);
