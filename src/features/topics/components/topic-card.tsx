"use client";

import Link from "next/link";
import { BookOpenIcon, EyeIcon, TrashIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Topic } from "@/generated/prisma/client";

import { useRemoveTopic } from "../hooks/use-topics";
import UpdateTopicDialog from "./update-topic-dialog";

interface TopicCardProps {
  topic: Topic;
}

const TopicCard = ({ topic }: TopicCardProps) => {
  const removeTopic = useRemoveTopic();

  const handleRemove = () => {
    if (removeTopic.isPending) {
      return;
    }

    removeTopic.mutate({
      id: topic.id,
    });
  };

  return (
    <Card
      className={cn(
        "p-4 shadow-none hover:shadow transition-all",
        removeTopic.isPending && "opacity-50 cursor-not-allowed",
      )}
    >
      <CardContent className="flex flex-row items-center justify-between gap-3 p-0">
        <div className="flex items-center gap-3 w-full">
          <BookOpenIcon />
          <div className="w-full">
            <CardTitle className="text-base font-medium capitalize">{topic.name}</CardTitle>
            {topic.description && (
              <CardDescription className="text-xs">{topic.description}</CardDescription>
            )}
          </div>
        </div>
        <div className="flex gap-3 items-center flex-wrap md:flex-nowrap">
          <Button size="icon" asChild>
            <Link href={`/topics/${topic.id}`}>
              <EyeIcon className="size-4" />
            </Link>
          </Button>
          <UpdateTopicDialog
            id={topic.id}
            name={topic.name}
            description={topic.description as string}
          />
          <Button size="icon" variant="destructive" onClick={handleRemove}>
            <TrashIcon className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopicCard;
