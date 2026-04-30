import {EntityHeader} from "@/components/entity-components";

import CreateQuestionDialog from "./create-question-dialog";

interface QuestionsHeaderProps {
  topicId: string;
}

const QuestionsHeader = ({topicId}: QuestionsHeaderProps) => {
  return (
    <>
      <EntityHeader
        title="Questions"
        description="Create and manage your questions"
        create={<CreateQuestionDialog topicId={topicId} />}
      />
    </>
  );
};

export default QuestionsHeader;
