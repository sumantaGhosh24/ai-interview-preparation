import {NonRetriableError} from "inngest";

import {answerRateLimit} from "@/lib/redis";
import prisma from "@/lib/db";
import {generateAnswerEvaluation} from "@/features/answers/ai/generate-answer-evaluation";

import {inngest} from "../client";

export const answerEvaluation = inngest.createFunction(
  {id: "answer-evaluation", triggers: {event: "answer/submitted"}},
  async ({event, step}) => {
    const {answerId, userId} = event.data;

    if (!userId) throw new NonRetriableError("User ID is required");

    try {
      await step.run("mark-answer-running", async () => {
        return prisma.answer.update({
          where: {id: answerId},
          data: {
            status: "RUNNING",
            statusMessage: "Evaluating your answer...",
          },
        });
      });

      await step.run("rate-limit-check", async () => {
        const result = await answerRateLimit.limit(
          `answer-submitted:${userId}`,
        );
        if (!result.success) {
          throw new NonRetriableError("Rate limit exceeded");
        }
        return result;
      });

      const answer = await step.run("fetch-answer", async () => {
        return prisma.answer.findUnique({
          where: {id: answerId},
          include: {
            question: {
              include: {topic: true},
            },
            evaluation: true,
          },
        });
      });

      if (!answer) {
        throw new NonRetriableError("Answer not found.");
      }

      if (answer.evaluation) {
        await step.run("mark-answer-completed-existing", async () => {
          return prisma.answer.update({
            where: {id: answerId},
            data: {
              status: "COMPLETED",
              statusMessage: "Evaluation already exists",
            },
          });
        });

        return {
          success: true,
          skipped: true,
          message: "Evaluation already exists",
        };
      }

      const aiResult = await step.run("evaluate-answer", async () => {
        return generateAnswerEvaluation({
          topicName: answer.question.topic.name,
          question: answer.question.question,
          userAnswer: answer.content,
        });
      });

      await step.run("save-evaluation", async () => {
        await prisma.answerEvaluation.create({
          data: {
            answerId: answer.id,
            score: aiResult.score,
            modelAnswer: aiResult.modelAnswer,
            mistakes: {
              create: aiResult.mistakes.map((mistake) => ({
                content: mistake,
              })),
            },
            improvements: {
              create: aiResult.improvements.map((improvement) => ({
                content: improvement,
              })),
            },
          },
        });

        const topicId = answer.question.topic.id;
        const existing = await prisma.topicPerformance.findUnique({
          where: {
            userId_topicId: {
              userId: answer.userId,
              topicId,
            },
          },
        });

        if (!existing) {
          return prisma.topicPerformance.create({
            data: {
              userId: answer.userId,
              topicId,
              avgScore: aiResult.score,
              accuracy: aiResult.score >= 7 ? 100 : 50,
              attemptCount: 1,
            },
          });
        }

        const newAttemptCount = existing.attemptCount + 1;
        const newAvgScore =
          (existing.avgScore * existing.attemptCount + aiResult.score) /
          newAttemptCount;
        const successfulAttempts =
          (existing.accuracy / 100) * existing.attemptCount +
          (aiResult.score >= 7 ? 1 : 0);
        const newAccuracy = (successfulAttempts / newAttemptCount) * 100;

        return prisma.topicPerformance.update({
          where: {
            userId_topicId: {
              userId: answer.userId,
              topicId,
            },
          },
          data: {
            avgScore: Number(newAvgScore.toFixed(2)),
            accuracy: Number(newAccuracy.toFixed(2)),
            attemptCount: newAttemptCount,
          },
        });
      });

      await step.run("mark-answer-completed", async () => {
        return prisma.answer.update({
          where: {id: answerId},
          data: {
            status: "COMPLETED",
            statusMessage: "Answer evaluated successfully",
          },
        });
      });

      return {success: true};
    } catch (error) {
      await step.run("mark-answer-failed", async () => {
        return prisma.answer.update({
          where: {id: answerId},
          data: {
            status: "FAILED",
            statusMessage: "Failed to evaluate answer",
          },
        });
      });

      throw error;
    }
  },
);
