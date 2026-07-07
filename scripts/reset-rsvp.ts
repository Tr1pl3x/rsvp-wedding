// Reset one guest's RSVP back to "sent" so verify runs can re-submit.
// Creates the guest if it doesn't exist (name derived from the token), so
// verify scripts survive manual guest-list cleanups in the dev dashboard.
//   npx tsx scripts/reset-rsvp.ts <token>
// Dev tooling only — refuses production, same guard as the seed.
import { randomUUID } from "node:crypto";
import { config } from "dotenv";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

config({ path: ".env.local" });
config();

if (
  process.env.VERCEL_ENV === "production" ||
  process.env.NODE_ENV === "production"
) {
  throw new Error("Refusing to reset guests in a production environment.");
}

const token = process.argv[2];
if (!token) {
  console.error("usage: npx tsx scripts/reset-rsvp.ts <token>");
  process.exit(1);
}

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  // "marco-vidal" -> "Marco Vidal"
  const name = token
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
  const clean = {
    status: "sent" as const,
    attending: null,
    mealId: null,
    dietary: "",
    note: "",
    respondedAt: null,
  };
  const existing = await prisma.guest.findUnique({ where: { token } });
  if (existing) {
    await prisma.guest.update({ where: { token }, data: clean });
    console.log(`reset ${token} to sent/unanswered`);
  } else {
    await prisma.guest.create({
      data: { id: randomUUID(), name, token, ...clean },
    });
    console.log(`created ${token} (${name}) as sent/unanswered`);
  }
  await prisma.$disconnect();
}

main();
