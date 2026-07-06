"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import useImageLoaded from "./useImageLoaded";

const PHOTOS = [
  {
    src: "/venue/venue-web.jpg",
    alt: "The pool villa at InterContinental Hua Hin Resort",
  },
  {
    src: "/venue/venue-3-web.jpg",
    alt: "Gardens and pool beside the resort villa",
  },
];

/**
 * Three-photo venue carousel: filmstrip slide, arrow chips riding the photo,
 * position dots on its bottom rim. All slides stay mounted so stepping
 * through never flashes a loading frame.
 */
export default function VenueCarousel() {
  const [index, setIndex] = useState(0);
  const prev = () => setIndex((i) => (i + PHOTOS.length - 1) % PHOTOS.length);
  const next = () => setIndex((i) => (i + 1) % PHOTOS.length);
  // First slide gates the whole frame so it never reveals an empty box
  const { ref: firstImgRef, loaded, onLoad } = useImageLoaded();

  return (
    <div
      className={`relative overflow-hidden rounded-2xl shadow-[0_18px_40px_-18px_rgba(75,56,42,0.35)] ring-1 ring-gold/30 transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
    >
      {/* Each slide carries its own aspect ratio — percentage heights
          chained through an aspect-ratio parent resolve to 0 in Safari */}
      <motion.div
        className="flex"
        animate={{ x: `${-index * 100}%` }}
        transition={{ type: "spring", stiffness: 260, damping: 32 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.12}
        onDragEnd={(_, info) => {
          if (info.offset.x < -48) next();
          else if (info.offset.x > 48) prev();
        }}
      >
        {PHOTOS.map((photo, i) => (
          <div key={photo.src} className="relative aspect-[16/9] w-full shrink-0">
            <Image
              ref={i === 0 ? firstImgRef : undefined}
              onLoad={i === 0 ? onLoad : undefined}
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 640px) calc(100vw - 32px), 512px"
              className="pointer-events-none select-none object-cover"
            />
          </div>
        ))}
      </motion.div>

      <button
        type="button"
        onClick={prev}
        aria-label="Previous photo"
        className="absolute left-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-cream/85 text-burgundy-dark shadow-[0_2px_8px_rgba(51,39,29,0.3)] transition-all hover:bg-cream active:scale-90"
      >
        <CaretLeft size={15} weight="bold" />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next photo"
        className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-cream/85 text-burgundy-dark shadow-[0_2px_8px_rgba(51,39,29,0.3)] transition-all hover:bg-cream active:scale-90"
      >
        <CaretRight size={15} weight="bold" />
      </button>

      <div className="pointer-events-none absolute inset-x-0 bottom-2.5 flex justify-center gap-1.5">
        {PHOTOS.map((photo, i) => (
          <span
            key={photo.src}
            className={`h-1.5 rounded-full shadow-sm transition-all duration-300 ${
              i === index ? "w-4 bg-gold-light" : "w-1.5 bg-cream/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
