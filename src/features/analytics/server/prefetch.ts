import {prefetch, trpc} from "@/trpc/server";

export const prefetchWeakTopics = () => {
  return prefetch(trpc.analytics.getWeakTopics.queryOptions());
};

export const prefetchDashboard = () => {
  return prefetch(trpc.analytics.getDashboard.queryOptions());
};

export const prefetchRecentAnswers = () => {
  return prefetch(trpc.analytics.getRecentAnswers.queryOptions());
};

export const prefetchQuestionSourceStats = () => {
  return prefetch(trpc.analytics.getQuestionSourceStats.queryOptions());
};

export const prefetchAttemptyTrends = () => {
  return prefetch(trpc.analytics.getAttemptTrends.queryOptions());
};
