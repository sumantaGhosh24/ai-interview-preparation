"use client";

import {EntityPagination} from "@/components/entity-components";

import {useSuspenseTopic} from "../hooks/use-topics";
import {useTopicsParams} from "../hooks/use-topics-params";

interface TopicPaginationProps {
  topicId: string;
}

const TopicPagination = ({topicId}: TopicPaginationProps) => {
  const topic = useSuspenseTopic(topicId);

  const [params, setParams] = useTopicsParams();

  return (
    <EntityPagination
      disabled={topic.isFetching}
      totalPages={topic.data.questions.totalPages}
      page={topic.data.questions.page}
      onPageChange={(page) => setParams({...params, page})}
    />
  );
};

export default TopicPagination;
