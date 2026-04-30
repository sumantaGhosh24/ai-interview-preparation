import {EntityHeader} from "@/components/entity-components";

import CreateTopicDialog from "./create-topic-dialog";

const TopicsHeader = () => {
  return (
    <>
      <EntityHeader
        title="Topics"
        description="Create and manage your topics"
        create={<CreateTopicDialog />}
      />
    </>
  );
};

export default TopicsHeader;
