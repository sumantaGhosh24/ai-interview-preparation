import { generateText } from "ai";
import { z } from "zod";

import { BASE_SYSTEM_RULES, geminiModel } from "@/lib/ai";
import { Difficulty } from "@/generated/prisma/enums";
import { safeJson } from "@/features/global/helpers/utils";

export const generatedQuestionSchema = z.array(
  z.object({
    question: z.string().min(15).max(2000),
    difficulty: z.enum(Difficulty),
  }),
);

export type GeneratedQuestionOutput = z.infer<typeof generatedQuestionSchema>;

export const generateAdaptiveQuestion = async ({
  topicName,
  difficulty,
  previousWeaknesses,
  numberOfQuestions = 1,
}: {
  topicName: string;
  difficulty: Difficulty;
  previousWeaknesses?: string[];
  numberOfQuestions?: number;
}) => {
  const { text } = await generateText({
    model: geminiModel,
    prompt: `
        ${BASE_SYSTEM_RULES}

        Task:
        Generate ${numberOfQuestions} strong software engineering interview questions.

        Topic:
        ${topicName}

        Difficulty:
        ${difficulty}

        ${previousWeaknesses?.length ? `Candidate Weak Areas: ${previousWeaknesses.join(", ")}` : ""}

        Requirements:

        - Questions must be realistic for actual interviews
        - Must test understanding, not memorization
        - Should be concise but deep
        - Should match the requested difficulty
        - Avoid trivia questions
        - Prefer scenario-based reasoning when possible

        Difficulty Rules:

        EASY:
        - fundamentals
        - definitions
        - beginner practical concepts

        MEDIUM:
        - applied understanding
        - tradeoffs
        - architecture reasoning

        HARD:
        - system design thinking
        - optimization decisions
        - senior-level edge cases

        Return ONLY:

        [
            {
                question,
                difficulty,
            }
        ]
    `,
  });

  const makeResponseSafe = safeJson(text);

  return generatedQuestionSchema.parse(JSON.parse(makeResponseSafe));
};
