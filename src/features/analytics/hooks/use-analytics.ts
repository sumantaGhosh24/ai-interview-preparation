import {useSuspenseQuery} from "@tanstack/react-query";

import {useTRPC} from "@/trpc/client";

export const useSuspenseWeakTopics = () => {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.analytics.getWeakTopics.queryOptions());
};

export const useSuspenseDashboard = () => {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.analytics.getDashboard.queryOptions());
};

export const useSuspenseRecentAnswers = () => {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.analytics.getRecentAnswers.queryOptions());
};

export const useSuspenseQuestionSourceStats = () => {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.analytics.getQuestionSourceStats.queryOptions());
};

export const useSuspenseAttemptTrends = () => {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.analytics.getAttemptTrends.queryOptions());
};
