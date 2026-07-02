-- CreateEnum
CREATE TYPE "GuestStatus" AS ENUM ('not_sent', 'sent', 'responded');

-- CreateEnum
CREATE TYPE "Attending" AS ENUM ('yes', 'no');

-- CreateTable
CREATE TABLE "Guest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "maxGuests" INTEGER NOT NULL,
    "status" "GuestStatus" NOT NULL DEFAULT 'not_sent',
    "attending" "Attending",
    "mealId" TEXT,
    "dietary" TEXT NOT NULL DEFAULT '',
    "note" TEXT NOT NULL DEFAULT '',
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Guest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "messageTemplate" TEXT NOT NULL,
    "rsvpDeadline" TEXT NOT NULL,
    "defaultFilter" TEXT NOT NULL,
    "defaultSort" TEXT NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Guest_token_key" ON "Guest"("token");
