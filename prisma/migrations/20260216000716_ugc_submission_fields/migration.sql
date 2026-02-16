/*
  Warnings:

  - You are about to drop the column `notes` on the `Submission` table. All the data in the column will be lost.
  - Added the required column `authorDisplayName` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactEmail` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Submission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdBy" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'submitted',
    "sourceType" TEXT NOT NULL DEFAULT 'url',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tagsCsv" TEXT NOT NULL DEFAULT '',
    "authorDisplayName" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "license" TEXT,
    "sourceUrl" TEXT,
    "zipUrl" TEXT,
    "uploadPath" TEXT,
    "uploadSize" INTEGER,
    "uploadSha256" TEXT,
    "submitIp" TEXT,
    "submitUserAgent" TEXT,
    "moderatedAt" DATETIME,
    "moderatedByUserId" TEXT,
    "moderationReason" TEXT,
    "publishedAt" DATETIME,
    "publishedByUserId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Submission_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Submission" ("createdAt", "createdBy", "id", "sourceUrl", "status", "title", "updatedAt") SELECT "createdAt", "createdBy", "id", "sourceUrl", "status", "title", "updatedAt" FROM "Submission";
DROP TABLE "Submission";
ALTER TABLE "new_Submission" RENAME TO "Submission";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
