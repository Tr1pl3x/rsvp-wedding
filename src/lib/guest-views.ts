import type { Guest } from "@/lib/guests";

export type GuestFilter =
  | "everyone"
  | "attending"
  | "declined"
  | "awaiting"
  | "not_sent"
  | "dietary";

export type GuestSort = "newest" | "latest_reply" | "name_asc";

export const FILTERS: { value: GuestFilter; label: string }[] = [
  { value: "everyone", label: "Everyone" },
  { value: "attending", label: "Attending" },
  { value: "declined", label: "Can't make it" },
  { value: "awaiting", label: "Awaiting reply" },
  { value: "not_sent", label: "Not sent" },
  { value: "dietary", label: "Dietary needs" },
];

export const SORTS: { value: GuestSort; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "latest_reply", label: "Latest replies" },
  { value: "name_asc", label: "Name (A–Z)" },
];

export function isFilter(value: string): value is GuestFilter {
  return FILTERS.some((f) => f.value === value);
}

export function isSort(value: string): value is GuestSort {
  return SORTS.some((s) => s.value === value);
}

function matchesFilter(guest: Guest, filter: GuestFilter): boolean {
  switch (filter) {
    case "attending":
      return guest.response?.attending === "yes";
    case "declined":
      return guest.response?.attending === "no";
    case "awaiting":
      return guest.status === "sent";
    case "not_sent":
      return guest.status === "not_sent";
    case "dietary":
      return (
        guest.response?.attending === "yes" &&
        guest.response.dietary.trim().length > 0
      );
    case "everyone":
    default:
      return true;
  }
}

// Fold accents so searching "theo" matches "Théo" (consistent with slugify).
function fold(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

// ISO date strings sort lexicographically = chronologically.
export function applyView(
  guests: Guest[],
  { search, filter, sort }: { search: string; filter: GuestFilter; sort: GuestSort },
): Guest[] {
  const q = fold(search.trim());
  const filtered = guests.filter(
    (g) => matchesFilter(g, filter) && (!q || fold(g.name).includes(q)),
  );

  return [...filtered].sort((a, b) => {
    switch (sort) {
      case "name_asc":
        return a.name.localeCompare(b.name);
      case "latest_reply":
        if (!a.respondedAt && !b.respondedAt) return 0;
        if (!a.respondedAt) return 1;
        if (!b.respondedAt) return -1;
        return b.respondedAt.localeCompare(a.respondedAt);
      case "newest":
      default:
        return b.createdAt.localeCompare(a.createdAt);
    }
  });
}
