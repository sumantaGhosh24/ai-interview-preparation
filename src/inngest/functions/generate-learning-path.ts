import {NonRetriableError} from "inngest";

import prisma from "@/lib/db";
import {learningPathRateLimit} from "@/lib/redis";
import {generateLearningPath} from "@/features/learning-path/ai/generate-learning-path";

import {inngest} from "../client";

export const generateLearningPathJob = inngest.createFunction(
  {id: "generate-learning-path", triggers: {event: "learning-path/generate"}},
  async ({event, step}) => {
    const {userId, topicId, topicName, previousWeaknesses} = event.data;

    if (!userId) throw new NonRetriableError("User ID is required");

    try {
      await step.run("rate-limit-check", async () => {
        const result = await learningPathRateLimit.limit(
          `learning-path:${userId}`,
        );

        if (!result.success) {
          throw new NonRetriableError("Rate limit exceeded");
        }

        return result;
      });

      const response = await step.run("generate", async () => {
        return await generateLearningPath({
          topicName,
          previousWeaknesses,
        });
      });

      await step.run("save-learning-path", async () => {
        const newLearningPath = await prisma.learningPath.create({
          data: {
            topicId,
            userId,
            title: response.title,
            duration: response.duration,
          },
        });

        for (const phase of response.phases || []) {
          const createdPhase = await prisma.learningPathPhase.create({
            data: {
              learningPathId: newLearningPath.id,
              title: phase.title,
              duration: phase.duration,
            },
          });

          for (const task of phase.tasks || []) {
            await prisma.learningPathTask.create({
              data: {
                phaseId: createdPhase.id,
                task: task.task,
                resource: task.resource ?? null,
              },
            });
          }
        }
      });
    } catch (error) {
      throw error;
    }
  },
);
