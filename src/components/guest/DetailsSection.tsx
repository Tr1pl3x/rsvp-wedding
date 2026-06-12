"use client";

import { motion } from "framer-motion";
import Butterfly from "./Butterfly";
import { PetalCluster } from "./FloralElements";
import SectionReveal from "./SectionReveal";

export default function DetailsSection() {
  return (
    <section className="relative overflow-hidden bg-cream px-4 py-20 text-charcoal md:py-28">
      <PetalCluster className="absolute -left-8 top-6 h-28 w-44 text-burgundy/20 md:h-36 md:w-56" />
      <PetalCluster className="absolute -right-8 bottom-6 h-28 w-44 -scale-x-100 text-gold-dark/25 md:h-36 md:w-56" />

      <Butterfly
        className="right-[10%] top-[14%] text-burgundy/25"
        size={20}
        duration={22}
        delay={2}
        xPath={[0, 30, -20, 10, 0]}
        yPath={[0, -20, 15, -35, 0]}
      />
      <Butterfly
        className="bottom-[16%] left-[12%] text-gold-dark/35"
        size={24}
        duration={19}
      />

      <SectionReveal className="mx-auto flex max-w-md flex-col items-center text-center">
        <h2 className="font-script text-5xl text-burgundy md:text-6xl">
          Details
        </h2>

        <p className="mt-10 text-sm leading-relaxed text-charcoal/70">
          For additional information or questions,
          <br />
          please contact our wedding organizer
        </p>
        <p className="mt-4 text-sm font-medium uppercase tracking-[0.2em]">
          Amelia
        </p>
        <a
          href="tel:+31684396988"
          className="mt-1 text-sm text-burgundy underline-offset-4 transition-colors hover:text-burgundy-light hover:underline"
        >
          +31 684 396 988
        </a>

        <motion.span
          aria-hidden
          className="mt-10 h-px w-24 origin-center bg-gold"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: "easeOut" }}
        />

        <p className="mt-10 max-w-sm text-sm leading-relaxed text-charcoal/70">
          Your presence is the greatest gift to us. However, if you wish to
          honor us with a present, a contribution toward our future would be
          sincerely appreciated.
        </p>
      </SectionReveal>
    </section>
  );
}
