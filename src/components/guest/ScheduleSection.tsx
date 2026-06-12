"use client";

import { motion } from "framer-motion";
import Butterfly from "./Butterfly";
import { FloralDivider } from "./FloralElements";
import SectionReveal from "./SectionReveal";

// Placeholder times — confirm the real run sheet with the couple
const EVENTS = [
  { time: "16:00", label: "Wedding Ceremony" },
  { time: "17:00", label: "Cocktail Hour" },
  { time: "19:00", label: "Dinner" },
  { time: "20:00", label: "Party" },
];

function TimelineBloom() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 40 40"
      className="h-8 w-8 text-gold-light/80"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    >
      <g transform="translate(20 20)">
        <circle r="3" fill="currentColor" stroke="none" />
        <ellipse rx="4" ry="9" transform="rotate(0) translate(0 -10)" />
        <ellipse rx="4" ry="9" transform="rotate(72) translate(0 -10)" />
        <ellipse rx="4" ry="9" transform="rotate(144) translate(0 -10)" />
        <ellipse rx="4" ry="9" transform="rotate(216) translate(0 -10)" />
        <ellipse rx="4" ry="9" transform="rotate(288) translate(0 -10)" />
      </g>
    </svg>
  );
}

export default function ScheduleSection() {
  return (
    <section className="relative overflow-hidden bg-burgundy px-4 py-20 text-cream md:py-28">
      <Butterfly
        className="right-[8%] top-[12%] text-gold-light/40"
        size={24}
        duration={20}
      />
      <Butterfly
        className="bottom-[14%] left-[6%] text-blush/30"
        size={18}
        duration={24}
        delay={3}
        xPath={[0, 25, -15, 35, 0]}
        yPath={[0, -35, -10, -45, 0]}
      />

      <SectionReveal className="mx-auto flex max-w-lg flex-col items-center">
        <FloralDivider className="h-10 w-56 text-gold-light/70" />
        <h2 className="font-script mt-6 text-5xl text-gold-light md:text-6xl">
          Schedule of Events
        </h2>
      </SectionReveal>

      <div className="relative mx-auto mt-14 max-w-md">
        {/* The timeline draws itself on scroll */}
        <motion.div
          aria-hidden
          className="absolute bottom-10 left-1/2 top-2 w-px -translate-x-1/2 bg-gold-light/50"
          style={{ transformOrigin: "top" }}
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.6, ease: "easeOut" }}
        />

        <div className="flex flex-col gap-12">
          {EVENTS.map((event, i) => (
            <SectionReveal key={event.time} delay={0.15 * i}>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-5">
                <p className="text-right text-2xl font-light tracking-wide">
                  {event.time}
                </p>
                <span className="animate-dot-pulse h-2.5 w-2.5 rounded-full bg-gold-light" />
                <p className="text-sm uppercase tracking-[0.2em] text-cream/85">
                  {event.label}
                </p>
              </div>
            </SectionReveal>
          ))}
        </div>

        <SectionReveal delay={0.7} className="mt-10 flex justify-center">
          <TimelineBloom />
        </SectionReveal>
      </div>
    </section>
  );
}
