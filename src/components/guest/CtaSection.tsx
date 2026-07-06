"use client";

import Image from "next/image";
import Link from "next/link";
import Butterfly from "./Butterfly";
import { FloralDivider } from "./FloralElements";
import SectionReveal from "./SectionReveal";
import useImageLoaded from "./useImageLoaded";

type CtaSectionProps = {
  token: string;
  deadline: string;
};

export default function CtaSection({ token, deadline }: CtaSectionProps) {
  const { ref: medallionRef, loaded, onLoad } = useImageLoaded();

  return (
    <section className="relative overflow-hidden bg-latte px-4 py-20 text-burgundy-dark md:py-28">
      <Butterfly
        className="left-[10%] top-[12%] text-burgundy/40"
        size={26}
        duration={21}
        delay={1}
      />
      <Butterfly
        className="right-[8%] top-[40%] text-burgundy/30"
        size={18}
        duration={24}
        delay={4}
        xPath={[0, -30, 15, -45, 0]}
        yPath={[0, 25, -20, 35, 0]}
      />

      <SectionReveal className="mx-auto flex max-w-md flex-col items-center text-center">
        <h2 className="font-script text-4xl text-burgundy-dark md:text-5xl">
          Confirm Your Attendance
        </h2>
        <p className="mt-6 max-w-sm text-sm leading-relaxed text-burgundy-dark">
          To help us prepare for a joyful celebration, kindly confirm your
          attendance by {deadline}.
        </p>

        <Link
          href={`/rsvp/${token}/respond`}
          className="animate-btn-glow mt-10 rounded-full bg-cream px-12 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-burgundy-dark shadow-[0_8px_24px_-8px_rgba(75,56,42,0.45)] transition-all hover:bg-blush active:scale-[0.98]"
        >
          RSVP
        </Link>
      </SectionReveal>

      <SectionReveal delay={0.2} className="mt-16 flex flex-col items-center">
        {/* The engagement ring inside the gold ring */}
        <div className="relative h-52 w-52 overflow-hidden rounded-full ring-2 ring-burgundy/60 ring-offset-4 ring-offset-latte md:h-60 md:w-60">
          <div
            className={`absolute left-1/2 top-1/2 h-[150%] w-[150%] -translate-x-1/2 -translate-y-[46%] transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
          >
            <Image
              ref={medallionRef}
              onLoad={onLoad}
              src="/rsvp-photos/last-page-web.jpg"
              alt="Harry and Susan's hands together over the harbour, her engagement ring catching the light"
              fill
              sizes="360px"
              className="object-cover"
            />
          </div>
        </div>

        <p className="font-script mt-10 text-3xl text-burgundy-dark md:text-4xl">
          Hope to see you there!
        </p>
        <p className="mt-3 text-sm uppercase tracking-[0.25em] text-burgundy-dark">
          Harry &amp; Susan
        </p>

        <FloralDivider className="mt-10 h-10 w-56 text-burgundy/50" />
      </SectionReveal>
    </section>
  );
}
