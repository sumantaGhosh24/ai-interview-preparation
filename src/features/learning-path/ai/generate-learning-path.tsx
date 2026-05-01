import {generateText} from "ai";
import {z} from "zod";

import {safeJson} from "@/features/global/helpers/utils";
import {BASE_SYSTEM_RULES, geminiModel} from "@/lib/ai";

export const generateLearningPathSchema = z.object({
  title: z.string(),
  duration: z.string(),
  phases: z.array(
    z.object({
      title: z.string(),
      duration: z.string(),
      tasks: z.array(
        z.object({
          task: z.string(),
          resource: z.string().optional(),
        }),
      ),
    }),
  ),
  expectedOutcome: z.string(),
});

export type GenerateLearningPathOutput = z.infer<
  typeof generateLearningPathSchema
>;

export async function generateLearningPath({
  topicName,
  previousWeaknesses,
}: {
  topicName: string;
  previousWeaknesses?: string[];
}) {
  const {text} = await generateText({
    model: geminiModel,
    prompt: `
      ${BASE_SYSTEM_RULES}

      Task:
      Generate structured learning path based on previous weak areas and topic name.

      Topic:
      ${topicName}

      Candidate Weak Areas:
      ${previousWeaknesses?.length && previousWeaknesses.join(", ")}

      Rules:
      - Keep it realistic
      - Include phases (learning → practice → apply)
      - Add actionable tasks
      - Mention useful resources (optional)
      - Duration should be 2–4 weeks

      Return ONLY JSON:

      {
        "title": "learning path name",
        "duration": "learning path duration",
        "phases": [
          {
            "title": "phase title",
            "duration": "phase duration",
            "tasks": [
              { "task": "task name", "resource": "task resource" }
            ]
          }
        ],
        "expectedOutcome": ""
      }
      `,
  });

  const makeResponseSafe = safeJson(text);

  return generateLearningPathSchema.parse(JSON.parse(makeResponseSafe));
}
