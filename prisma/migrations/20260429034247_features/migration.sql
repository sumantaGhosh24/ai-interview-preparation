-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "AttemptMode" AS ENUM ('PRACTICE', 'MOCK');

-- CreateTable
CREATE TABLE "Topic" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "isAI" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "topicId" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnswerEvaluation" (
    "id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "modelAnswer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "answerId" TEXT NOT NULL,

    CONSTRAINT "AnswerEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvaluationMistake" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "evaluationId" TEXT NOT NULL,

    CONSTRAINT "EvaluationMistake_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvaluationImprovement" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "evaluationId" TEXT NOT NULL,

    CONSTRAINT "EvaluationImprovement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttemptSession" (
    "id" TEXT NOT NULL,
    "mode" "AttemptMode" NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "AttemptSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopicPerformance" (
    "id" TEXT NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "avgScore" DOUBLE PRECISION NOT NULL,
    "attemptCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,

    CONSTRAINT "TopicPerformance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Topic_userId_idx" ON "Topic"("userId");

-- CreateIndex
CREATE INDEX "Topic_createdAt_idx" ON "Topic"("createdAt");

-- CreateIndex
CREATE INDEX "Question_topicId_idx" ON "Question"("topicId");

-- CreateIndex
CREATE INDEX "Question_difficulty_idx" ON "Question"("difficulty");

-- CreateIndex
CREATE INDEX "Question_createdAt_idx" ON "Question"("createdAt");

-- CreateIndex
CREATE INDEX "Answer_userId_idx" ON "Answer"("userId");

-- CreateIndex
CREATE INDEX "Answer_questionId_idx" ON "Answer"("questionId");

-- CreateIndex
CREATE INDEX "Answer_createdAt_idx" ON "Answer"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AnswerEvaluation_answerId_key" ON "AnswerEvaluation"("answerId");

-- CreateIndex
CREATE INDEX "AnswerEvaluation_score_idx" ON "AnswerEvaluation"("score");

-- CreateIndex
CREATE INDEX "AnswerEvaluation_createdAt_idx" ON "AnswerEvaluation"("createdAt");

-- CreateIndex
CREATE INDEX "EvaluationMistake_evaluationId_idx" ON "EvaluationMistake"("evaluationId");

-- CreateIndex
CREATE INDEX "EvaluationImprovement_evaluationId_idx" ON "EvaluationImprovement"("evaluationId");

-- CreateIndex
CREATE INDEX "AttemptSession_userId_idx" ON "AttemptSession"("userId");

-- CreateIndex
CREATE INDEX "AttemptSession_mode_idx" ON "AttemptSession"("mode");

-- CreateIndex
CREATE INDEX "AttemptSession_startedAt_idx" ON "AttemptSession"("startedAt");

-- CreateIndex
CREATE INDEX "TopicPerformance_userId_idx" ON "TopicPerformance"("userId");

-- CreateIndex
CREATE INDEX "TopicPerformance_topicId_idx" ON "TopicPerformance"("topicId");

-- CreateIndex
CREATE INDEX "TopicPerformance_accuracy_idx" ON "TopicPerformance"("accuracy");

-- CreateIndex
CREATE INDEX "TopicPerformance_updatedAt_idx" ON "TopicPerformance"("updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "TopicPerformance_userId_topicId_key" ON "TopicPerformance"("userId", "topicId");

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnswerEvaluation" ADD CONSTRAINT "AnswerEvaluation_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "Answer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluationMistake" ADD CONSTRAINT "EvaluationMistake_evaluationId_fkey" FOREIGN KEY ("evaluationId") REFERENCES "AnswerEvaluation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluationImprovement" ADD CONSTRAINT "EvaluationImprovement_evaluationId_fkey" FOREIGN KEY ("evaluationId") REFERENCES "AnswerEvaluation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttemptSession" ADD CONSTRAINT "AttemptSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopicPerformance" ADD CONSTRAINT "TopicPerformance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopicPerformance" ADD CONSTRAINT "TopicPerformance_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
