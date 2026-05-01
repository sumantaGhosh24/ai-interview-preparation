import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { requireAuth } from "@/lib/auth-utils";
import { prefetchDashboard } from "@/features/analytics/server/prefetch";
import { HydrateClient } from "@/trpc/server";
import { ErrorView, LoadingView } from "@/components/entity-components";
import DashboardData from "@/features/analytics/components/dashboard-data";

export const metadata = {
  title: "Dashboard",
};

const DashboardPage = async () => {
  await requireAuth();

  prefetchDashboard();

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
          <DashboardData />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default DashboardPage;
