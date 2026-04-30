import {Suspense} from "react";
import {ErrorBoundary} from "react-error-boundary";

import {requireAuth} from "@/lib/auth-utils";
import {prefetchTopics} from "@/features/topics/server/prefetch";
import {topicsParamsLoader} from "@/features/topics/server/params-loader";
import {HydrateClient} from "@/trpc/server";
import TopicsList from "@/features/topics/components/topics-list";
import TopicsContainer from "@/features/topics/components/topics-container";
import {ErrorView, LoadingView} from "@/components/entity-components";

export const metadata = {
  title: "Topics",
};

const TopicsPage = async ({searchParams}: PageProps<"/topics">) => {
  await requireAuth();

  const params = await topicsParamsLoader(searchParams);

  prefetchTopics(params);

  return (
    <TopicsContainer>
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
            <TopicsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </TopicsContainer>
  );
};

export default TopicsPage;
