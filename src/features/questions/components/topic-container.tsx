import {ReactNode} from "react";

import {EntityContainer, EntitySearch} from "@/components/entity-components";

import QuestionsHeader from "./questions-header";
import QuestionsPagination from "./questions-pagination";

interface QuestionsContainerProps {
  topicId: string;
  children: ReactNode;
}

const QuestionsContainer = ({topicId, children}: QuestionsContainerProps) => {
  return (
    <EntityContainer
      header={<QuestionsHeader topicId={topicId} />}
      search={<EntitySearch placeholder="Search questions" />}
      pagination={<QuestionsPagination topicId={topicId} />}
    >
      {children}
    </EntityContainer>
  );
};

export default QuestionsContainer;
