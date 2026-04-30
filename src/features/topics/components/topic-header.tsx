import {EntityHeader} from "@/components/entity-components";

import {Button} from "@/components/ui/button";

const TopicHeader = () => {
  return (
    <>
      <EntityHeader
        title="Questions"
        description="Create and manage your questions"
        create={<Button>Create Question</Button>}
      />
    </>
  );
};

export default TopicHeader;
