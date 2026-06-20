"use server";

import { saveResponse } from "@/lib/guests";
import type { RsvpAnswers } from "@/components/guest/rsvp/types";

// Expected failures are modeled as return values (not thrown) so a save error
// never blows away the form and its client state.
export type SaveResult = { ok: true } | { ok: false; message: string };

export async function saveRsvp(
  token: string,
  answers: RsvpAnswers,
): Promise<SaveResult> {
  // A Server Action is reachable by direct POST, so re-validate the token here
  // rather than trusting the caller. (Phase: also validate the payload shape.)
  const guest = await saveResponse(token, answers);
  if (!guest) {
    return {
      ok: false,
      message:
        "We couldn't find your invitation. Please use the link from your invite.",
    };
  }
  return { ok: true };
}
