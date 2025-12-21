/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Url` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[shortcode]` on the table `Url` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Url" DROP COLUMN "createdAt",
ADD COLUMN     "shortcode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Url_shortcode_key" ON "Url"("shortcode");
