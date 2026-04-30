import {ReactNode} from "react";

import {EntityContainer} from "@/components/entity-components";

import TopicsSearch from "./topics-search";
import TopicHeader from "./topic-header";
import TopicPagination from "./topic-pagination";

interface TopicContainerProps {
  topicId: string;
  children: ReactNode;
}

const TopicContainer = ({topicId, children}: TopicContainerProps) => {
  return (
    <EntityContainer
      header={<TopicHeader />}
      search={<TopicsSearch placeholder="Search questions" />}
      pagination={<TopicPagination topicId={topicId} />}
    >
      {children}
    </EntityContainer>
  );
};

export default TopicContainer;
