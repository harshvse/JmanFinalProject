/*
  Warnings:

  - A unique constraint covering the columns `[userId,courseContentId]` on the table `engagement` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "engagement_userId_courseContentId_key" ON "engagement"("userId", "courseContentId");
