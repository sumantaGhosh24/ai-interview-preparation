-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "Answer" ADD COLUMN     "status" "JobStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "statusMessage" TEXT;

-- CreateTable
CREATE TABLE "QuestionGenerationJob" (
    "id" TEXT NOT NULL,
    "numberOfQuestions" INTEGER NOT NULL,
    "generatedCount" INTEGER,
    "status" "JobStatus" NOT NULL DEFAULT 'PENDING',
    "statusMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,

    CONSTRAINT "QuestionGenerationJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QuestionGenerationJob_userId_idx" ON "QuestionGenerationJob"("userId");

-- CreateIndex
CREATE INDEX "QuestionGenerationJob_topicId_idx" ON "QuestionGenerationJob"("topicId");

-- CreateIndex
CREATE INDEX "QuestionGenerationJob_status_idx" ON "QuestionGenerationJob"("status");

-- CreateIndex
CREATE INDEX "QuestionGenerationJob_createdAt_idx" ON "QuestionGenerationJob"("createdAt");

-- CreateIndex
CREATE INDEX "Answer_status_idx" ON "Answer"("status");

-- AddForeignKey
ALTER TABLE "QuestionGenerationJob" ADD CONSTRAINT "QuestionGenerationJob_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionGenerationJob" ADD CONSTRAINT "QuestionGenerationJob_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
