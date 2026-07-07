<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project conventions

**Branches/deploys:** all work on `dev` (auto-deploys to the Vercel preview "playground" + Neon dev DB). `main` = production (Neon production branch; LIVE — real guests and RSVPs, promote deliberately). "Promote" = merge dev→main. Never run `next build` while `next dev` is serving — it corrupts the dev cache (kill :3000, delete `.next/dev`, restart). Restart the dev server after ADDING a Tailwind `@theme` token; edits to existing tokens hot-reload, new ones don't.

**Mobile is the product.** Guests open tokenized links on phones. After any guest-facing change run `node scripts/verify-mobile.mjs` — the full journey (envelope → invite → form → submit → confirmation) on emulated iPhone (WebKit) and Pixel (Chromium), 28 checks. Chromium alone passes bugs that break real iOS: prefer border-radius clips over CSS image masks, put `aspect-[x/y]` on the element that owns the height (no `h-full` chains through aspect boxes), use `svh` (not `dvh`) for full-viewport photo sections, keep inputs at `text-base` (16px) or iOS zooms on focus.

**Images:** photo originals in `public/` are gitignored; only `*-web.jpg` derivatives ship — create them with `node scripts/make-web-copy.mjs <src> <out> [width] [quality]`. Any photo with a reveal animation gates on load via `useImageLoaded` (fade needs inView AND loaded). Transparent PNGs must carry backdrop-colored RGB under their alpha (progressive decode shows RGB before alpha).

**Verification tools** (screenshots → gitignored `scripts/shots/`): `scroll-shots.mjs [webkit]` full invite, `venue-shots.mjs` carousel, `confirm-shots.mjs` confirmation (prints heights — must stay ≤844px), `drop-frames.mjs` envelope choreography, `seal-throttle.mjs` slow network, `verify-lockout.mjs` deadline lockout E2E (flips the dev deadline, restores after), `set-deadline.ts [date]` read/set the dev deadline, `reset-rsvp.ts <token>` re-arms a test guest (`marco-vidal` is the E2E one; keep `kenji-watanabe` pristine for manual demos). The RSVP lockout is settings-driven: once the deadline day ends (Bangkok time) the form closes server-side; moving the date in admin Settings reopens it — no deploy needed.

**Secrets:** `.env.local` is gitignored and must never be committed (Neon URLs, session secret, admin passwords). Prod migrations require explicit user authorization. Seeding refuses production without `SEED_ALLOW_WIPE=1`.
