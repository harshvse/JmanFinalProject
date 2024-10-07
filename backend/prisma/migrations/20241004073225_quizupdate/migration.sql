/*
  Warnings:

  - You are about to drop the column `selectedAnswer` on the `quiz_results` table. All the data in the column will be lost.
  - You are about to drop the column `correctAnswer` on the `quizzes` table. All the data in the column will be lost.
  - Added the required column `selectedOption` to the `quiz_results` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "quiz_results" DROP COLUMN "selectedAnswer",
ADD COLUMN     "selectedOption" INTEGER NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "quizzes" DROP COLUMN "correctAnswer",
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3);

-- CreateTable
CREATE TABLE "quiz_options" (
    "id" SERIAL NOT NULL,
    "quizId" INTEGER NOT NULL,
    "optionText" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "quiz_options_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "quiz_options" ADD CONSTRAINT "quiz_options_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
