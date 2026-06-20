import { cache } from "react";
import type { RsvpAnswers } from "@/components/guest/rsvp/types";

export type GuestStatus = "not_sent" | "sent" | "responded";

export type Guest = {
  id: string;
  name: string;
  token: string;
  maxGuests: number;
  status: GuestStatus;
  response: RsvpAnswers | null;
  respondedAt: string | null;
};

/**
 * MOCK STORE — a module-level in-memory list standing in for the database.
 *
 * It resets on server restart and is not shared across serverless instances,
 * which is fine for building/testing. The Neon + Prisma swap happens entirely
 * inside this file: the functions below keep the same signatures, so nothing
 * that imports them has to change.
 */
const guests: Guest[] = [
  {
    id: "g1",
    name: "Isabelle",
    token: "test-token",
    maxGuests: 1,
    status: "sent",
    response: null,
    respondedAt: null,
  },
  {
    id: "g2",
    name: "Marco Vidal",
    token: "marco-vidal",
    maxGuests: 1,
    status: "sent",
    response: null,
    respondedAt: null,
  },
  {
    id: "g3",
    name: "Priya Anand",
    token: "priya-anand",
    maxGuests: 1,
    status: "responded",
    response: { attending: "yes", mealId: "beef", dietary: "No pork", note: "" },
    respondedAt: "2026-06-15T09:30:00.000Z",
  },
  {
    id: "g4",
    name: "Théo Laurent",
    token: "theo-laurent",
    maxGuests: 1,
    status: "sent",
    response: null,
    respondedAt: null,
  },
  {
    id: "g5",
    name: "Amara Okafor",
    token: "amara-okafor",
    maxGuests: 1,
    status: "responded",
    response: {
      attending: "no",
      mealId: null,
      dietary: "",
      note: "So sad to miss it — sending you both all my love!",
    },
    respondedAt: "2026-06-14T18:05:00.000Z",
  },
  {
    id: "g6",
    name: "Kenji Watanabe",
    token: "kenji-watanabe",
    maxGuests: 1,
    status: "not_sent",
    response: null,
    respondedAt: null,
  },
];

// cache() dedupes the lookup within a single request (page render + any
// return-visit branch). It does NOT persist across requests, so with
// force-dynamic each visit reads the live store.
export const getGuestByToken = cache(
  async (token: string): Promise<Guest | null> => {
    return guests.find((guest) => guest.token === token) ?? null;
  },
);

export async function saveResponse(
  token: string,
  answers: RsvpAnswers,
): Promise<Guest | null> {
  const guest = guests.find((entry) => entry.token === token);
  if (!guest) return null;
  guest.response = answers;
  guest.status = "responded";
  guest.respondedAt = new Date().toISOString();
  return guest;
}

export async function listGuests(): Promise<Guest[]> {
  return guests;
}
