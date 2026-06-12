"use client";

import { motion } from "framer-motion";
import Butterfly from "./Butterfly";
import { FloralCorner } from "./FloralElements";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#4a1528] via-burgundy-dark to-[#4a1528] px-4 text-center text-cream">
      <FloralCorner className="absolute left-3 top-3 h-28 w-28 text-gold/35 md:h-40 md:w-40" />
      <FloralCorner className="absolute right-3 top-3 h-28 w-28 -scale-x-100 text-gold/35 md:h-40 md:w-40" />
      <FloralCorner className="absolute bottom-3 left-3 h-28 w-28 -scale-y-100 text-gold/35 md:h-40 md:w-40" />
      <FloralCorner className="absolute bottom-3 right-3 h-28 w-28 -scale-100 text-gold/35 md:h-40 md:w-40" />

      <Butterfly
        className="left-[12%] top-[18%] text-gold-light/50"
        size={30}
        duration={22}
      />
      <Butterfly
        className="right-[14%] top-[30%] text-blush/40"
        size={22}
        duration={18}
        delay={2}
        xPath={[0, -35, 20, -10, 0]}
        yPath={[0, 25, -20, 40, 0]}
      />
      <Butterfly
        className="bottom-[20%] left-[22%] text-gold/40"
        size={18}
        duration={25}
        delay={5}
        xPath={[0, 30, 60, 25, 0]}
        yPath={[0, -40, -15, -50, 0]}
      />

      {/* Static by design — the envelope opening is the only entrance the
          hero text gets */}
      <p className="text-xs uppercase tracking-[0.3em] text-gold-light">
        Wedding Day
      </p>
      <p className="mt-3 text-sm tracking-[0.25em] text-cream/80">
        21 . 12 . 2026
      </p>

      <h1 className="font-script mt-8 leading-tight">
        <span className="block text-6xl md:text-8xl">Harry</span>
        <span className="block text-4xl text-gold-light md:text-5xl">&amp;</span>
        <span className="block text-6xl md:text-8xl">Susan</span>
      </h1>

      <p className="mt-8 max-w-xs text-sm leading-relaxed text-cream/70">
        InterContinental Hua Hin Resort
        <br />
        Hua Hin, Thailand
      </p>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-cream/50"
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
    </section>
  );
}
