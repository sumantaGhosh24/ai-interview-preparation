import type { inferInput } from "@trpc/tanstack-react-query";

import { prefetch, trpc } from "@/trpc/server";

type Input = inferInput<typeof trpc.answers.getAnswersHistory>;

export const prefetchAnswersHistory = (params: Input) => {
  return prefetch(trpc.answers.getAnswersHistory.queryOptions(params));
};
