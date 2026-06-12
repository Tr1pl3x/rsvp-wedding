"use client";

import { memo } from "react";
import { motion } from "framer-motion";

type ButterflyProps = {
  /** Positioning + colour, e.g. "top-[15%] left-[10%] text-gold-light/60" */
  className?: string;
  size?: number;
  delay?: number;
  duration?: number;
  xPath?: number[];
  yPath?: number[];
};

function ButterflyImpl({
  className = "",
  size = 28,
  delay = 0,
  duration = 20,
  xPath = [0, 40, -25, 15, 0],
  yPath = [0, -30, -60, -25, 0],
}: ButterflyProps) {
  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none absolute ${className}`}
      animate={{ x: xPath, y: yPath, rotate: [0, 8, -6, 4, 0] }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
      }}
    >
      <svg
        width={size}
        height={size * 0.8}
        viewBox="0 0 100 80"
        fill="currentColor"
      >
        {/* Left wing */}
        <motion.g
          style={{ transformBox: "fill-box", transformOrigin: "100% 50%" }}
          animate={{ scaleX: [1, 0.45, 1] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M47 40 C38 14 12 4 6 20 C2 32 16 40 44 41 Z"
            opacity="0.9"
          />
          <path
            d="M47 43 C34 44 14 46 12 58 C11 70 30 72 46 48 Z"
            opacity="0.65"
          />
        </motion.g>
        {/* Right wing */}
        <motion.g
          style={{ transformBox: "fill-box", transformOrigin: "0% 50%" }}
          animate={{ scaleX: [1, 0.45, 1] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M53 40 C62 14 88 4 94 20 C98 32 84 40 56 41 Z"
            opacity="0.9"
          />
          <path
            d="M53 43 C66 44 86 46 88 58 C89 70 70 72 54 48 Z"
            opacity="0.65"
          />
        </motion.g>
        {/* Body */}
        <ellipse cx="50" cy="42" rx="2.6" ry="15" />
        <circle cx="50" cy="26" r="3.4" />
      </svg>
    </motion.div>
  );
}

const Butterfly = memo(ButterflyImpl);
export default Butterfly;
