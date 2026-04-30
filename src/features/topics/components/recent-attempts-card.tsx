"use client";

import {formatDistanceToNow} from "date-fns";

import {EmptyView} from "@/components/entity-components";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {useSuspenseTopic} from "../hooks/use-topics";

interface RecentAttemptsCardProps {
  topicId: string;
}

const RecentAttemptsCard = ({topicId}: RecentAttemptsCardProps) => {
  const {data: topic} = useSuspenseTopic(topicId);

  return (
    <div className="container mx-auto">
      <h2 className="text-xl font-semibold mb-5">Recent Attempts</h2>
      <div className="space-y-4">
        {topic.recentAnswers.length === 0 ? (
          <EmptyView
            title="No attempts yet"
            description="Start solving your first question to get started"
          />
        ) : (
          topic.recentAnswers.map((answer) => (
            <Card key={answer.id}>
              <CardHeader>
                <CardTitle>{answer.question.question}</CardTitle>
                <CardDescription>{answer.content}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <span>Score: {answer.evaluation?.score ?? "Pending"}</span>
                <span>
                  {formatDistanceToNow(answer.createdAt, {addSuffix: true})}
                </span>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentAttemptsCard;
