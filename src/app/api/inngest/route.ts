import {serve} from "inngest/next";

import {inngest} from "@/inngest/client";
import {generateQuestions} from "@/inngest/functions/generate-questions";

export const {GET, POST, PUT} = serve({
  client: inngest,
  functions: [generateQuestions],
});
