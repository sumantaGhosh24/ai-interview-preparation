import { ReactNode } from "react";

import { EntityContainer, EntitySearch } from "@/components/entity-components";

import AnswersHeader from "./answers-header";
import AnswersPagination from "./answers-pagination";

interface AnswersContainerProps {
  questionId: string;
  children: ReactNode;
}

const AnswersContainer = ({ questionId, children }: AnswersContainerProps) => {
  return (
    <EntityContainer
      header={<AnswersHeader />}
      search={<EntitySearch placeholder="Search questions" />}
      pagination={<AnswersPagination questionId={questionId} />}
    >
      {children}
    </EntityContainer>
  );
};

export default AnswersContainer;
