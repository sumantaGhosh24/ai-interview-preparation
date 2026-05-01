"use client";

import { useGlobalParams } from "@/features/global/hooks/use-global-params";
import { EntityPagination } from "@/components/entity-components";

import { useSuspenseTopics } from "../hooks/use-topics";

const TopicsPagination = () => {
  const topics = useSuspenseTopics();

  const [params, setParams] = useGlobalParams();

  return (
    <EntityPagination
      disabled={topics.isFetching}
      totalPages={topics.data.totalPages}
      page={topics.data.page}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

export default TopicsPagination;
