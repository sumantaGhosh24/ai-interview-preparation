/*
  Warnings:

  - You are about to drop the column `attemptSessionId` on the `Answer` table. All the data in the column will be lost.
  - You are about to drop the `AttemptSession` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MockInterviewRound` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MockLearningPath` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_attemptSessionId_fkey";

-- DropForeignKey
ALTER TABLE "AttemptSession" DROP CONSTRAINT "AttemptSession_userId_fkey";

-- DropForeignKey
ALTER TABLE "MockInterviewRound" DROP CONSTRAINT "MockInterviewRound_answerId_fkey";

-- DropForeignKey
ALTER TABLE "MockInterviewRound" DROP CONSTRAINT "MockInterviewRound_attemptSessionId_fkey";

-- DropForeignKey
ALTER TABLE "MockInterviewRound" DROP CONSTRAINT "MockInterviewRound_questionId_fkey";

-- DropForeignKey
ALTER TABLE "MockLearningPath" DROP CONSTRAINT "MockLearningPath_attemptSessionId_fkey";

-- DropForeignKey
ALTER TABLE "MockLearningPath" DROP CONSTRAINT "MockLearningPath_userId_fkey";

-- DropIndex
DROP INDEX "Answer_attemptSessionId_idx";

-- AlterTable
ALTER TABLE "Answer" DROP COLUMN "attemptSessionId";

-- DropTable
DROP TABLE "AttemptSession";

-- DropTable
DROP TABLE "MockInterviewRound";

-- DropTable
DROP TABLE "MockLearningPath";

-- DropEnum
DROP TYPE "AttemptMode";

-- CreateTable
CREATE TABLE "LearningPath" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "LearningPath_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningPathPhase" (
    "id" TEXT NOT NULL,
    "learningPathId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "duration" TEXT NOT NULL,

    CONSTRAINT "LearningPathPhase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningPathTask" (
    "id" TEXT NOT NULL,
    "phaseId" TEXT NOT NULL,
    "task" TEXT NOT NULL,
    "resource" TEXT,

    CONSTRAINT "LearningPathTask_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LearningPath_userId_idx" ON "LearningPath"("userId");

-- CreateIndex
CREATE INDEX "LearningPath_createdAt_idx" ON "LearningPath"("createdAt");

-- AddForeignKey
ALTER TABLE "LearningPath" ADD CONSTRAINT "LearningPath_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningPathPhase" ADD CONSTRAINT "LearningPathPhase_learningPathId_fkey" FOREIGN KEY ("learningPathId") REFERENCES "LearningPath"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningPathTask" ADD CONSTRAINT "LearningPathTask_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "LearningPathPhase"("id") ON DELETE CASCADE ON UPDATE CASCADE;
