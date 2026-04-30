import type {inferInput} from "@trpc/tanstack-react-query";

import {prefetch, trpc} from "@/trpc/server";

type Input = inferInput<typeof trpc.topics.getMany>;

export const prefetchTopics = (params: Input) => {
  return prefetch(trpc.topics.getMany.queryOptions(params));
};
