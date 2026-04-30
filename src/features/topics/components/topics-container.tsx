import {ReactNode} from "react";

import {EntityContainer} from "@/components/entity-components";

import TopicsHeader from "./topics-header";
import TopicsSearch from "./topics-search";
import TopicsPagination from "./topics-pagination";

interface TopicsContainerProps {
  children: ReactNode;
}

const TopicsContainer = ({children}: TopicsContainerProps) => {
  return (
    <EntityContainer
      header={<TopicsHeader />}
      search={<TopicsSearch placeholder="Search topics" />}
      pagination={<TopicsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export default TopicsContainer;
