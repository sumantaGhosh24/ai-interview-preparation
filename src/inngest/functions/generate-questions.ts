import {NonRetriableError} from "inngest";

import prisma from "@/lib/db";
import {aiRateLimit} from "@/lib/redis";
import {generateAdaptiveQuestion} from "@/features/questions/ai/generate-questions";

import {inngest} from "../client";

export const generateQuestions = inngest.createFunction(
  {id: "generate-question", triggers: {event: "question/generate"}},
  async ({event, step}) => {
    const {
      userId,
      topicId,
      topicName,
      difficulty,
      previousWeaknesses,
      numberOfQuestions,
      jobId,
    } = event.data;

    if (!userId) throw new NonRetriableError("User ID is required");

    try {
      await step.run("mark-job-running", async () => {
        return prisma.questionGenerationJob.update({
          where: {id: jobId},
          data: {
            status: "RUNNING",
            statusMessage: "Generating AI questions...",
          },
        });
      });

      await step.run("rate-limit-check", async () => {
        const result = await aiRateLimit.limit(`generate-question:${userId}`);

        if (!result.success) {
          throw new NonRetriableError("Rate limit exceeded");
        }

        return result;
      });

      const response = await step.run("generate", async () => {
        return await generateAdaptiveQuestion({
          topicName,
          difficulty,
          previousWeaknesses,
          numberOfQuestions,
        });
      });

      await step.run("save-questions", async () => {
        const questions = response.map((item) => ({
          topicId: topicId,
          question: item.question,
          difficulty: item.difficulty,
          isAI: true,
        }));

        return prisma.question.createMany({
          data: questions,
        });
      });

      await step.run("mark-job-completed", async () => {
        return prisma.questionGenerationJob.update({
          where: {id: jobId},
          data: {
            status: "COMPLETED",
            statusMessage: "Questions generated successfully",
            generatedCount: response.length,
          },
        });
      });

      return {success: true};
    } catch (error) {
      await step.run("mark-job-failed", async () => {
        return prisma.questionGenerationJob.update({
          where: {id: jobId},
          data: {
            status: "FAILED",
            statusMessage: "Failed to generate questions",
          },
        });
      });

      throw error;
    }
  },
);
