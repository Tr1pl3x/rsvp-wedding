"use client";

import { motion } from "framer-motion";
import Butterfly from "./Butterfly";
import { FloralDivider } from "./FloralElements";
import SectionReveal from "./SectionReveal";

function Flourish({ flip = false }: { flip?: boolean }) {
  return (
    <motion.span
      aria-hidden
      className={`h-px w-16 bg-gold-light/60 md:w-24 ${flip ? "origin-left" : "origin-right"}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
    />
  );
}

export default function DressCodeSection() {
  return (
    <section className="relative overflow-hidden bg-burgundy px-4 py-20 text-cream md:py-28">
      <Butterfly
        className="right-[12%] top-[18%] text-gold-light/40"
        size={20}
        duration={23}
        delay={2}
        xPath={[0, -25, 20, -35, 0]}
        yPath={[0, 30, -15, 20, 0]}
      />
      <Butterfly
        className="bottom-[18%] left-[10%] text-blush/30"
        size={24}
        duration={20}
      />

      <SectionReveal className="mx-auto flex max-w-md flex-col items-center text-center">
        {/* Separates this from the equally-burgundy Schedule section above */}
        <FloralDivider className="h-10 w-56 text-gold-light/70" />
        <h2 className="font-script mt-6 text-5xl text-gold-light md:text-6xl">
          Dress Code
        </h2>

        <div className="mt-10 flex items-center gap-4">
          <Flourish />
          <p className="text-base uppercase tracking-[0.25em]">Formal Attire</p>
          <Flourish flip />
        </div>

        <p className="mt-8 max-w-sm text-sm leading-relaxed text-cream/75">
          Suits and evening gowns under the Hua Hin sky. We kindly ask that
          white be reserved for the bride.
        </p>
      </SectionReveal>
    </section>
  );
}
