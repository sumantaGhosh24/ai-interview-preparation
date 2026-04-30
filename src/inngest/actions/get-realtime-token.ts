"use server";

import {getClientSubscriptionToken} from "inngest/react";

import {inngest} from "../client";
import {questionGenerationChannel} from "../channels/question-channel";

export async function getRealtimeQuestionGenerationToken(jobId: string) {
  return getClientSubscriptionToken(inngest, {
    channel: questionGenerationChannel({
      jobId,
    }),
    topics: ["progress"],
  });
}
