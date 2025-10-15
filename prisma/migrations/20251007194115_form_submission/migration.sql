/*
  Warnings:

  - You are about to drop the column `updateUt` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."User_password_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "updateUt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Form" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "agentPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "userPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "content" TEXT NOT NULL DEFAULT '[]',
    "visits" INTEGER NOT NULL DEFAULT 0,
    "submissions" INTEGER NOT NULL DEFAULT 0,
    "paymentCount" INTEGER NOT NULL DEFAULT 0,
    "amountGenerated" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "shareURL" TEXT NOT NULL,

    CONSTRAINT "Form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormSubmission" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "formId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "FormSubmission_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormSubmission" ADD CONSTRAINT "FormSubmission_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
