import prisma from "@/lib/db";
import {Difficulty} from "@/generated/prisma/enums";

export const getRecommendedDifficulty = async (
  userId: string,
  topicId: string,
): Promise<Difficulty> => {
  const performance = await prisma.topicPerformance.findUnique({
    where: {
      userId_topicId: {
        userId,
        topicId,
      },
    },
  });

  if (!performance) {
    return Difficulty.EASY;
  }

  if (performance.avgScore <= 3 || performance.accuracy <= 40) {
    return Difficulty.EASY;
  }

  if (performance.avgScore <= 6 || performance.accuracy <= 60) {
    return Difficulty.MEDIUM;
  }

  return Difficulty.HARD;
};

export const getPreviousWeaknesses = async (
  userId: string,
  topicId: string,
): Promise<string[]> => {
  const recentEvaluations = await prisma.answerEvaluation.findMany({
    where: {
      answer: {
        userId,
        question: {
          topicId,
        },
      },
    },
    include: {
      mistakes: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  const weaknessSet = new Set<string>();

  recentEvaluations.forEach((evaluation) => {
    evaluation.mistakes.forEach((mistake) => {
      weaknessSet.add(mistake.content);
    });
  });

  return Array.from(weaknessSet).slice(0, 5);
};

export const safeJson = (text: string) => {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
};
