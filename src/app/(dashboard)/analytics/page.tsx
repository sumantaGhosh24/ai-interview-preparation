import {Suspense} from "react";
import {ErrorBoundary} from "react-error-boundary";

import {requireAuth} from "@/lib/auth-utils";
import {
  prefetchAttemptyTrends,
  prefetchQuestionSourceStats,
  prefetchRecentAnswers,
  prefetchWeakTopics,
} from "@/features/analytics/server/prefetch";
import {HydrateClient} from "@/trpc/server";
import {ErrorView, LoadingView} from "@/components/entity-components";
import WeakTopics from "@/features/analytics/components/weak-topics";
import RecentAnswers from "@/features/analytics/components/recent-answers";
import QuestionSourceStats from "@/features/analytics/components/question-source-stats";
import AttemptTrends from "@/features/analytics/components/attempt-trends";

export const metadata = {
  title: "Analytics",
};

const AnalyticsPage = async () => {
  await requireAuth();

  prefetchWeakTopics();

  prefetchRecentAnswers();

  prefetchQuestionSourceStats();

  prefetchAttemptyTrends();

  return (
    <HydrateClient>
      <ErrorBoundary
        fallback={
          <ErrorView
            title="Something went wrong"
            description="Try again later"
            buttonText="Go Home"
            redirectUrl="/"
          />
        }
      >
        <Suspense fallback={<LoadingView />}>
          <WeakTopics />
          <RecentAnswers />
          <QuestionSourceStats />
          <AttemptTrends />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default AnalyticsPage;
