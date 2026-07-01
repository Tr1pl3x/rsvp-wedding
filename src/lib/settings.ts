import { cache } from "react";
import type { GuestFilter, GuestSort } from "@/lib/guest-views";

export type AppSettings = {
  messageTemplate: string;
  rsvpDeadline: string;
  defaultFilter: GuestFilter;
  defaultSort: GuestSort;
};

export const DEFAULT_MESSAGE_TEMPLATE =
  "Hi {name}, you're warmly invited to Harry & Susan's wedding on {date} at {venue}. Please RSVP by {deadline}: {link}";

// MOCK STORE — module-level, same swap-for-DB pattern as guests.ts.
let settings: AppSettings = {
  messageTemplate: DEFAULT_MESSAGE_TEMPLATE,
  rsvpDeadline: "15 September 2026",
  defaultFilter: "everyone",
  defaultSort: "newest",
};

export const getSettings = cache(async (): Promise<AppSettings> => {
  return settings;
});

export async function updateSettings(
  patch: Partial<AppSettings>,
): Promise<AppSettings> {
  settings = { ...settings, ...patch };
  return settings;
}

/** Fill {name} {link} {date} {venue} {deadline} in a template. */
export function renderTemplate(
  template: string,
  values: Record<string, string>,
): string {
  // Object.hasOwn (not `in`) so template placeholders like {toString} or
  // {constructor} are left literal instead of resolving to prototype members.
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    Object.hasOwn(values, key) ? values[key] : match,
  );
}
