"use client";

import { motion } from "framer-motion";
import Butterfly from "./Butterfly";
import { FloralDivider } from "./FloralElements";
import SectionReveal from "./SectionReveal";

// The bride's ideal attire tones, light to deep — rendered as wax droplets
// (lit, not outlined) so they read as part of the stationery, not a chart.
const TONES = [
  { hex: "#FFF2BF", name: "cream" },
  { hex: "#F7E1A6", name: "butter" },
  { hex: "#E9C8B1", name: "champagne nude" },
  { hex: "#E0B6AA", name: "dusty blush" },
  { hex: "#F6C9C2", name: "soft pink" },
  { hex: "#BC8183", name: "rose" },
  { hex: "#7D5A44", name: "warm brown" },
  { hex: "#4A342A", name: "espresso" },
  { hex: "#141110", name: "black" },
];

function Flourish({ flip = false }: { flip?: boolean }) {
  return (
    <motion.span
      aria-hidden
      className={`h-px w-16 bg-gold-dark/60 md:w-24 ${flip ? "origin-left" : "origin-right"}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
    />
  );
}

export default function DressCodeSection() {
  return (
    <section className="relative overflow-hidden bg-tan px-4 py-20 text-burgundy-dark md:py-28">
      <Butterfly
        className="right-[12%] top-[18%] text-gold-dark/50"
        size={20}
        duration={23}
        delay={2}
        xPath={[0, -25, 20, -35, 0]}
        yPath={[0, 30, -15, 20, 0]}
      />
      <Butterfly
        className="bottom-[18%] left-[10%] text-burgundy/25"
        size={24}
        duration={20}
      />

      <SectionReveal className="mx-auto flex max-w-md flex-col items-center text-center">
        <FloralDivider className="h-10 w-56 text-gold-dark/70" />
        <h2 className="font-script mt-6 text-5xl text-burgundy md:text-6xl">
          Dress Code
        </h2>

        <div className="mt-10 flex items-center gap-4">
          <Flourish />
          <p className="text-base uppercase tracking-[0.25em]">Formal Attire</p>
          <Flourish flip />
        </div>

        {/* One in-view trigger on the strip, stagger via variants — per-dot
            observers with a four-sided margin never fire for the dots that
            sit within the margin of the screen's left/right edges */}
        <motion.div
          role="img"
          aria-label={`Ideal colour tones: ${TONES.map((tone) => tone.name).join(", ")}`}
          className="mt-7 flex items-center justify-center gap-2"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px 0px" }}
          variants={{
            hidden: {},
            show: {
              transition: { delayChildren: 0.25, staggerChildren: 0.06 },
            },
          }}
        >
          {TONES.map((tone) => (
            <motion.span
              key={tone.hex}
              className="h-7 w-7 rounded-full"
              style={{
                backgroundColor: tone.hex,
                boxShadow:
                  "inset 0 2px 4px rgba(255,255,255,0.45), inset 0 -2px 4px rgba(75,56,42,0.3), 0 2px 5px rgba(75,56,42,0.35)",
              }}
              variants={{
                hidden: { opacity: 0, scale: 0.4 },
                show: {
                  opacity: 1,
                  scale: 1,
                  transition: { type: "spring", stiffness: 260, damping: 18 },
                },
              }}
            />
          ))}
        </motion.div>

        <p className="mt-8 max-w-sm text-sm leading-relaxed text-burgundy-dark/90">
          Suits and evening gowns under the Hua Hin sky. We kindly ask that
          white be reserved for the bride.
        </p>
      </SectionReveal>
    </section>
  );
}
