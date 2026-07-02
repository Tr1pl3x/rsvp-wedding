"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, CalendarPlus, CheckCircle, MapPin } from "@phosphor-icons/react";
import { dishById } from "./menu";
import type { RsvpAnswers } from "./types";
import { FloralDivider } from "../FloralElements";

const VENUE_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=InterContinental+Hua+Hin+Resort";

type RsvpConfirmationProps = {
  answers: RsvpAnswers;
  guestName: string;
  token: string;
};

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-6 py-3">
      <dt className="shrink-0 text-charcoal/60">{label}</dt>
      <dd className="text-right font-medium text-charcoal">{value}</dd>
    </div>
  );
}

export default function RsvpConfirmation({
  answers,
  guestName,
  token,
}: RsvpConfirmationProps) {
  const attending = answers.attending === "yes";
  const dish = dishById(answers.mealId);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Move focus to the success heading so keyboard + screen-reader users are
  // told the submission worked and the view changed (WCAG 2.4.3 / 4.1.3).
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div className="mx-auto w-full max-w-lg px-5 pb-24 pt-16 text-center">
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
        className="inline-flex text-gold-dark"
      >
        <CheckCircle size={72} weight="fill" />
      </motion.span>

      <h1
        ref={headingRef}
        tabIndex={-1}
        className="font-script mt-4 text-5xl text-burgundy outline-none"
        style={{ wordSpacing: "0.35em" }}
      >
        Thank You{guestName ? `, ${guestName}` : ""}!
      </h1>
      <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-charcoal/70">
        {attending
          ? "We can't wait to celebrate with you in Hua Hin."
          : "We're so sorry you can't make it — you'll be dearly missed."}
      </p>

      <dl className="mt-9 divide-y divide-cream-dark border-y border-cream-dark text-left text-sm">
        <SummaryRow label="Attending" value={attending ? "Yes" : "No"} />
        {attending && (
          <SummaryRow label="Your dish" value={dish?.name ?? "—"} />
        )}
        {attending && (
          <SummaryRow label="Dietary" value={answers.dietary || "None"} />
        )}
        {!attending && answers.note && (
          <SummaryRow label="Your note" value={answers.note} />
        )}
      </dl>

      {attending && (
        <div className="mt-8 flex flex-col gap-2.5">
          <a
            href={VENUE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-full border border-burgundy/30 py-3 text-xs font-medium uppercase tracking-[0.2em] text-burgundy transition-colors hover:bg-blush/50 active:scale-[0.98]"
          >
            <MapPin size={16} />
            View Venue Location
          </a>
          {/* Phase 4: generate a real .ics / Google Calendar link */}
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-full border border-burgundy/30 py-3 text-xs font-medium uppercase tracking-[0.2em] text-burgundy transition-colors hover:bg-blush/50 active:scale-[0.98]"
          >
            <CalendarPlus size={16} />
            Add to Calendar
          </button>
        </div>
      )}

      <FloralDivider className="mx-auto mt-10 h-9 w-48 text-gold/50" />

      <p className="mx-auto mt-6 max-w-sm text-xs leading-relaxed text-charcoal/65">
        Need to change your response? Please contact our wedding organizer
        Amelia at{" "}
        <a
          href="tel:+31684396988"
          className="text-burgundy underline-offset-2 hover:underline"
        >
          +31 684 396 988
        </a>
        .
      </p>

      <Link
        href={`/rsvp/${token}`}
        className="mt-8 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-burgundy/60 transition-colors hover:text-burgundy"
      >
        <ArrowLeft size={13} weight="bold" />
        Back to invitation
      </Link>
    </div>
  );
}
