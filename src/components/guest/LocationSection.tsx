"use client";

import { motion } from "framer-motion";
import Butterfly from "./Butterfly";
import SectionReveal from "./SectionReveal";
import VenueCarousel from "./VenueCarousel";

export default function LocationSection() {
  return (
    <section className="relative overflow-hidden bg-cream px-4 py-20 text-charcoal md:py-28">
      <Butterfly
        className="left-[8%] top-[10%] text-burgundy/30"
        size={22}
        duration={21}
        delay={1}
      />
      <Butterfly
        className="bottom-[12%] right-[10%] text-gold-dark/40"
        size={26}
        duration={19}
        delay={4}
        xPath={[0, -30, 15, -20, 0]}
        yPath={[0, -25, 10, -40, 0]}
      />

      <SectionReveal className="mx-auto flex max-w-lg flex-col items-center text-center">
        <h2 className="font-script text-5xl text-burgundy md:text-6xl">
          Location
        </h2>
        <p className="mt-8 text-sm font-medium uppercase tracking-[0.2em]">
          InterContinental Hua Hin Resort
        </p>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-charcoal/65">
          33/33 Petchkasem Road, Hua Hin,
          <br />
          Prachuap Khiri Khan 77110, Thailand
        </p>
      </SectionReveal>

      <motion.div
        className="mx-auto mt-12 max-w-lg"
        initial={{ scale: 0.92, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <VenueCarousel />
      </motion.div>
    </section>
  );
}
