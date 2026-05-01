import type { inferInput } from "@trpc/tanstack-react-query";

import { prefetch, trpc } from "@/trpc/server";

type Input = inferInput<typeof trpc.learningPaths.getMany>;

export const prefetchLearningPaths = (params: Input) => {
  return prefetch(trpc.learningPaths.getMany.queryOptions(params));
};

export const prefetchLearningPathByTopicId = (topicId: string) => {
  return prefetch(trpc.learningPaths.getByTopicId.queryOptions({ topicId }));
};
