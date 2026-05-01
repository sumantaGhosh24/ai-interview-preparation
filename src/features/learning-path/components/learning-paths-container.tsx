import { ReactNode } from "react";

import { EntityContainer } from "@/components/entity-components";

import LearningPathsHeader from "./learning-paths-header";
import LearningPathsPagination from "./learning-paths-pagination";

interface LearningPathsContainerProps {
  children: ReactNode;
}

const LearningPathsContainer = ({ children }: LearningPathsContainerProps) => {
  return (
    <EntityContainer header={<LearningPathsHeader />} pagination={<LearningPathsPagination />}>
      {children}
    </EntityContainer>
  );
};

export default LearningPathsContainer;
