"use client";

import { useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Butterfly from "../Butterfly";
import RsvpConfirmation from "./RsvpConfirmation";
import RsvpForm from "./RsvpForm";
import { saveRsvp } from "@/lib/actions";
import type { RsvpAnswers } from "./types";

type RsvpExperienceProps = {
  guestName: string;
  token: string;
  /** Set when the guest has already responded — start on the confirmation. */
  initialAnswers?: RsvpAnswers | null;
};

export default function RsvpExperience({
  guestName,
  token,
  initialAnswers = null,
}: RsvpExperienceProps) {
  const [answers, setAnswers] = useState<RsvpAnswers | null>(initialAnswers);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (submitted: RsvpAnswers) => {
    setSaveError(null);
    startTransition(async () => {
      const result = await saveRsvp(token, submitted);
      if (result.ok) {
        setAnswers(submitted); // unchanged form -> confirmation swap
      } else {
        setSaveError(result.message);
      }
    });
  };

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-cream">
      {/* Ambient butterflies, dialed right back so they never fight the food */}
      <Butterfly
        className="left-[6%] top-[9%] text-burgundy/15"
        size={20}
        duration={24}
      />
      <Butterfly
        className="right-[8%] top-[22%] text-gold-dark/15"
        size={16}
        duration={28}
        delay={3}
        xPath={[0, -20, 12, 0]}
        yPath={[0, 18, -12, 0]}
      />

      <AnimatePresence mode="wait">
        {answers ? (
          <motion.div
            key="confirmation"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <RsvpConfirmation
              answers={answers}
              guestName={guestName}
              token={token}
            />
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <RsvpForm
              guestName={guestName}
              token={token}
              onSubmit={handleSubmit}
              pending={isPending}
              submitError={saveError}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
