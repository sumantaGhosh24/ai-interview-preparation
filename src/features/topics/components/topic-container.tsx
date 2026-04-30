import {ReactNode} from "react";

import {EntityContainer} from "@/components/entity-components";

import TopicsHeader from "./topic-header";
import TopicsSearch from "./topics-search";
import TopicsPagination from "./topics-pagination";

interface TopicsContainerProps {
  children: ReactNode;
}

const TopicsContainer = ({children}: TopicsContainerProps) => {
  return (
    <EntityContainer
      header={<TopicsHeader />}
      search={<TopicsSearch />}
      pagination={<TopicsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export default TopicsContainer;
