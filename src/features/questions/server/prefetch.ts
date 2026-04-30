import type {inferInput} from "@trpc/tanstack-react-query";

import {prefetch, trpc} from "@/trpc/server";

type Input = inferInput<typeof trpc.questions.getByTopic>;

export const prefetchQuestionsByTopic = (params: Input) => {
  return prefetch(trpc.questions.getByTopic.queryOptions(params));
};
