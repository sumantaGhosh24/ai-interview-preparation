import {realtime} from "inngest";
import {z} from "zod";

export const questionGenerationChannel = realtime.channel({
  name: ({jobId}: {jobId: string}) => `question-generation:${jobId}`,

  topics: {
    progress: {
      schema: z.object({
        message: z.string(),
        status: z.enum(["PENDING", "RUNNING", "COMPLETED", "FAILED"]),
      }),
    },
  },
});
