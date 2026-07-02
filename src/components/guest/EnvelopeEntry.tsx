"use client";

import { motion } from "framer-motion";

/**
 * The envelope opens the way a real one does:
 *   1. the wax seal melts away
 *   2. the top flap peels open toward the viewer with a paper overshoot
 *   3. the invitation page itself rises full-size out of the pocket
 *   4. the envelope body slides down off the card and away — the opened
 *      flap stays where it is (off-screen above) so it never drags back
 *      into view during the drop
 */

// Choreography (seconds from tap)
export const SEAL_DUR = 0.45;
export const FLAP_DELAY = 0.4;
export const FLAP_DUR = 1.1;
export const RISE_DELAY = 1.3;
export const RISE_DUR = 1.2;
// The envelope starts falling while the card is still finishing its rise —
// the two opposing motions make the ending feel brisk instead of sequential
export const DROP_DELAY = 2.1;
export const DROP_DUR = 0.8;
export const OPEN_TOTAL = DROP_DELAY + DROP_DUR;

const OUTER_PAPER = "#f5dde0";
const INNER_PAPER = "#e8c5c9";

// Paper-coloured glow behind the entry text so it stays legible where it
// crosses the flap's fold edges and their drop shadows.
const HALO =
  "0 1px 2px rgba(255,248,243,0.9), 0 0 8px rgba(245,221,224,0.95), 0 0 18px rgba(245,221,224,0.9)";

// Top flap silhouette and the pocket (everything except the top triangle)
const FLAP_CLIP = "polygon(0% 0%, 100% 0%, 50% 50%)";
const POCKET_CLIP = "polygon(0% 0%, 50% 50%, 100% 0%, 100% 100%, 0% 100%)";

function PaperGrain({ opacity }: { opacity: number }) {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ opacity }}
    >
      <rect width="100%" height="100%" filter="url(#paper-grain)" />
    </svg>
  );
}

function WaxSeal({ isOpen }: { isOpen: boolean }) {
  return (
    <div className="absolute left-1/2 top-1/2 z-[4] -translate-x-1/2 -translate-y-1/2">
      <motion.div
        initial={false}
        animate={isOpen ? { scale: 1.2, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{ duration: SEAL_DUR, ease: "easeIn" }}
        whileHover={isOpen ? undefined : { scale: 1.04 }}
        whileTap={isOpen ? undefined : { scale: 0.96 }}
        className="relative h-32 w-32 md:h-36 md:w-36"
        style={{
          borderRadius: "48% 52% 50% 50% / 52% 48% 53% 47%",
          background:
            "radial-gradient(circle at 35% 30%, #d4ad82, #c49a6c 55%, #a67b4e 100%)",
          boxShadow:
            "inset 0 2px 6px rgba(255,255,255,0.35), inset 0 -4px 10px rgba(96,21,48,0.28), 0 6px 18px rgba(96,21,48,0.22)",
        }}
      >
        {/* Embossed inner ring */}
        <div
          className="absolute inset-[14%] rounded-full"
          style={{
            boxShadow:
              "inset 0 1px 2px rgba(96,21,48,0.25), 0 1px 1px rgba(255,255,255,0.3)",
          }}
        />
        <span
          className="font-script absolute inset-0 flex items-center justify-center pt-1 text-4xl text-burgundy-dark/70 md:text-5xl"
          style={{
            textShadow:
              "0 1px 0 rgba(255,255,255,0.3), 0 -1px 1px rgba(96,21,48,0.3)",
          }}
        >
          H&S
        </span>

        {/* Shimmer sweep, starts after "Tap to open" has appeared */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ borderRadius: "inherit" }}
        >
          <motion.div
            className="absolute inset-y-[-20%] w-1/3"
            style={{
              background:
                "linear-gradient(105deg, rgba(255,255,255,0) 0%, rgba(255,248,243,0.45) 50%, rgba(255,255,255,0) 100%)",
            }}
            initial={{ x: "-180%" }}
            animate={{ x: "420%" }}
            transition={{
              delay: 3.8,
              duration: 1.2,
              ease: "easeInOut",
              repeat: Infinity,
              repeatDelay: 2.4,
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}

type EnvelopeEntryProps = {
  guestName: string;
  isOpen: boolean;
  onOpen: () => void;
  /** Fires when the body has actually finished sliding off-screen — the
      cue to unmount the envelope. A wall-clock timer races ahead of the
      animation on janky devices and the body pops out mid-slide. */
  onDropComplete: () => void;
};

export default function EnvelopeEntry({
  guestName,
  isOpen,
  onOpen,
  onDropComplete,
}: EnvelopeEntryProps) {
  const greeting = `Hi ${guestName},`;

  return (
    <>
      {/* Envelope interior — sits BEHIND the page (z-51 vs the page's z-52),
          so it's what shows through the open slot above the rising card */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[51]"
        style={{ backgroundColor: INNER_PAPER }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 38%, rgba(96,21,48,0.18), rgba(96,21,48,0) 60%)",
          }}
        />
        <PaperGrain opacity={0.04} />
      </div>

      {/* Envelope body — pocket + vignette. This is the only part that
          slides down once the card is out. */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[55]"
        initial={false}
        // The body fades over the drop's final stretch so it is already
        // transparent before it reaches the bottom edge — guarantees no
        // visible pop at the end regardless of device jank or viewport
        // height quirks
        animate={
          isOpen
            ? { y: "150dvh", opacity: [1, 1, 0] }
            : { y: "0dvh", opacity: 1 }
        }
        transition={{
          y: { delay: isOpen ? DROP_DELAY : 0, duration: DROP_DUR, ease: "easeIn" },
          opacity: {
            delay: isOpen ? DROP_DELAY : 0,
            duration: DROP_DUR,
            times: [0, 0.8, 1],
          },
        }}
        onAnimationComplete={() => {
          if (isOpen) onDropComplete();
        }}
      >
        {/* Pocket — side flaps folded in with the bottom flap over them.
            The drop-shadow follows the V silhouette, giving the slot a real
            paper lip. */}
        <div
          className="absolute inset-0"
          style={{ filter: "drop-shadow(0 -2px 6px rgba(96,21,48,0.22))" }}
        >
          <div
            className="absolute inset-0"
            style={{ clipPath: POCKET_CLIP, backgroundColor: OUTER_PAPER }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(255,255,255,0.3), rgba(255,255,255,0) 40%, rgba(134,32,66,0.05) 75%, rgba(96,21,48,0.10))",
              }}
            />
            {/* Creases where the bottom flap lies over the side flaps */}
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <g stroke="#862042" strokeOpacity="0.10">
                <line
                  x1="0"
                  y1="100"
                  x2="50"
                  y2="50"
                  vectorEffect="non-scaling-stroke"
                />
                <line
                  x1="100"
                  y1="100"
                  x2="50"
                  y2="50"
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            </svg>
            <PaperGrain opacity={0.05} />
          </div>
        </div>

        {/* Soft vignette so the envelope doesn't read as a flat fill; rides
            along with the body when it drops */}
        <div
          className="absolute inset-0"
          style={{ boxShadow: "inset 0 0 140px rgba(134,32,66,0.10)" }}
        />
      </motion.div>

      {/* Static top layer: the flap, the entry text and the seal. None of
          this slides — the opened flap simply stays off-screen above. */}
      <div
        role="button"
        aria-label="Open the invitation"
        onClick={() => {
          if (!isOpen) onOpen();
        }}
        className={`fixed inset-0 z-[56] select-none ${
          isOpen ? "pointer-events-none" : "cursor-pointer"
        }`}
      >
        {/* Shared SVG defs for the paper grain */}
        <svg aria-hidden className="absolute h-0 w-0">
          <defs>
            <filter id="paper-grain">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.8"
                numOctaves="2"
                stitchTiles="stitch"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.33  0 0 0 0 0.13  0 0 0 0 0.19  0 0 0 0.6 0"
              />
            </filter>
          </defs>
        </svg>

        {/* Top flap — the only one that really opens. Peels toward the
            viewer with a slight paper overshoot. Single face by design:
            Chromium culls full-viewport two-face 3D flips. */}
        <motion.div
          className="absolute inset-0 z-[1]"
          style={{ transformPerspective: 1400, transformOrigin: "50% 0%" }}
          initial={false}
          animate={{ rotateX: isOpen ? [0, -188, -180] : 0 }}
          transition={{
            delay: isOpen ? FLAP_DELAY : 0,
            duration: FLAP_DUR,
            times: [0, 0.82, 1],
            ease: ["easeInOut", "easeOut"],
          }}
        >
          <div
            className="absolute inset-0"
            style={{ filter: "drop-shadow(0 4px 8px rgba(96,21,48,0.20))" }}
          >
            <div
              className="absolute inset-0"
              style={{ clipPath: FLAP_CLIP, backgroundColor: OUTER_PAPER }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(255,255,255,0.35), rgba(255,255,255,0) 45%, rgba(134,32,66,0.05) 80%, rgba(96,21,48,0.10))",
                }}
              />
              <PaperGrain opacity={0.05} />
            </div>
          </div>
        </motion.div>

        {/* Paper dimple under the seal — fades as the seal melts */}
        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/2 z-[2] h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(96,21,48,0.10), rgba(96,21,48,0) 70%)",
          }}
          initial={false}
          animate={{ opacity: isOpen ? 0 : 1 }}
          transition={{ duration: 0.4 }}
        />

        {/* Entry text — nestles just above the seal. The lines may cross the
            flap's fold edges by design; a paper-coloured halo keeps the
            script legible where they do. */}
        <div className="pointer-events-none absolute inset-0 z-[3]">
          {/* Long guest names scale down only as far as needed to fit the
              SCREEN (single line, ~0.46em avg glyph width in Great Vibes). */}
          <motion.p
            className="font-script absolute inset-x-0 top-[28.5%] whitespace-nowrap px-4 text-center text-4xl text-burgundy md:text-5xl"
            style={{
              textShadow: HALO,
              ...(greeting.length > 17
                ? { fontSize: `min(2.25rem, ${(190 / greeting.length).toFixed(1)}vw)` }
                : {}),
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isOpen ? 0 : 1 }}
            transition={
              isOpen ? { duration: 0.25 } : { delay: 0.4, duration: 0.8 }
            }
          >
            {greeting}
          </motion.p>

          <motion.p
            className="font-script absolute inset-x-0 top-[34%] px-4 text-center text-[clamp(1rem,4.7vw,1.875rem)] text-burgundy/80"
            style={{ textShadow: HALO }}
            initial={{ clipPath: "inset(0 100% 0 0)", opacity: 1 }}
            animate={
              isOpen
                ? { opacity: 0 }
                : { clipPath: "inset(0 -5% 0 0)", opacity: 1 }
            }
            transition={
              isOpen
                ? { duration: 0.25 }
                : { clipPath: { delay: 1.0, duration: 1.3, ease: "easeOut" } }
            }
          >
            You are cordially invited
          </motion.p>

          <motion.p
            className="absolute inset-x-0 top-[66%] text-center text-[11px] uppercase tracking-[0.35em] text-burgundy/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: isOpen ? 0 : 1 }}
            transition={
              isOpen ? { duration: 0.25 } : { delay: 3.0, duration: 0.8 }
            }
          >
            Tap to open
          </motion.p>
        </div>

        <WaxSeal isOpen={isOpen} />
      </div>
    </>
  );
}
