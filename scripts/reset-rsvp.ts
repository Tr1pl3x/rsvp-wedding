// Reset one guest's RSVP back to "sent" so verify runs can re-submit.
//   npx tsx scripts/reset-rsvp.ts <token>
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
  const result = await prisma.guest.updateMany({
    where: { token },
    data: {
      status: "sent",
      attending: null,
      mealId: null,
      dietary: "",
      note: "",
      respondedAt: null,
    },
  });
  console.log(
    result.count === 1 ? `reset ${token} to sent/unanswered` : `no guest with token ${token}`,
  );
  await prisma.$disconnect();
}

main();
