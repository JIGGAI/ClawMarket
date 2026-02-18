/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Submission` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Submission" ADD COLUMN "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Submission_slug_key" ON "Submission"("slug");
