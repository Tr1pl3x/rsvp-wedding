"use client";

import Link from "next/link";
import Butterfly from "./Butterfly";
import { FloralDivider } from "./FloralElements";
import SectionReveal from "./SectionReveal";

type CtaSectionProps = {
  token: string;
};

export default function CtaSection({ token }: CtaSectionProps) {
  return (
    <section className="relative overflow-hidden bg-burgundy-dark px-4 py-20 text-cream md:py-28">
      <Butterfly
        className="left-[10%] top-[12%] text-gold-light/40"
        size={26}
        duration={21}
        delay={1}
      />
      <Butterfly
        className="right-[8%] top-[40%] text-blush/30"
        size={18}
        duration={24}
        delay={4}
        xPath={[0, -30, 15, -45, 0]}
        yPath={[0, 25, -20, 35, 0]}
      />

      <SectionReveal className="mx-auto flex max-w-md flex-col items-center text-center">
        <h2 className="font-script text-4xl text-gold-light md:text-5xl">
          Confirm Your Attendance
        </h2>
        <p className="mt-6 max-w-sm text-sm leading-relaxed text-cream/75">
          To help us prepare for a joyful celebration, kindly confirm your
          attendance by 15 September 2026.
        </p>

        <Link
          href={`/rsvp/${token}/respond`}
          className="animate-btn-glow mt-10 rounded-full bg-cream px-12 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-burgundy-dark transition-all hover:bg-blush active:scale-[0.98]"
        >
          RSVP
        </Link>
      </SectionReveal>

      <SectionReveal delay={0.2} className="mt-16 flex flex-col items-center">
        {/* Couple photo placeholder — swap for the real photo before launch */}
        <div className="flex h-40 w-40 items-center justify-center rounded-full bg-burgundy ring-2 ring-gold/50 ring-offset-4 ring-offset-burgundy-dark md:h-48 md:w-48">
          <span className="font-script text-5xl text-gold-light/80">H&S</span>
        </div>

        <p className="font-script mt-10 text-3xl text-gold-light md:text-4xl">
          Hope to see you there!
        </p>
        <p className="mt-3 text-sm uppercase tracking-[0.25em] text-cream/80">
          Harry &amp; Susan
        </p>

        <FloralDivider className="mt-10 h-10 w-56 text-gold/50" />
      </SectionReveal>
    </section>
  );
}
