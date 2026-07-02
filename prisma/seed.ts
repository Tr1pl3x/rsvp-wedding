// Seeds the DEV database with the six familiar test guests + default settings.
// Idempotent: wipes and recreates, so it doubles as the reset for verify runs.
//   npx prisma db seed
// Production stays empty — the real guest list is entered via the admin.
import { config } from "dotenv";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

config({ path: ".env.local" });
config();

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const DEFAULT_TEMPLATE =
  "Hi {name}, you're warmly invited to Harry & Susan's wedding on {date} at {venue}. Please RSVP by {deadline}: {link}";

async function main() {
  // This WIPES the guest table. Refuse to run against production unless
  // explicitly forced — one wrong env file must not destroy the real list.
  if (
    (process.env.VERCEL_ENV === "production" ||
      process.env.NODE_ENV === "production") &&
    process.env.SEED_ALLOW_WIPE !== "1"
  ) {
    throw new Error(
      "Refusing to seed a production environment. Set SEED_ALLOW_WIPE=1 to override.",
    );
  }

  await prisma.guest.deleteMany();
  await prisma.guest.createMany({
    data: [
      {
        id: "g1",
        name: "Isabelle",
        token: "test-token",
        maxGuests: 1,
        status: "sent",
        createdAt: new Date("2026-05-01T10:00:00.000Z"),
      },
      {
        id: "g2",
        name: "Marco Vidal",
        token: "marco-vidal",
        maxGuests: 2,
        status: "sent",
        createdAt: new Date("2026-05-03T10:00:00.000Z"),
      },
      {
        id: "g3",
        name: "Priya Anand",
        token: "priya-anand",
        maxGuests: 1,
        status: "responded",
        attending: "yes",
        mealId: "beef",
        dietary: "No pork",
        respondedAt: new Date("2026-06-15T09:30:00.000Z"),
        createdAt: new Date("2026-05-05T10:00:00.000Z"),
      },
      {
        id: "g4",
        name: "Théo Laurent",
        token: "theo-laurent",
        maxGuests: 2,
        status: "responded",
        attending: "yes",
        mealId: "chicken",
        dietary: "One vegetarian in our party",
        respondedAt: new Date("2026-06-16T14:20:00.000Z"),
        createdAt: new Date("2026-05-08T10:00:00.000Z"),
      },
      {
        id: "g5",
        name: "Amara Okafor",
        token: "amara-okafor",
        maxGuests: 1,
        status: "responded",
        attending: "no",
        note: "So sad to miss it — sending you both all my love!",
        respondedAt: new Date("2026-06-14T18:05:00.000Z"),
        createdAt: new Date("2026-05-10T10:00:00.000Z"),
      },
      {
        id: "g6",
        name: "Kenji Watanabe",
        token: "kenji-watanabe",
        maxGuests: 1,
        status: "not_sent",
        createdAt: new Date("2026-05-12T10:00:00.000Z"),
      },
    ],
  });

  // Full reset (including the template) so verify runs start from a known
  // baseline.
  const settings = {
    messageTemplate: DEFAULT_TEMPLATE,
    rsvpDeadline: "15 September 2026",
    defaultFilter: "everyone",
    defaultSort: "newest",
  };
  await prisma.settings.upsert({
    where: { id: 1 },
    create: { id: 1, ...settings },
    update: settings,
  });

  const count = await prisma.guest.count();
  console.log(`Seeded ${count} guests + settings.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
