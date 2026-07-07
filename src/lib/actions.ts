"use server";

import { saveResponse } from "@/lib/guests";
import { getSettings } from "@/lib/settings";
import { isDeadlinePassed } from "@/lib/deadline";
import { dishById } from "@/components/guest/rsvp/menu";
import type { RsvpAnswers } from "@/components/guest/rsvp/types";

// Expected failures are modeled as return values (not thrown) so a save error
// never blows away the form and its client state.
export type SaveResult = { ok: true } | { ok: false; message: string };

const MAX_TEXT = 1000;

// A Server Action is reachable by direct POST, so the payload must be
// validated here — with a durable store, a poisoned row would break the admin
// permanently, not just until a restart.
function sanitize(input: RsvpAnswers): RsvpAnswers | null {
  if (typeof input !== "object" || input === null) return null;

  const attending = input.attending;
  if (attending !== "yes" && attending !== "no") return null;

  if (attending === "yes") {
    const dish = dishById(typeof input.mealId === "string" ? input.mealId : null);
    if (!dish) return null; // a dish is required, and must exist on the menu
    return {
      attending,
      mealId: dish.id,
      dietary: cleanText(input.dietary),
      note: "",
    };
  }

  return { attending, mealId: null, dietary: "", note: cleanText(input.note) };
}

// Strip NUL + C0 control characters (keep \n and \t) — Postgres rejects NUL
// bytes in text columns, which would turn a crafted payload into a throw.
function cleanText(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, MAX_TEXT);
}

export async function saveRsvp(
  token: string,
  answers: RsvpAnswers,
): Promise<SaveResult> {
  const clean = sanitize(answers);
  if (!clean || typeof token !== "string" || !token) {
    return {
      ok: false,
      message: "Something wasn't right with your response. Please try again.",
    };
  }

  // Deadline backstop. The respond page stops rendering the form once the
  // window closes, but a form loaded before midnight (or a direct POST) must
  // be refused here too — the page check alone is cosmetic.
  const settings = await getSettings();
  if (isDeadlinePassed(settings.rsvpDeadline)) {
    return {
      ok: false,
      message:
        "RSVPs have now closed. If your plans have changed, please reach out to Harry & Susan directly.",
    };
  }

  // Transient DB failures (cold start, network blip) must come back as a
  // friendly retry message — never a thrown error that unmounts the form.
  try {
    const guest = await saveResponse(token, clean);
    if (!guest) {
      return {
        ok: false,
        message:
          "We couldn't find your invitation. Please use the link from your invite.",
      };
    }
    return { ok: true };
  } catch (error) {
    console.error("saveRsvp failed:", error);
    return {
      ok: false,
      message: "Something went wrong saving your RSVP — please try again.",
    };
  }
}
