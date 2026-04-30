import type {inferInput} from "@trpc/tanstack-react-query";

import {prefetch, trpc} from "@/trpc/server";

type Input = inferInput<typeof trpc.topics.getMany>;

type InputOne = inferInput<typeof trpc.topics.getOne>;

export const prefetchTopics = (params: Input) => {
  return prefetch(trpc.topics.getMany.queryOptions(params));
};

export const prefetchTopic = (params: InputOne) => {
  return prefetch(trpc.topics.getOne.queryOptions(params));
};
