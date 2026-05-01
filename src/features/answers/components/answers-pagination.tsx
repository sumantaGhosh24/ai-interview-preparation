"use client";

import { useSuspenseAnswersHistory } from "../hooks/use-answers";

import { useGlobalParams } from "@/features/global/hooks/use-global-params";
import { EntityPagination } from "@/components/entity-components";

interface AnswersPaginationProps {
  questionId: string;
}

const AnswersPagination = ({ questionId }: AnswersPaginationProps) => {
  const answers = useSuspenseAnswersHistory(questionId);

  const [params, setParams] = useGlobalParams();

  return (
    <EntityPagination
      disabled={answers.isFetching}
      totalPages={answers.data.totalPages}
      page={answers.data.page}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

export default AnswersPagination;
