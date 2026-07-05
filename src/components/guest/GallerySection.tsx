"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import TornEdge from "./TornEdge";

/**
 * Photo sheets between the invite sections. Without a photo an instance
 * renders as an empty paper placeholder (sized to match Dress Code so the
 * scroll rhythm holds). With a photo it goes full-bleed, and the
 * neighbouring sections' colours tear directly into the picture — a solid
 * TornEdge block can't match a photo, so the edges are overlaid here.
 */
type GallerySectionProps = {
  photo?: {
    src: string;
    alt: string;
    /** intrinsic dimensions — the block takes the photo's own ratio */
    width: number;
    height: number;
  };
  /** colour of the section above (tears down over the photo) */
  edgeTop?: string;
  /** colour of the section below (tears up over the photo) */
  edgeBottom?: string;
  /** clean hairline rules instead of tears — for photos whose subject
      reaches the edge (a tear would cut them off) */
  topRule?: boolean;
  bottomRule?: boolean;
};

export default function GallerySection({
  photo,
  edgeTop,
  edgeBottom,
  topRule = false,
  bottomRule = false,
}: GallerySectionProps) {
  if (!photo) {
    return (
      <section
        aria-hidden
        className="min-h-[414px] bg-paper px-4 md:min-h-[500px]"
      />
    );
  }

  return (
    <section className="relative overflow-hidden bg-paper">
      {topRule && <div className="h-0.5 bg-burgundy-dark/40" />}
      {/* Opacity only — the photo develops onto the paper as it scrolls in.
          No scale/zoom (deliberately), and the torn edges stay static since
          they belong to the neighbouring sections' paper. */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          sizes="100vw"
          className="block h-auto w-full"
        />
      </motion.div>
      {edgeTop && (
        <div className="absolute inset-x-0 top-0">
          <TornEdge topColor={edgeTop} bottomColor="transparent" />
        </div>
      )}
      {edgeBottom && (
        <div
          className="absolute inset-x-0 bottom-0"
          style={{ transform: "scaleY(-1)" }}
        >
          <TornEdge topColor={edgeBottom} bottomColor="transparent" />
        </div>
      )}
      {bottomRule && <div className="h-0.5 bg-burgundy-dark/40" />}
    </section>
  );
}
