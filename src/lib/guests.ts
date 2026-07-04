import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import type { Guest as GuestRow } from "@/generated/prisma/client";
import type { RsvpAnswers } from "@/components/guest/rsvp/types";

export type GuestStatus = "not_sent" | "sent" | "responded";

// The app-facing shape is unchanged from the mock era: dates are ISO STRINGS
// (client code string-sorts and slices them) and the response is a composed
// RsvpAnswers object. All Prisma specifics stay inside this module.
// One guest = one invite = one seat = one meal (the couple sends every person
// their own link), so there is deliberately no party-size/seats concept.
export type Guest = {
  id: string;
  name: string;
  token: string;
  status: GuestStatus;
  response: RsvpAnswers | null;
  respondedAt: string | null;
  createdAt: string;
};

function toGuest(row: GuestRow): Guest {
  return {
    id: row.id,
    name: row.name,
    token: row.token,
    status: row.status,
    response:
      row.attending === null
        ? null
        : {
            attending: row.attending,
            mealId: row.mealId,
            dietary: row.dietary,
            note: row.note,
          },
    respondedAt: row.respondedAt ? row.respondedAt.toISOString() : null,
    createdAt: row.createdAt.toISOString(),
  };
}

// Expected failures are expressed as null/false returns (never throws) — the
// actions layer depends on that contract.
function prismaErrorCode(error: unknown): string | undefined {
  if (typeof error === "object" && error !== null && "code" in error) {
    return String((error as { code: unknown }).code);
  }
  return undefined;
}

// cache() dedupes the lookup within a single request. All consuming pages are
// force-dynamic, so every visit still reads fresh rows.
export const getGuestByToken = cache(
  async (token: string): Promise<Guest | null> => {
    const row = await prisma.guest.findUnique({ where: { token } });
    return row ? toGuest(row) : null;
  },
);

export async function saveResponse(
  token: string,
  answers: RsvpAnswers,
): Promise<Guest | null> {
  try {
    const row = await prisma.guest.update({
      where: { token },
      data: {
        attending: answers.attending,
        mealId: answers.mealId,
        dietary: answers.dietary,
        note: answers.note,
        status: "responded",
        respondedAt: new Date(),
      },
    });
    return toGuest(row);
  } catch (error) {
    if (prismaErrorCode(error) === "P2025") return null; // unknown token
    throw error;
  }
}

export async function listGuests(): Promise<Guest[]> {
  const rows = await prisma.guest.findMany({ orderBy: { createdAt: "asc" } });
  return rows.map(toGuest);
}

function slugify(name: string): string {
  return (
    name
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 20) || "guest"
  );
}

function randomToken(name: string): string {
  const rand = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
  return `${slugify(name)}-${rand}`;
}

export async function createGuest(name: string): Promise<Guest> {
  const data = {
    name: name.trim(),
    status: "not_sent" as const,
  };
  // Token uniqueness is enforced by the DB constraint; retry on collision.
  for (let attempt = 0; ; attempt++) {
    try {
      const row = await prisma.guest.create({
        data: { ...data, id: crypto.randomUUID(), token: randomToken(name) },
      });
      return toGuest(row);
    } catch (error) {
      if (prismaErrorCode(error) === "P2002" && attempt < 5) continue;
      throw error;
    }
  }
}

export async function updateGuest(
  id: string,
  patch: Partial<Pick<Guest, "name" | "status">>,
): Promise<Guest | null> {
  try {
    const row = await prisma.guest.update({
      where: { id },
      data: {
        name: patch.name !== undefined ? patch.name.trim() : undefined,
        status: patch.status,
      },
    });
    return toGuest(row);
  } catch (error) {
    if (prismaErrorCode(error) === "P2025") return null;
    throw error;
  }
}

// Upgrades not_sent -> sent (used when the admin copies the invite message).
// Never downgrades a guest who has already responded.
export async function markSent(id: string): Promise<Guest | null> {
  await prisma.guest.updateMany({
    where: { id, status: "not_sent" },
    data: { status: "sent" },
  });
  const row = await prisma.guest.findUnique({ where: { id } });
  return row ? toGuest(row) : null;
}

export async function deleteGuest(id: string): Promise<boolean> {
  const result = await prisma.guest.deleteMany({ where: { id } });
  return result.count > 0;
}
