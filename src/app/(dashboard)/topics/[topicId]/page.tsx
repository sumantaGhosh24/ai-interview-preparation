import {Suspense} from "react";
import {ErrorBoundary} from "react-error-boundary";

import {requireAuth} from "@/lib/auth-utils";
import {prefetchTopic} from "@/features/topics/server/prefetch";
import {topicsParamsLoader} from "@/features/topics/server/params-loader";
import {HydrateClient} from "@/trpc/server";
import {ErrorView, LoadingView} from "@/components/entity-components";
import TopicContainer from "@/features/topics/components/topic-container";
import TopicOverviewCard from "@/features/topics/components/topic-overview-card";
import RecentAttemptsCard from "@/features/topics/components/recent-attempts-card";
import TopicQuestionsList from "@/features/topics/components/topic-questions-list";

export const metadata = {
  title: "Topic Details",
};

const TopicDetailsPage = async ({
  params,
  searchParams,
}: PageProps<"/topics/[topicId]">) => {
  await requireAuth();

  const {topicId} = await params;

  const topicParams = await topicsParamsLoader(searchParams);

  prefetchTopic({id: topicId, ...topicParams});

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
          <TopicContainer topicId={topicId}>
            <TopicQuestionsList topicId={topicId} />
          </TopicContainer>
          <RecentAttemptsCard topicId={topicId} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default TopicDetailsPage;
