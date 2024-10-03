/*
  Warnings:

  - You are about to drop the column `contentId` on the `quizzes` table. All the data in the column will be lost.
  - Added the required column `courseId` to the `quizzes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "quizzes" DROP CONSTRAINT "quizzes_contentId_fkey";

-- AlterTable
ALTER TABLE "quizzes" DROP COLUMN "contentId",
ADD COLUMN     "courseId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
