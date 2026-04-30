"use client";

import {EntityPagination} from "@/components/entity-components";

import {useSuspenseQuestionsByTopic} from "../hooks/use-questions";
import {useGlobalParams} from "@/features/global/hooks/use-global-params";

interface QuestionsPaginationProps {
  topicId: string;
}

const QuestionsPagination = ({topicId}: QuestionsPaginationProps) => {
  const questions = useSuspenseQuestionsByTopic(topicId);

  const [params, setParams] = useGlobalParams();

  return (
    <EntityPagination
      disabled={questions.isFetching}
      totalPages={questions.data.totalPages}
      page={questions.data.page}
      onPageChange={(page) => setParams({...params, page})}
    />
  );
};

export default QuestionsPagination;
