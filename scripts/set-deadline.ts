// Read or set the RSVP deadline in the dev DB (settings row).
//   npx tsx scripts/set-deadline.ts             -> prints current value
//   npx tsx scripts/set-deadline.ts 2026-08-30  -> sets it
// Dev tooling only — refuses production, same guard as the seed.
import { config } from "dotenv";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

config({ path: ".env.local" });
config();

if (
  process.env.VERCEL_ENV === "production" ||
  process.env.NODE_ENV === "production"
) {
  throw new Error("Refusing to touch settings in a production environment.");
}

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const value = process.argv[2];
  if (!value) {
    const row = await prisma.settings.findUnique({ where: { id: 1 } });
    console.log(row?.rsvpDeadline ?? "");
  } else {
    await prisma.settings.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        messageTemplate: "",
        rsvpDeadline: value,
        defaultFilter: "everyone",
        defaultSort: "newest",
      },
      update: { rsvpDeadline: value },
    });
    console.log(`deadline set to ${value}`);
  }
  await prisma.$disconnect();
}

main();
