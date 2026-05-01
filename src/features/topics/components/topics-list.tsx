"use client";

import { EmptyView, EntityList } from "@/components/entity-components";

import { useSuspenseTopics } from "../hooks/use-topics";
import TopicCard from "./topic-card";

const TopicsList = () => {
  const topics = useSuspenseTopics();

  return (
    <EntityList
      items={topics.data.items}
      getKey={(topic) => topic.id}
      renderItem={(topic) => <TopicCard topic={topic} />}
      emptyView={
        <EmptyView title="No Topic Found" description="Currently you don't have any topics" />
      }
    />
  );
};

export default TopicsList;
