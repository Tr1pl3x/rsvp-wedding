// Client-safe deadline helpers. The setting is stored canonically as
// YYYY-MM-DD (what <input type="date"> emits); guests always see prose.

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * "2026-09-15" -> "15 September 2026". Values that aren't canonical (the
 * pre-picker free-text era) pass through untouched, so nothing breaks
 * before the setting is re-saved once.
 * Constructed from parts — new Date("2026-09-15") parses as UTC and can
 * render a day early west of Greenwich.
 */
export function formatDeadline(value: string): string {
  const match = ISO_DATE.exec(value.trim());
  if (!match) return value;
  const date = new Date(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
  );
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/** Best-effort conversion of a stored deadline to a date-input value. */
export function toDateInputValue(value: string): string {
  const trimmed = value.trim();
  if (ISO_DATE.test(trimmed)) return trimmed;
  const parsed = new Date(trimmed); // legacy prose, e.g. "15 September 2026"
  if (Number.isNaN(parsed.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}`;
}

export function isIsoDate(value: string): boolean {
  return ISO_DATE.test(value.trim());
}
