/*
  Warnings:

  - You are about to drop the column `question` on the `quizzes` table. All the data in the column will be lost.
  - You are about to drop the `quiz_options` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `title` to the `quizzes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "quiz_options" DROP CONSTRAINT "quiz_options_quizId_fkey";

-- AlterTable
ALTER TABLE "quizzes" DROP COLUMN "question",
ADD COLUMN     "title" TEXT NOT NULL;

-- DropTable
DROP TABLE "quiz_options";

-- CreateTable
CREATE TABLE "questions" (
    "id" SERIAL NOT NULL,
    "quizId" INTEGER NOT NULL,
    "questionText" TEXT NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "options" (
    "id" SERIAL NOT NULL,
    "questionId" INTEGER NOT NULL,
    "optionText" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "options_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "options" ADD CONSTRAINT "options_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
