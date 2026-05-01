import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { requireAuth } from "@/lib/auth-utils";
import { globalParamsLoader } from "@/features/global/server/params-loader";
import { prefetchQuestion } from "@/features/questions/server/prefetch";
import { prefetchAnswersHistory } from "@/features/answers/server/prefetch";
import { HydrateClient } from "@/trpc/server";
import { ErrorView, LoadingView } from "@/components/entity-components";
import AnswerEditor from "@/features/answers/components/answer-editor";
import AnswerHistory from "@/features/answers/components/answer-history";
import AnswersContainer from "@/features/answers/components/answers-container";

export const metadata = {
  title: "Answer Question",
};

const QuestionPage = async ({
  params,
  searchParams,
}: PageProps<"/topics/[topicId]/questions/[questionId]">) => {
  await requireAuth();

  const { questionId } = await params;

  const answerParams = await globalParamsLoader(searchParams);

  prefetchQuestion(questionId);

  prefetchAnswersHistory({ ...answerParams, questionId });

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
          <div className="space-y-8">
            <AnswerEditor questionId={questionId} />
            <AnswersContainer questionId={questionId}>
              <AnswerHistory questionId={questionId} />
            </AnswersContainer>
          </div>
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default QuestionPage;
