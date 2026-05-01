"use client";

import { useGlobalParams } from "@/features/global/hooks/use-global-params";
import { EntityPagination } from "@/components/entity-components";

import { useSuspenseLearningPaths } from "../hooks/use-learning-path";

const LearningPathsPagination = () => {
  const learningPaths = useSuspenseLearningPaths();

  const [params, setParams] = useGlobalParams();

  return (
    <EntityPagination
      disabled={learningPaths.isFetching}
      totalPages={learningPaths.data.totalPages}
      page={learningPaths.data.page}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

export default LearningPathsPagination;
