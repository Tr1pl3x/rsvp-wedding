/**
 * Torn-paper transition between two sections. The block's background is the
 * lower section's colour; the SVG (upper colour) tears raggedly into it.
 */

type TornEdgeProps = {
  topColor: string;
  bottomColor: string;
};

export default function TornEdge({ topColor, bottomColor }: TornEdgeProps) {
  return (
    <div
      aria-hidden
      className="relative h-[52px] w-full md:h-[68px]"
      style={{ backgroundColor: bottomColor }}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 68"
        preserveAspectRatio="none"
      >
        <path
          fill={topColor}
          d="M0 0 H1200 V22
             C1172 30 1150 14 1122 24 C1098 33 1080 18 1054 28 C1026 39 1004 20 978 26
             C950 32 934 46 906 38 C880 31 862 16 834 24 C806 32 792 44 764 36
             C738 29 720 14 692 22 C666 30 650 42 622 34 C596 27 580 12 552 20
             C524 28 508 40 480 33 C454 27 438 14 410 21 C382 28 366 42 338 36
             C312 31 296 16 268 23 C240 30 224 44 196 37 C170 31 152 17 124 24
             C96 31 80 42 52 35 C32 30 16 24 0 28 Z"
        />
        {/* Soft shadow under the tear */}
        <path
          fill="none"
          stroke="rgba(44,16,24,0.12)"
          strokeWidth="3"
          d="M0 30 C28 26 44 32 64 36 C96 43 112 32 140 26 C168 19 184 33 212 39
             C240 46 256 32 284 25 C312 18 328 33 356 38 C384 44 400 29 428 23
             C456 17 472 30 500 35 C528 41 544 30 572 22 C600 15 616 29 644 36
             C672 44 688 32 716 24 C744 17 760 31 788 38 C816 46 832 34 860 26
             C888 18 906 33 934 40 C962 48 978 34 1006 28 C1034 22 1056 35 1084 26
             C1112 17 1140 32 1168 24 C1180 21 1192 22 1200 24"
          opacity="0.5"
        />
      </svg>
    </div>
  );
}
