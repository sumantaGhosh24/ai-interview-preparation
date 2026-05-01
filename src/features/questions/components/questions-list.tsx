"use client";

import { EmptyView, EntityList } from "@/components/entity-components";

import { useSuspenseQuestionsByTopic } from "../hooks/use-questions";
import QuestionCard from "../../topics/components/question-card";

interface QuestionsListProps {
  topicId: string;
}

const QuestionsList = ({ topicId }: QuestionsListProps) => {
  const { data: questions } = useSuspenseQuestionsByTopic(topicId);

  return (
    <>
      <EntityList
        items={questions.items}
        getKey={(question) => question.id}
        renderItem={(question) => <QuestionCard question={question} />}
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

export default QuestionsList;
