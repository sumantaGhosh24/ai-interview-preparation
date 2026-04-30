import {NonRetriableError} from "inngest";

import prisma from "@/lib/db";
import {aiRateLimit} from "@/lib/redis";
import {generateAdaptiveQuestion} from "@/features/questions/ai/generate-questions";

import {inngest} from "../client";
import {questionGenerationChannel} from "../channels/question-channel";

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

    const channel = questionGenerationChannel({
      jobId,
    });

    await step.realtime.publish("started", channel.progress, {
      message: "Generating AI questions...",
      status: "RUNNING",
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

    await step.realtime.publish("completed", channel.progress, {
      message: "Questions generated successfully",
      status: "COMPLETED",
    });

    return {success: true};
  },
);
