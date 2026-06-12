/**
 * Stroke-based SVG decorations. All inherit `currentColor`, so tint them
 * with text colour utilities (e.g. "text-gold/40").
 */

type DecorationProps = {
  className?: string;
};

export function FloralCorner({ className = "" }: DecorationProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 160 160"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      className={`pointer-events-none ${className}`}
    >
      {/* Main vine sweeping out of the corner */}
      <path d="M8 8 C30 18 48 36 56 64 C62 86 58 112 44 134" />
      <path d="M8 8 C24 6 52 10 76 26 C96 39 110 58 116 80" />
      {/* Leaves */}
      <path d="M40 30 C50 24 60 26 64 34 C56 40 46 38 40 30 Z" />
      <path d="M58 56 C68 52 76 56 78 64 C70 69 61 65 58 56 Z" />
      <path d="M52 96 C61 94 68 99 68 107 C60 110 53 104 52 96 Z" />
      <path d="M88 38 C97 34 105 38 107 46 C99 51 90 47 88 38 Z" />
      {/* Small five-petal flower */}
      <g transform="translate(112 88)">
        <circle r="3" fill="currentColor" stroke="none" />
        <ellipse rx="4" ry="8" transform="rotate(0) translate(0 -9)" />
        <ellipse rx="4" ry="8" transform="rotate(72) translate(0 -9)" />
        <ellipse rx="4" ry="8" transform="rotate(144) translate(0 -9)" />
        <ellipse rx="4" ry="8" transform="rotate(216) translate(0 -9)" />
        <ellipse rx="4" ry="8" transform="rotate(288) translate(0 -9)" />
      </g>
      {/* Bud */}
      <path d="M44 134 C40 142 42 150 48 154" />
      <ellipse cx="50" cy="150" rx="4" ry="6" transform="rotate(28 50 150)" />
    </svg>
  );
}

export function FloralDivider({ className = "" }: DecorationProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 280 44"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      className={`pointer-events-none ${className}`}
    >
      {/* Left flourish */}
      <path d="M10 22 C48 22 78 22 108 22 C96 16 88 12 84 6" />
      <path d="M108 22 C98 26 92 30 88 36" />
      {/* Right flourish */}
      <path d="M270 22 C232 22 202 22 172 22 C184 16 192 12 196 6" />
      <path d="M172 22 C182 26 188 30 192 36" />
      {/* Centre flower */}
      <g transform="translate(140 22)">
        <circle r="3" fill="currentColor" stroke="none" />
        <ellipse rx="3.5" ry="7" transform="rotate(0) translate(0 -8)" />
        <ellipse rx="3.5" ry="7" transform="rotate(60) translate(0 -8)" />
        <ellipse rx="3.5" ry="7" transform="rotate(120) translate(0 -8)" />
        <ellipse rx="3.5" ry="7" transform="rotate(180) translate(0 -8)" />
        <ellipse rx="3.5" ry="7" transform="rotate(240) translate(0 -8)" />
        <ellipse rx="3.5" ry="7" transform="rotate(300) translate(0 -8)" />
      </g>
      {/* Tiny leaf pairs flanking the flower */}
      <path d="M120 22 C116 16 110 14 104 16" />
      <path d="M160 22 C164 16 170 14 176 16" />
    </svg>
  );
}

export function PetalCluster({ className = "" }: DecorationProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 180 120"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      className={`pointer-events-none ${className}`}
    >
      {/* Large bloom */}
      <g transform="translate(60 58)">
        <circle r="4" fill="currentColor" stroke="none" />
        <ellipse rx="6" ry="13" transform="rotate(0) translate(0 -14)" />
        <ellipse rx="6" ry="13" transform="rotate(60) translate(0 -14)" />
        <ellipse rx="6" ry="13" transform="rotate(120) translate(0 -14)" />
        <ellipse rx="6" ry="13" transform="rotate(180) translate(0 -14)" />
        <ellipse rx="6" ry="13" transform="rotate(240) translate(0 -14)" />
        <ellipse rx="6" ry="13" transform="rotate(300) translate(0 -14)" />
      </g>
      {/* Companion bloom */}
      <g transform="translate(120 44)">
        <circle r="3" fill="currentColor" stroke="none" />
        <ellipse rx="4" ry="9" transform="rotate(20) translate(0 -10)" />
        <ellipse rx="4" ry="9" transform="rotate(92) translate(0 -10)" />
        <ellipse rx="4" ry="9" transform="rotate(164) translate(0 -10)" />
        <ellipse rx="4" ry="9" transform="rotate(236) translate(0 -10)" />
        <ellipse rx="4" ry="9" transform="rotate(308) translate(0 -10)" />
      </g>
      {/* Buds + stems + leaves */}
      <path d="M60 78 C62 94 70 104 84 110" />
      <path d="M120 56 C124 74 134 86 150 92" />
      <path d="M96 70 C100 80 108 86 118 88" />
      <ellipse cx="152" cy="92" rx="5" ry="8" transform="rotate(40 152 92)" />
      <ellipse cx="86" cy="108" rx="5" ry="8" transform="rotate(70 86 108)" />
      <path d="M30 80 C38 76 46 78 50 84 C44 90 34 88 30 80 Z" />
      <path d="M140 28 C146 22 154 22 158 28 C154 34 144 34 140 28 Z" />
    </svg>
  );
}
