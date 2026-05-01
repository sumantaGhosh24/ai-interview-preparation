import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { requireAuth } from "@/lib/auth-utils";
import { prefetchTopic } from "@/features/topics/server/prefetch";
import { prefetchQuestionsByTopic } from "@/features/questions/server/prefetch";
import { prefetchLearningPathByTopicId } from "@/features/learning-path/server/prefetch";
import { globalParamsLoader } from "@/features/global/server/params-loader";
import { HydrateClient } from "@/trpc/server";
import { ErrorView, LoadingView } from "@/components/entity-components";
import QuestionsContainer from "@/features/questions/components/questions-container";
import TopicOverviewCard from "@/features/topics/components/topic-overview-card";
import RecentAnswersCard from "@/features/topics/components/recent-answers-card";
import QuestionsList from "@/features/questions/components/questions-list";
import LearningPath from "@/features/learning-path/components/learning-path";

export const metadata = {
  title: "Topic Details",
};

const TopicDetailsPage = async ({ params, searchParams }: PageProps<"/topics/[topicId]">) => {
  await requireAuth();

  const { topicId } = await params;

  const topicParams = await globalParamsLoader(searchParams);

  prefetchTopic(topicId);

  prefetchQuestionsByTopic({ ...topicParams, topicId });

  prefetchLearningPathByTopicId(topicId);

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
          <TopicOverviewCard topicId={topicId} />
          <QuestionsContainer topicId={topicId}>
            <QuestionsList topicId={topicId} />
          </QuestionsContainer>
          <LearningPath topicId={topicId} />
          <RecentAnswersCard topicId={topicId} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default TopicDetailsPage;
