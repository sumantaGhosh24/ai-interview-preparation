import { generateText } from "ai";
import { z } from "zod";

import { BASE_SYSTEM_RULES, geminiModel } from "@/lib/ai";
import { safeJson, sanitizeAIInput } from "@/features/global/helpers/utils";

export const answerEvaluationSchema = z.object({
  score: z.number().min(0).max(10),
  mistakes: z.array(z.string().min(3)).min(1).max(10),
  improvements: z.array(z.string().min(3)).min(1).max(10),
  modelAnswer: z.string().min(20).max(5000),
});

export type AnswerEvaluationOutput = z.infer<typeof answerEvaluationSchema>;

export const generateAnswerEvaluation = async ({
  topicName,
  question,
  userAnswer,
}: {
  topicName: string;
  question: string;
  userAnswer: string;
}) => {
  const sanitizedAnswer = sanitizeAIInput(userAnswer);

  const { text } = await generateText({
    model: geminiModel,
    prompt: `
      ${BASE_SYSTEM_RULES}

      Task:
      Evaluate the candidate's answer for a technical interview question.

      Topic:
      ${topicName}

      Interview Question:
      ${question}

      Candidate Answer:
      ${sanitizedAnswer}

      Scoring Rules:

      - 0–3 = poor answer, major conceptual gaps
      - 4–6 = partial understanding, missing important depth
      - 7–8 = strong answer, mostly interview-ready
      - 9–10 = excellent senior-level answer

      Return ONLY structured output with:

      1. score (0–10)
      2. mistakes (specific mistakes only)
      3. improvements (clear actionable improvements)
      4. modelAnswer (ideal concise interview-quality answer)

      Important:

      - Do not praise unnecessarily
      - Do not be polite
      - Be direct and accurate
      - If answer is weak, say it clearly
    `,
  });

  const makeResponseSafe = safeJson(text);

  return answerEvaluationSchema.parse(JSON.parse(makeResponseSafe));
};
