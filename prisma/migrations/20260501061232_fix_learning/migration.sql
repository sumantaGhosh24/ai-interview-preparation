/*
  Warnings:

  - A unique constraint covering the columns `[topicId]` on the table `LearningPath` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `topicId` to the `LearningPath` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LearningPath" ADD COLUMN     "topicId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "LearningPath_topicId_key" ON "LearningPath"("topicId");

-- AddForeignKey
ALTER TABLE "LearningPath" ADD CONSTRAINT "LearningPath_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
