"use client";

import {EmptyView, EntityList} from "@/components/entity-components";

import {useSuspenseLearningPaths} from "../hooks/use-learning-path";
import LearningPathCard from "./learning-path-card";

const LearningPathsList = () => {
  const {data: learningPaths} = useSuspenseLearningPaths();

  return (
    <>
      <EntityList
        items={learningPaths.items}
        getKey={(learningPath) => learningPath.id}
        renderItem={(learningPath) => (
          <LearningPathCard learningPath={learningPath} />
        )}
        emptyView={
          <EmptyView
            title="No Learning Path Found"
            description="Currently you don't have any learning paths"
          />
        }
      />
    </>
  );
};

export default LearningPathsList;
