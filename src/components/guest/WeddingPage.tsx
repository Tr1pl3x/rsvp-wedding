"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import CtaSection from "./CtaSection";
import DetailsSection from "./DetailsSection";
import DressCodeSection from "./DressCodeSection";
import EnvelopeEntry, { OPEN_TOTAL, RISE_DELAY, RISE_DUR } from "./EnvelopeEntry";
import HeroSection from "./HeroSection";
import LocationSection from "./LocationSection";
import ScheduleSection from "./ScheduleSection";
import TornEdge from "./TornEdge";

const COLORS = {
  cream: "#fff8f3",
  burgundy: "#862042",
  burgundyDark: "#601530",
};

type WeddingPageProps = {
  guestName: string;
  token: string;
  deadline: string;
};

export default function WeddingPage({
  guestName,
  token,
  deadline,
}: WeddingPageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // The envelope reports when its body has actually slid off-screen — that
  // is the reveal cue. The timer is only a safety net (e.g. the animation
  // never completing for some reason), generous enough that it can't fire
  // while the drop is still visibly in flight.
  const handleOpen = () => {
    setIsOpen(true);
    revealTimer.current = setTimeout(
      () => setIsRevealed(true),
      (OPEN_TOTAL + 2) * 1000,
    );
  };

  const handleDropComplete = () => {
    if (revealTimer.current) clearTimeout(revealTimer.current);
    // Small beat between the motion ending and the unmount so the removal
    // never coincides with anything still settling on screen
    revealTimer.current = setTimeout(() => setIsRevealed(true), 150);
  };

  useEffect(() => {
    return () => {
      if (revealTimer.current) clearTimeout(revealTimer.current);
    };
  }, []);

  // No scrolling until the envelope has fully opened
  useEffect(() => {
    document.body.style.overflow = isRevealed ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isRevealed]);

  return (
    <>
      {!isRevealed && (
        <EnvelopeEntry
          guestName={guestName}
          isOpen={isOpen}
          onOpen={handleOpen}
          onDropComplete={handleDropComplete}
        />
      )}

      <motion.main
        className={
          isRevealed ? "relative" : "fixed inset-0 z-[52] overflow-hidden"
        }
        // The page is the card: it starts tucked inside the envelope (its top
        // edge just below the slot) and rises out full-size, its lower part
        // occluded by the envelope pocket until the envelope drops away
        initial={{ y: "55dvh" }}
        animate={{ y: isOpen || isRevealed ? "0dvh" : "55dvh" }}
        transition={{
          delay: isOpen && !isRevealed ? RISE_DELAY : 0,
          duration: isRevealed ? 0 : RISE_DUR,
          ease: [0.3, 0.9, 0.3, 1],
        }}
      >
        <HeroSection />
        <ScheduleSection />
        <TornEdge topColor={COLORS.burgundy} bottomColor={COLORS.cream} />
        <LocationSection />
        <TornEdge topColor={COLORS.cream} bottomColor={COLORS.burgundy} />
        <DressCodeSection />
        <TornEdge topColor={COLORS.burgundy} bottomColor={COLORS.cream} />
        <DetailsSection />
        <TornEdge topColor={COLORS.cream} bottomColor={COLORS.burgundyDark} />
        <CtaSection token={token} deadline={deadline} />
      </motion.main>
    </>
  );
}
