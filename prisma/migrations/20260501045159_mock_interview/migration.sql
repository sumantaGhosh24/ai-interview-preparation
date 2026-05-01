-- AlterTable
ALTER TABLE "Answer" ADD COLUMN     "attemptSessionId" TEXT;

-- AlterTable
ALTER TABLE "AttemptSession" ADD COLUMN     "sessionSummary" JSONB;

-- CreateTable
CREATE TABLE "MockInterviewRound" (
    "id" TEXT NOT NULL,
    "communicationScore" DOUBLE PRECISION NOT NULL,
    "confidenceScore" DOUBLE PRECISION NOT NULL,
    "technicalDepthScore" DOUBLE PRECISION NOT NULL,
    "finalVerdict" TEXT NOT NULL,
    "attemptSessionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answerId" TEXT NOT NULL,

    CONSTRAINT "MockInterviewRound_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MockLearningPath" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "plan" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "attemptSessionId" TEXT NOT NULL,

    CONSTRAINT "MockLearningPath_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MockInterviewRound_answerId_key" ON "MockInterviewRound"("answerId");

-- CreateIndex
CREATE INDEX "MockInterviewRound_attemptSessionId_idx" ON "MockInterviewRound"("attemptSessionId");

-- CreateIndex
CREATE INDEX "MockInterviewRound_questionId_idx" ON "MockInterviewRound"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "MockLearningPath_attemptSessionId_key" ON "MockLearningPath"("attemptSessionId");

-- CreateIndex
CREATE INDEX "MockLearningPath_userId_idx" ON "MockLearningPath"("userId");

-- CreateIndex
CREATE INDEX "Answer_attemptSessionId_idx" ON "Answer"("attemptSessionId");

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_attemptSessionId_fkey" FOREIGN KEY ("attemptSessionId") REFERENCES "AttemptSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MockInterviewRound" ADD CONSTRAINT "MockInterviewRound_attemptSessionId_fkey" FOREIGN KEY ("attemptSessionId") REFERENCES "AttemptSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MockInterviewRound" ADD CONSTRAINT "MockInterviewRound_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MockInterviewRound" ADD CONSTRAINT "MockInterviewRound_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "Answer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MockLearningPath" ADD CONSTRAINT "MockLearningPath_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MockLearningPath" ADD CONSTRAINT "MockLearningPath_attemptSessionId_fkey" FOREIGN KEY ("attemptSessionId") REFERENCES "AttemptSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
