"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarPlus,
  CheckCircle,
  MapPin,
  X,
} from "@phosphor-icons/react";

type Attending = "yes" | "no";

type RsvpAnswers = {
  attending: Attending;
  dietary: string;
};

const ATTENDING_OPTIONS: { value: Attending; label: string }[] = [
  { value: "yes", label: "Yes, I will be there" },
  { value: "no", label: "Unfortunately, I can't come" },
];

function RsvpForm({ onSubmit }: { onSubmit: (answers: RsvpAnswers) => void }) {
  const [attending, setAttending] = useState<Attending | null>(null);
  const [dietary, setDietary] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!attending) {
      setError(true);
      return;
    }
    // Phase 4: POST /api/rsvp — for now this just flips to the confirmation
    onSubmit({ attending, dietary: dietary.trim() });
  };

  return (
    <motion.form
      key="form"
      onSubmit={handleSubmit}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <h3 className="font-script text-center text-4xl text-burgundy">
        Confirm Your Attendance
      </h3>
      <p className="mt-3 text-center text-xs uppercase tracking-[0.2em] text-charcoal/55">
        Please RSVP before 15 September 2026
      </p>

      <fieldset className="mt-8 flex flex-col gap-2">
        <legend className="mb-2 text-sm font-medium text-charcoal">
          Will you come?
        </legend>
        {ATTENDING_OPTIONS.map((option) => (
          <label
            key={option.value}
            className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${
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
                setError(false);
              }}
              className="h-4 w-4 accent-burgundy"
            />
            {option.label}
          </label>
        ))}
        {error && (
          <p className="text-xs text-rose">
            Please let us know if you can make it.
          </p>
        )}
      </fieldset>

      <div className="mt-6 flex flex-col gap-2">
        <label htmlFor="dietary" className="text-sm font-medium text-charcoal">
          Dietary requirements
        </label>
        <textarea
          id="dietary"
          value={dietary}
          onChange={(e) => setDietary(e.target.value)}
          rows={3}
          placeholder="Allergies, preferences…"
          className="resize-none rounded-xl border border-cream-dark bg-cream/40 px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/35 focus:border-burgundy focus:outline-none"
        />
        <p className="text-xs text-charcoal/45">Leave blank if none.</p>
      </div>

      <button
        type="submit"
        className="mt-8 w-full rounded-full bg-burgundy py-3.5 text-xs font-semibold uppercase tracking-[0.25em] text-cream transition-all hover:bg-burgundy-dark active:scale-[0.98]"
      >
        Submit
      </button>
    </motion.form>
  );
}

function RsvpConfirmation({ answers }: { answers: RsvpAnswers }) {
  const attending = answers.attending === "yes";

  return (
    <motion.div
      key="confirmation"
      className="flex flex-col items-center text-center"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.15 }}
        className="text-gold-dark"
      >
        <CheckCircle size={64} weight="fill" />
      </motion.span>

      <h3 className="font-script mt-4 text-4xl text-burgundy">Thank you!</h3>
      <p className="mt-3 max-w-xs text-sm leading-relaxed text-charcoal/70">
        {attending
          ? "We can't wait to celebrate with you in Hua Hin."
          : "We're sorry you can't make it — you'll be missed."}
      </p>

      <dl className="mt-8 w-full divide-y divide-cream-dark border-y border-cream-dark text-sm">
        <div className="flex items-center justify-between py-3">
          <dt className="text-charcoal/55">Attending</dt>
          <dd className="font-medium text-charcoal">
            {attending ? "Yes" : "No"}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-6 py-3">
          <dt className="shrink-0 text-charcoal/55">Dietary</dt>
          <dd className="truncate font-medium text-charcoal">
            {answers.dietary || "None"}
          </dd>
        </div>
      </dl>

      {attending && (
        <div className="mt-8 flex w-full flex-col gap-2">
          {/* Phase 4: generate .ics + Google Maps link */}
          <button className="flex items-center justify-center gap-2 rounded-full border border-burgundy/30 py-3 text-xs font-medium uppercase tracking-[0.2em] text-burgundy transition-colors hover:bg-blush/50 active:scale-[0.98]">
            <CalendarPlus size={16} />
            Add to Calendar
          </button>
          <button className="flex items-center justify-center gap-2 rounded-full border border-burgundy/30 py-3 text-xs font-medium uppercase tracking-[0.2em] text-burgundy transition-colors hover:bg-blush/50 active:scale-[0.98]">
            <MapPin size={16} />
            View Venue Location
          </button>
        </div>
      )}
    </motion.div>
  );
}

type RsvpModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function RsvpModal({ open, onClose }: RsvpModalProps) {
  const [answers, setAnswers] = useState<RsvpAnswers | null>(null);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-charcoal/60 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-3xl bg-cream px-6 py-10 sm:px-10"
            initial={{ opacity: 0, y: 60, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 200, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-full p-2 text-charcoal/50 transition-colors hover:bg-cream-dark hover:text-charcoal"
            >
              <X size={18} />
            </button>

            <AnimatePresence mode="wait">
              {answers ? (
                <RsvpConfirmation answers={answers} />
              ) : (
                <RsvpForm onSubmit={setAnswers} />
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
