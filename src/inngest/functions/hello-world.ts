import {createGoogleGenerativeAI} from "@ai-sdk/google";
import {generateText} from "ai";
import {Ratelimit} from "@upstash/ratelimit";
import {Redis} from "@upstash/redis";
import {NonRetriableError} from "inngest";

import {inngest} from "../client";

const google = createGoogleGenerativeAI();

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "20 s"),
  analytics: true,
});

export const helloWorld = inngest.createFunction(
  {id: "hello-world", triggers: {event: "test/hello.world"}},
  async ({event, step}) => {
    const userId = event.data.userId;
    if (!userId) throw new NonRetriableError("User ID is required");

    await step.run("rate-limit-check", async () => {
      const result = await ratelimit.limit(`ai-feedback:${userId}`);

      if (!result.success) {
        throw new NonRetriableError("Rate limit exceeded");
      }

      return result;
    });

    await step.sleep("process", "10s");

    await step.sleep("parse", "10s");

    const {steps: geminiSteps} = await step.ai.wrap(
      "gemini-generate-text",
      generateText,
      {
        model: google("gemini-2.5-flash"),
        system: "You are a helpful assistant.",
        prompt: "What is 2 + 2?",
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      },
    );

    return {geminiSteps};
  },
);
