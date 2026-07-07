"use client";

import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react";
import { FloralDivider } from "../FloralElements";

type RsvpClosedProps = {
  token: string;
  /** Prose deadline, e.g. "30 August 2026". */
  deadline: string;
};

/**
 * Shown on the respond page once the RSVP window has ended for guests who
 * never answered. Guests who did answer keep seeing their confirmation, and
 * the invitation itself stays viewable — only the blank form is closed off.
 */
export default function RsvpClosed({ token, deadline }: RsvpClosedProps) {
  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-cream">
      <div className="mx-auto w-full max-w-lg px-5 pb-24 pt-8">
        <Link
          href={`/rsvp/${token}`}
          className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-burgundy/60 transition-colors hover:text-burgundy"
        >
          <ArrowLeft size={13} weight="bold" />
          Back to invitation
        </Link>

        <div className="mt-14 flex flex-col items-center text-center">
          <FloralDivider className="h-9 w-48 text-gold/60" />
          <h1 className="font-script mt-6 text-5xl text-burgundy">
            RSVPs Have Closed
          </h1>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-charcoal/70">
            Our RSVP window closed on {deadline}. If you&apos;d still love to
            join us or your plans have changed, please reach out to Harry
            &amp; Susan directly.
          </p>
          <FloralDivider className="mt-10 h-8 w-44 rotate-180 text-gold/40" />
        </div>
      </div>
    </main>
  );
}
