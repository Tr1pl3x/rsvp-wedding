import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { DEFAULT_MESSAGE_TEMPLATE } from "@/lib/template";
import { isFilter, isSort, type GuestFilter, type GuestSort } from "@/lib/guest-views";

export type AppSettings = {
  messageTemplate: string;
  rsvpDeadline: string;
  defaultFilter: GuestFilter;
  defaultSort: GuestSort;
};

const DEFAULTS: AppSettings = {
  messageTemplate: DEFAULT_MESSAGE_TEMPLATE,
  rsvpDeadline: "2026-09-15", // canonical YYYY-MM-DD; guests see it via formatDeadline
  defaultFilter: "everyone",
  defaultSort: "newest",
};

// Single-row table (id = 1). Filter/sort are sanitized on READ as well as
// write, so a legacy/corrupt row can never crash the admin view.
export const getSettings = cache(async (): Promise<AppSettings> => {
  const row = await prisma.settings.findUnique({ where: { id: 1 } });
  if (!row) return DEFAULTS;
  return {
    messageTemplate: row.messageTemplate,
    rsvpDeadline: row.rsvpDeadline,
    defaultFilter: isFilter(row.defaultFilter) ? row.defaultFilter : "everyone",
    defaultSort: isSort(row.defaultSort) ? row.defaultSort : "newest",
  };
});

export async function updateSettings(
  patch: Partial<AppSettings>,
): Promise<AppSettings> {
  // Shallow merge over the current values (same semantics as the old mock);
  // empty strings are persisted deliberately — no falsy filtering.
  const current = await getSettings();
  const merged = { ...current, ...patch };
  await prisma.settings.upsert({
    where: { id: 1 },
    create: { id: 1, ...merged },
    update: merged,
  });
  return merged;
}
