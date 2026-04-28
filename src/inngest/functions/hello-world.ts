import {createGoogleGenerativeAI} from "@ai-sdk/google";
import {generateText} from "ai";

import {inngest} from "../client";

const google = createGoogleGenerativeAI();

export const helloWorld = inngest.createFunction(
  {id: "hello-world", triggers: {event: "test/hello.world"}},
  async ({event, step}) => {
    await step.sleep("process", "10s");

    await step.sleep("parse", "10s");

    const {steps: geminiSteps} = await step.ai.wrap(
      "gemini-generate-text",
      generateText,
      {
        model: google("gemini-2.5-flash"),
        system: "You are a helpful assistant.",
        prompt: "What is 2 + 2?",
      },
    );

    return {geminiSteps};
  },
);
