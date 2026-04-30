"use client";

import {EmptyView, EntityList} from "@/components/entity-components";

import {useSuspenseTopic} from "../hooks/use-topics";
import TopicQuestionCard from "./topic-question-card";

interface TopicQuestionsListProps {
  topicId: string;
}

const TopicQuestionsList = ({topicId}: TopicQuestionsListProps) => {
  const {data: topic} = useSuspenseTopic(topicId);

  return (
    <>
      <EntityList
        items={topic.questions.items}
        getKey={(question) => question.id}
        renderItem={(question) => <TopicQuestionCard question={question} />}
        emptyView={
          <EmptyView
            title="No Question Found"
            description="Currently you don't have any questions"
          />
        }
      />
    </>
  );
};

export default TopicQuestionsList;
