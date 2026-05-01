import { ReactNode } from "react";

import { EntityContainer, EntitySearch } from "@/components/entity-components";

import TopicsHeader from "./topics-header";
import TopicsPagination from "./topics-pagination";

interface TopicsContainerProps {
  children: ReactNode;
}

const TopicsContainer = ({ children }: TopicsContainerProps) => {
  return (
    <EntityContainer
      header={<TopicsHeader />}
      search={<EntitySearch placeholder="Search topics" />}
      pagination={<TopicsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export default TopicsContainer;
