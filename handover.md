# Handover Document - Harry & Susan Wedding RSVP App

## Project Overview

A custom wedding RSVP web app for Harry & Susan's wedding. This is a passion project, not a product.

- **Couple**: Harry & Susan
- **Date**: 21 December 2026
- **Venue**: InterContinental Hua Hin Resort, Hua Hin, Thailand
- **Guest count**: ~55 expected, 100 max capacity
- **RSVP deadline**: 15 March 2026 (hardcoded in modal text)
- **Wedding organizer contact**: Amelia, +31 684 396 988

---

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Next.js 16 (App Router) | Single app — no separate backend |
| Styling | Tailwind CSS v4 | `@theme inline` block in `globals.css` |
| Animations | Framer Motion | Heavy use throughout |
| Icons | Phosphor Icons (`@phosphor-icons/react`) | No emojis anywhere |
| Fonts | Great Vibes (script headings), Geist (body) | Loaded via `next/font/google` |
| Database | Neon PostgreSQL + Prisma ORM | Not yet set up (Phase 3) |
| Deployment | Vercel | Not yet deployed |

### Dev Environment

- `next.config.ts` allows dev origin `192.168.0.136` (local network testing)
- Path alias: `@/*` maps to `./src/*`
- TypeScript strict mode enabled
- Node project — run `npm install` then `npm run dev`

---

## Current State

### Build Phase: 2 of 6 (Friend Feedback + Content Lock)

| Phase | Description | Status |
|-------|------------|--------|
| 1 | Guest-facing mockup (static) | DONE |
| 2 | Friend feedback + content lock | CURRENT |
| 3 | Database + API routes (Neon + Prisma + Next.js API) | Not started |
| 4 | Wire up guest side (SSR, tokens, working RSVP) | Not started |
| 5 | Admin dashboard (guest list, invite kit, QR, CSV) | Not started |
| 6 | Polish + deploy | Not started |

The app is a **static mockup** right now. There is no database, no API, and no real RSVP submission. Everything is hardcoded with placeholder data. The root route (`/`) redirects to `/rsvp/test-token` with a hardcoded guest name "John Smith".

---

## Architecture

### Routing

```
/                     -> Redirects to /rsvp/test-token (dev only)
/rsvp/[token]         -> Guest-facing page (currently static, Phase 4: SSR with real token lookup)
/admin/*              -> Admin dashboard (Phase 5, not started)
/api/*                -> API routes for guest CRUD, RSVP, auth (Phase 3, not started)
```

### Guest Access Model (Planned)

- Guests access via unique token URL: `/rsvp/{token}`
- No login required for guests
- Token maps to a guest/household in the database
- Status tracking: `not_sent` / `sent` / `responded`

### Admin Auth (Planned)

- Single shared password stored as env var
- Session cookie for persistence
- No user accounts — just one admin password

---

## File Structure

```
src/
  app/
    globals.css              # Tailwind theme (colors, fonts) + keyframe animations
    layout.tsx               # Root layout — loads Geist + Great Vibes fonts
    page.tsx                 # Dev redirect to /rsvp/test-token
    rsvp/
      [token]/
        page.tsx             # Guest page entry — passes hardcoded props to WeddingPage
  components/
    guest/
      WeddingPage.tsx        # Main orchestrator — envelope reveal + all sections
      SealEntry.tsx          # Envelope top flap, wax seal, entry text animations
      HeroSection.tsx        # Couple names, date, butterflies, floral corners
      ScheduleSection.tsx    # Event timeline with animated line + pulsing dots
      LocationSection.tsx    # Venue info + photo
      DressCodeSection.tsx   # Dress code with decorative flourishes
      DetailsSection.tsx     # Contact info, gift note, floral accents
      CtaSection.tsx         # RSVP CTA with glowing button + couple photo placeholder
      RsvpModal.tsx          # RSVP form + confirmation view (static, no API)
      Butterfly.tsx          # Animated floating butterfly SVG (memoized)
      FloralElements.tsx     # SVG decorations: FloralCorner, FloralDivider, PetalCluster, InvitationFrame
      SectionReveal.tsx      # Scroll-triggered fade-in wrapper (Framer Motion)
      TornEdge.tsx           # Wavy SVG paper transition between sections
context/
  ref-image/
    0.PNG - 6.PNG            # Design reference screenshots
    venue_image.png          # Source venue image
public/
  venue.png                  # Venue photo used in LocationSection
```

---

## Design System

### Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| Cream | `#FFF8F3` | Page background, text on dark sections |
| Cream Dark | `#F0E6DB` | Subtle contrast |
| Blush | `#FBE8E0` | Accent |
| Burgundy | `#862042` | Primary dark sections, buttons, accents |
| Burgundy Dark | `#601530` | CTA section background, button hover |
| Burgundy Light | `#A83858` | Accent |
| Gold | `#C49A6C` | Accents, seal, highlights |
| Gold Dark | `#A67B4E` | Seal gradient |
| Gold Light | `#D4AD82` | Seal gradient, accents |
| Rose | `#C85A7C` | Accent |
| Charcoal | `#2C1018` | Body text, modal text |

### Envelope-Specific Colors (Not in Tailwind Theme)

| Color | Hex | Usage |
|-------|-----|-------|
| Envelope outer | `#F5DDE0` | Top flap front face |
| Envelope inner | `#E8C5C9` | Top flap back face, envelope body, inner backdrop |
| Hero gradient | `#4A1528` | Deep burgundy in hero bg gradient |

### Typography

- **Script headings**: `font-script` (Great Vibes) — section titles, couple names
- **Body text**: `font-sans` (Geist) — all other text
- Tracking: `tracking-[0.2em]` to `tracking-[0.3em]` on uppercase labels

### Spacing Convention

- All scroll sections use `min-h-[100dvh]` (not `h-screen`)
- Section padding: `py-20 md:py-28` or `py-24 md:py-36`
- Content max-widths: `max-w-md` to `max-w-lg`

---

## Animation Architecture

### Entry Sequence (Envelope Opening)

The app opens with an envelope metaphor. The sequence is:

1. **Idle state**: Full-screen envelope with top flap, fold lines, wax seal at center, and three text elements that animate in sequentially
2. **Text entry timing**:
   - "Hi {guestName}," — opacity fade in, delay 0.6s, duration 0.8s (later changed to delay 0.4s)
   - "You are cordially invited" — handwriting reveal via `clipPath: inset(0 100% 0 0)` to `inset(0 0% 0 0)`, delay 1.0s, duration 1.3s (later changed)
   - "Tap to open" — opacity fade in, delay 3.0s, duration 0.8s
3. **Seal shimmer**: Starts at delay 3.8s (right after "Tap to open" finishes)
4. **On tap**: Seal animates out (scale + opacity, 0.4s), then top flap rotates open (1.0s with 0.2s delay after seal)
5. **Content reveal**: Hero slides up from `y: 30%` to `y: 0`, envelope body slides down off-screen
6. **Cleanup**: `isRevealed` set to true, envelope layers unmount, content switches from `position: fixed` to `position: relative` for normal scrolling

### Z-Index Layering (During Envelope Phase)

```
z-[58]  SealEntry — top flap + seal + text (topmost, receives taps)
z-[55]  Envelope body/pocket — masks content below the V-fold
z-[52]  Content/hero — slides up from behind the envelope
z-[51]  Inner envelope backdrop — solid #E8C5C9, prevents cream bleed-through
z-[50]  RSVP modal (when open, after reveal)
```

### Double-Sided Flap Implementation

The top flap has two faces using CSS 3D:
- **Parent**: `transformStyle: 'preserve-3d'`, rotates from 0 to 180 degrees
- **Front face** (visible initially): `bg-[#F5DDE0]` + paper grain SVG filter at 5% opacity, `backfaceVisibility: 'hidden'`
- **Back face** (visible after 90deg): `bg-[#E8C5C9]` + radial gradient shadow + paper grain at 4%, `backfaceVisibility: 'hidden'`, `transform: rotateX(180deg)`

**Key CSS gotcha**: `clipPath` is applied to each face child (not the parent) because `clip-path` on a parent creates a flattening context that breaks `preserve-3d`.

### Scroll Animations

- `SectionReveal` wraps content blocks — fades in + slides up 40px on scroll, using `whileInView` with `viewport: { once: true, margin: '-80px' }`
- Schedule timeline: vertical line draws itself via `scaleY: 0 -> 1`
- Dress code: horizontal flourish lines animate via `scaleX`
- Details: divider line animates via `scaleX`
- Venue image: zoom reveal `scale: 0.92 -> 1`

### Butterflies

- SVG butterfly with flapping wings (`scaleX: [1, 0.5, 1]` animation)
- Float along configurable paths (x/y keyframe arrays)
- Duration 16-25s, repeat infinitely, mirror on repeat
- Present in every section (bride's preference)
- Component is `memo`ized to avoid unnecessary re-renders

### CTA Button

- `btn-glow` keyframe animation: breathing box-shadow glow effect (defined in `globals.css`)

### RSVP Modal

- `AnimatePresence mode="wait"` toggles between form and confirmation views
- Form slides out left, confirmation slides in from right
- Confirmation shows a spring-animated checkmark icon

---

## Component Details

### WeddingPage.tsx (Orchestrator)

- Client component (`'use client'`)
- State: `isOpen` (seal tapped), `isRevealed` (animation done), `showRsvp` (modal)
- Locks body scroll during envelope phase (`document.body.style.overflow = 'hidden'`)
- Hero initial Y position: `30%` (offset upward so more is visible when flap opens)
- Inner envelope backdrop: fixed `bg-[#E8C5C9]` div at z-[51], removed when `isRevealed`

### SealEntry.tsx

- Exports `ENVELOPE_SY = 42` (the V-fold percentage from top) and `REVEAL_DELAY`
- Animation constants: `SEAL_DUR = 0.4`, `FLAP_DELAY = 0.2`, `FLAP_DUR = 1.0`
- `REVEAL_DELAY` fires `onOpen` when flap is ~50% open
- Fold lines (subtle V-shape guides) fade out when opening starts
- SVG filter `#paper-grain` using `feTurbulence` (fractalNoise) for paper texture

### HeroSection.tsx

- All text is static (no animation) — couple names, date, "Wedding Day" label
- Butterflies and FloralCorners are animated
- Deep burgundy gradient background: `from-[#4A1528] via-burgundy-dark to-[#4A1528]`

### RsvpModal.tsx

- Two sub-components: `RsvpForm` and `RsvpConfirmation`
- Form fields currently: attending (radio), dietary requirements (textarea)
- **Submission is fake** — `onSubmit` just toggles to confirmation view
- Confirmation shows hardcoded "Yes" attending and "None" dietary
- Has "Add to Calendar" and "View Venue Location" buttons (non-functional placeholders)
- RSVP deadline text: "March 15, 2026"

### FloralElements.tsx

Contains four SVG decoration components:
- `InvitationFrame` — double border with corner scrollwork (used on seal entry in reference design, currently not rendered in code)
- `FloralCorner` — vine pattern with leaves and small flower (used in HeroSection)
- `FloralDivider` — horizontal flourish with center flower (used between burgundy sections)
- `PetalCluster` — multi-flower cluster with buds and leaves (used in DetailsSection)

---

## What's NOT Built Yet (Gaps)

### Phase 3: Database + API

- [ ] Prisma schema for guests/households/RSVPs
- [ ] Neon PostgreSQL database provisioning
- [ ] Database fields decided: guest name, token, max_guests, status (`not_sent`/`sent`/`responded`), dietary, attending
- [ ] Dropped fields: `plus_one_allowed` (use `max_guests` instead), "viewed" status
- [ ] API route: `POST /api/rsvp` — submit RSVP
- [ ] API route: `GET/PUT /api/guests` — admin CRUD
- [ ] API route: `POST /api/auth` — admin login
- [ ] Environment variables setup (database URL, admin password)

### Phase 4: Wire Up Guest Side

- [ ] `/rsvp/[token]/page.tsx` needs SSR — look up guest by token, pass real data
- [ ] RSVP form needs real state management and API calls
- [ ] Handle "not found" tokens (404 or error page)
- [ ] Handle already-responded state (show confirmation or allow edit)
- [ ] Guest name field removed from RSVP — guest identified by token
- [ ] If `max_guests > 1`: show number of guests + name fields (not built yet)
- [ ] Meal choice per guest (options TBD — awaiting friend confirmation)
- [ ] Song request field (maybe — awaiting confirmation)
- [ ] Message to couple field (maybe — awaiting confirmation)
- [ ] "Add to Calendar" button needs to generate .ics file or Google Calendar link
- [ ] "View Venue Location" button needs to open Google Maps

### Phase 5: Admin Dashboard

- [ ] Password-protected admin area at `/admin/*`
- [ ] Guest list view (table with status, RSVP details)
- [ ] Invite kit (generate guest URLs)
- [ ] QR code generation for invitations
- [ ] CSV export of guest data
- [ ] Clean/functional UI (not themed like guest side)
- [ ] Reports: CSV only (no PDF)

### Phase 6: Polish + Deploy

- [ ] Vercel deployment configuration
- [ ] Custom domain (TBD)
- [ ] Couple photo needed for CtaSection (currently placeholder circle)
- [ ] Mobile testing and optimization
- [ ] Performance audit (many Framer Motion animations)
- [ ] Accessibility review
- [ ] SEO meta tags / Open Graph
- [ ] Error boundaries

### Content Gaps

- [ ] RSVP deadline date mismatch: modal says "March 15, 2026" but wedding is Dec 2026 — verify correct deadline
- [ ] Couple photo missing — CtaSection has a placeholder
- [ ] Event times in ScheduleSection may be placeholder (16:00, 17:00, 19:00, 20:00) — confirm with couple
- [ ] InvitationFrame component exists in FloralElements.tsx but is not used anywhere
- [ ] `householdName` prop is passed to WeddingPage but never used

---

## Design Decisions Made

1. **No separate backend** — Next.js API routes handle everything
2. **No CMS** — all content is hardcoded; text changes go through code
3. **No guest login** — tokenized URL access only
4. **Single admin password** — no user accounts
5. **Envelope metaphor** — the entry is a physical envelope opening, not a page load
6. **Butterflies everywhere** — bride's preference, non-negotiable
7. **Torn paper edge** — only between hero (cream) and first burgundy section
8. **Floral dividers** — between consecutive burgundy sections (schedule -> location -> dress code -> details)
9. **Static hero text** — "Harry & Susan" does not animate (deliberate choice after initially having animation)
10. **Handwriting animation** — "You are cordially invited" uses a left-to-right clip reveal
11. **Envelope texture** — radial gradient (not crosshatch pattern — explicitly rejected)
12. **Inner envelope color** — `#E8C5C9` (darker than outer `#F5DDE0`)
13. **RSVP confirmation inline** — stays in modal (form -> confirmation view), does not navigate away
14. **CSV export only** — no PDF reports for admin

---

## Design Reference

Reference screenshots are in `context/ref-image/0.PNG` through `6.PNG`. These show the intended visual direction for the guest-facing page. The current implementation closely follows these references.

---

## Known Considerations

### Performance

- Every section has 2+ Butterfly components running infinite Framer Motion animations
- Paper grain uses SVG `feTurbulence` filter (can be GPU-intensive)
- The envelope phase renders 4+ fixed-position layers simultaneously
- Consider `will-change` or `transform: translateZ(0)` if janky on mobile

### CSS

- Tailwind v4 uses `@theme inline` syntax (not `tailwind.config.js`)
- Custom colors and fonts are defined in `globals.css`, not a config file
- Custom keyframes (`dot-pulse`, `btn-glow`) are in `globals.css`

### Browser Support

- Uses `100dvh` (dynamic viewport height) — supported in modern browsers
- Uses CSS `preserve-3d` + `backfaceVisibility` — well-supported but can be quirky
- Uses `clipPath` with `polygon()` — good modern support
- Framer Motion requires React 18+

### Git

- Only one commit exists (`Initial commit from Create Next App`)
- All current work is uncommitted
- `CLAUDE.md` is in `.gitignore` (intentional — project-specific AI instructions)
- `main` is the main branch, current work is on `master`

---

## Environment Setup

```bash
# Clone the repo
git clone <repo-url>
cd rsvp

# Install dependencies
npm install

# Run dev server
npm run dev

# Visit http://localhost:3000 (redirects to /rsvp/test-token)
```

### Dependencies (from package.json)

- `next` (v16)
- `react`, `react-dom`
- `framer-motion`
- `@phosphor-icons/react`
- `tailwindcss` (v4)

### Future Dependencies (Phase 3+)

- `prisma` + `@prisma/client`
- Possibly `bcrypt` or similar for admin password hashing
- Possibly `uuid` for token generation
