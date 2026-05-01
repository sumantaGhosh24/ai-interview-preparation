import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { requireAuth } from "@/lib/auth-utils";
import { prefetchLearningPaths } from "@/features/learning-path/server/prefetch";
import { globalParamsLoader } from "@/features/global/server/params-loader";
import { HydrateClient } from "@/trpc/server";
import { ErrorView, LoadingView } from "@/components/entity-components";
import LearningPathsContainer from "@/features/learning-path/components/learning-paths-container";
import LearningPathsList from "@/features/learning-path/components/learning-paths-list";

export const metadata = {
  title: "Learning Path",
};

const LearningPathPage = async ({ searchParams }: PageProps<"/learning-path">) => {
  await requireAuth();

  const params = await globalParamsLoader(searchParams);

  prefetchLearningPaths(params);

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
          <LearningPathsContainer>
            <LearningPathsList />
          </LearningPathsContainer>
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default LearningPathPage;
