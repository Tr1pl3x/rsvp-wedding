"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import TornEdge from "./TornEdge";

// Ivory text crosses pale sky at the top of the photo, so it rides on an
// espresso veil that fades out by mid-page — below that the photo is
// untouched and the couple walks clear.
const VEIL =
  "linear-gradient(to bottom, rgba(35,26,18,0.72), rgba(35,26,18,0.52) 26%, rgba(35,26,18,0.26) 42%, rgba(35,26,18,0) 58%)";
const INK_SHADOW =
  "0 1px 3px rgba(35,26,18,0.55), 0 2px 14px rgba(35,26,18,0.5)";

export default function HeroSection() {
  // svh, not dvh: the photo must never re-cover a growing container — dvh
  // grows when the mobile URL bar collapses, which reads as the image
  // zooming while you scroll.
  return (
    <section className="relative flex min-h-[100svh] flex-col items-center overflow-hidden bg-latte px-4 pt-[9svh] text-center text-cream">
      <Image
        src="/rsvp-photos/front-page-web.jpg"
        alt="Harry and Susan walking hand in hand by Sydney Harbour beneath the Harbour Bridge"
        fill
        preload
        sizes="100vw"
        className="object-cover object-[45%_32%]"
      />
      <div aria-hidden className="absolute inset-0" style={{ background: VEIL }} />

      <div className="relative">
        <p
          className="text-xs uppercase tracking-[0.3em] text-blush"
          style={{ textShadow: INK_SHADOW }}
        >
          Wedding Day
        </p>
        <p
          className="mt-3 text-sm tracking-[0.25em] text-cream/95"
          style={{ textShadow: INK_SHADOW }}
        >
          21 . 12 . 2026
        </p>

        <h1
          className="font-script mt-8 leading-tight"
          style={{ textShadow: INK_SHADOW }}
        >
          <span className="block text-6xl md:text-8xl">Harry</span>
          <span className="block text-4xl text-gold-light md:text-5xl">
            &amp;
          </span>
          <span className="block text-6xl md:text-8xl">Susan</span>
        </h1>

      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-cream/80"
        style={{ filter: "drop-shadow(0 1px 3px rgba(35,26,18,0.6))" }}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
          <path
            d="M2 2 L10 10 L18 2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>

      {/* The ivory of the next section tears up over the photo's base, so the
          hero owns its own torn edge (a solid-colour tear can't match a photo) */}
      <div className="absolute inset-x-0 bottom-0" style={{ transform: "scaleY(-1)" }}>
        <TornEdge topColor="#fbf3e7" bottomColor="transparent" />
      </div>
    </section>
  );
}
