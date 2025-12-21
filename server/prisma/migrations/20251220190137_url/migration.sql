/*
  Warnings:

  - You are about to drop the column `original_url` on the `Url` table. All the data in the column will be lost.
  - Added the required column `url` to the `Url` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Url_original_url_key";

-- AlterTable
ALTER TABLE "Url" DROP COLUMN "original_url",
ADD COLUMN     "url" TEXT NOT NULL;
