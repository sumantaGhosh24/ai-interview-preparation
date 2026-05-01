import {serve} from "inngest/next";

import {inngest} from "@/inngest/client";
import {generateQuestions} from "@/inngest/functions/generate-questions";
import {answerEvaluation} from "@/inngest/functions/answer-evaluation";
import {generateLearningPathJob} from "@/inngest/functions/generate-learning-path";

export const {GET, POST, PUT} = serve({
  client: inngest,
  functions: [generateQuestions, answerEvaluation, generateLearningPathJob],
});
