"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, WarningCircle } from "@phosphor-icons/react";
import MealCarousel from "./MealCarousel";
import { DISHES } from "./menu";
import type { Attending, RsvpAnswers } from "./types";
import SectionReveal from "../SectionReveal";
import { FloralDivider } from "../FloralElements";

const ATTENDING_OPTIONS: { value: Attending; label: string }[] = [
  { value: "yes", label: "Yes, I'll be there" },
  { value: "no", label: "Unfortunately, I can't come" },
];

type RsvpFormProps = {
  guestName: string;
  token: string;
  onSubmit: (answers: RsvpAnswers) => void;
  /** True while the Server Action is saving. */
  pending?: boolean;
  /** A save-time error returned by the action (vs. local validation). */
  submitError?: string | null;
};

export default function RsvpForm({
  guestName,
  token,
  onSubmit,
  pending = false,
  submitError = null,
}: RsvpFormProps) {
  const [attending, setAttending] = useState<Attending | null>(null);
  const [mealId, setMealId] = useState<string | null>(null);
  const [dietary, setDietary] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  const canSubmit =
    attending === "no" || (attending === "yes" && mealId !== null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!attending) {
      setError("Please let us know if you can make it.");
      return;
    }
    if (attending === "yes" && !mealId) {
      setError("Please choose a dish before submitting.");
      return;
    }
    // Phase 4: POST /api/rsvp. For now we just hand the answers up.
    onSubmit(
      attending === "yes"
        ? { attending, mealId, dietary: dietary.trim(), note: "" }
        : { attending, mealId: null, dietary: "", note: note.trim() },
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-lg px-5 pb-24 pt-8"
    >
      <Link
        href={`/rsvp/${token}`}
        className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-burgundy/60 transition-colors hover:text-burgundy"
      >
        <ArrowLeft size={13} weight="bold" />
        Back to invitation
      </Link>

      <SectionReveal className="mt-6 flex flex-col items-center text-center">
        <FloralDivider className="h-9 w-48 text-gold/60" />
        <h1 className="font-script mt-5 text-5xl text-burgundy">
          Confirm Your Attendance
        </h1>
        {guestName && (
          <p className="mt-3 text-sm text-charcoal/65">
            We&apos;d love to know if you can join us, {guestName}.
          </p>
        )}
        <p className="mt-2 text-xs uppercase tracking-[0.2em] text-charcoal/65">
          Please RSVP before 15 September 2026
        </p>
      </SectionReveal>

      <fieldset className="mt-10">
        <legend className="mb-3 text-sm font-medium text-charcoal">
          Will you be joining us?
        </legend>
        <div className="flex flex-col gap-2.5">
          {ATTENDING_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 text-sm transition-colors ${
                attending === option.value
                  ? "border-burgundy bg-blush/50 text-charcoal"
                  : "border-cream-dark text-charcoal/75 hover:border-gold"
              }`}
            >
              <input
                type="radio"
                name="attending"
                value={option.value}
                checked={attending === option.value}
                onChange={() => {
                  setAttending(option.value);
                  setError(null);
                }}
                className="h-4 w-4 accent-burgundy"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <AnimatePresence mode="wait">
        {attending === "yes" && (
          <motion.div
            key="attending"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="mt-12">
              <h2 className="font-script text-center text-3xl text-burgundy">
                Choose Your Dish
              </h2>
              <p className="mx-auto mt-2 mb-6 max-w-xs text-center text-xs leading-relaxed text-charcoal/65">
                A plated main course, served to you on the night. Swipe through
                and tick your choice.
              </p>
              <MealCarousel
                dishes={DISHES}
                value={mealId}
                onChange={(id) => {
                  setMealId(id);
                  setError(null);
                }}
              />
            </div>

            <div className="mt-12 flex flex-col gap-2">
              <label
                htmlFor="dietary"
                className="text-sm font-medium text-charcoal"
              >
                Dietary requirements
              </label>
              <textarea
                id="dietary"
                value={dietary}
                onChange={(event) => setDietary(event.target.value)}
                rows={3}
                placeholder="Allergies, vegetarian, preferences…"
                className="resize-none rounded-xl border border-cream-dark bg-cream/40 px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/55 focus:border-burgundy focus:outline-none"
              />
              <p className="text-xs text-charcoal/60">
                Leave blank if none. The kitchen will accommodate where
                possible.
              </p>
            </div>
          </motion.div>
        )}

        {attending === "no" && (
          <motion.div
            key="declining"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mt-12 flex flex-col gap-2"
          >
            <label htmlFor="note" className="text-sm font-medium text-charcoal">
              A note to the couple{" "}
              <span className="text-charcoal/60">(optional)</span>
            </label>
            <textarea
              id="note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={3}
              placeholder="We'll miss you — leave a message if you'd like."
              className="resize-none rounded-xl border border-cream-dark bg-cream/40 px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/55 focus:border-burgundy focus:outline-none"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent live region: empty until validation fails, then announced.
          Pairs the colour with a warning icon so it doesn't rely on colour
          alone. */}
      <div
        id="rsvp-error"
        role="alert"
        aria-live="assertive"
        className="mt-6 min-h-[1.25rem] text-center text-sm text-burgundy"
      >
        {(error || submitError) && (
          <span className="inline-flex items-center gap-1.5">
            <WarningCircle size={16} weight="fill" />
            {error || submitError}
          </span>
        )}
      </div>

      {/* Kept operable on purpose: it reads as muted until the form is valid,
          but tapping it while incomplete announces what's missing rather than
          being a dead, unexplained control. Disabled only briefly while the
          save is in flight, to prevent a double submit. */}
      <button
        type="submit"
        aria-describedby="rsvp-error"
        aria-busy={pending}
        disabled={pending}
        className={`mt-4 w-full rounded-full py-4 text-xs font-semibold uppercase tracking-[0.25em] transition-all ${
          canSubmit
            ? "animate-btn-glow bg-burgundy text-cream hover:bg-burgundy-dark active:scale-[0.98]"
            : "bg-burgundy/40 text-cream/90"
        } ${pending ? "opacity-70" : ""}`}
      >
        {pending ? "Submitting…" : "Submit RSVP"}
      </button>
    </form>
  );
}
