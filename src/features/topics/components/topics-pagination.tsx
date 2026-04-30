"use client";

import {EntityPagination} from "@/components/entity-components";

import {useSuspenseTopics} from "../hooks/use-topics";
import {useTopicsParams} from "../hooks/use-topics-params";

const TopicsPagination = () => {
  const topics = useSuspenseTopics();

  const [params, setParams] = useTopicsParams();

  return (
    <EntityPagination
      disabled={topics.isFetching}
      totalPages={topics.data.totalPages}
      page={topics.data.page}
      onPageChange={(page) => setParams({...params, page})}
    />
  );
};

export default TopicsPagination;
