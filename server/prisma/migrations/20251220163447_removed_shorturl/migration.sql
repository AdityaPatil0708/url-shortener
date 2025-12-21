/*
  Warnings:

  - You are about to drop the column `short_url` on the `Url` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Url_short_url_key";

-- AlterTable
ALTER TABLE "Url" DROP COLUMN "short_url";
