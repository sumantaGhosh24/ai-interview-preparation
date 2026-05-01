import {serve} from "inngest/next";

import {inngest} from "@/inngest/client";
import {generateQuestions} from "@/inngest/functions/generate-questions";
import {answerEvaluation} from "@/inngest/functions/answer-evaluation";

export const {GET, POST, PUT} = serve({
  client: inngest,
  functions: [generateQuestions, answerEvaluation],
});
