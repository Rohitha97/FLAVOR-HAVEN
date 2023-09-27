-- AlterTable
ALTER TABLE "Nortification" ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Contacts" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "Contacts_pkey" PRIMARY KEY ("id")
);
