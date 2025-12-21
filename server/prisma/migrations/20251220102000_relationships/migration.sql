/*
  Warnings:

  - Added the required column `user_id` to the `Url` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Url" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Url" ADD CONSTRAINT "Url_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
