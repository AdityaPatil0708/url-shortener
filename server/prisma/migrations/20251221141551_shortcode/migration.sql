/*
  Warnings:

  - Made the column `shortcode` on table `Url` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Url" ALTER COLUMN "shortcode" SET NOT NULL;
