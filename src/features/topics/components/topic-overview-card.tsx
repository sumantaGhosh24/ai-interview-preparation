"use client";

import {Target, Trophy, BarChart3, Activity} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {useSuspenseTopic} from "../hooks/use-topics";

interface TopicOverviewCardProps {
  topicId: string;
}

const TopicOverviewCard = ({topicId}: TopicOverviewCardProps) => {
  const {data: topic} = useSuspenseTopic(topicId);

  const performances = topic?.performance ?? [];

  const totalQuestions = topic?.questions?.totalCount ?? 0;

  const totalAttempts = performances.reduce(
    (sum, item) => sum + (item.attemptCount ?? 0),
    0,
  );

  const avgScore =
    performances.length > 0
      ? performances.reduce((sum, item) => sum + (item.avgScore ?? 0), 0) /
        performances.length
      : 0;

  const accuracy =
    performances.length > 0
      ? performances.reduce((sum, item) => sum + (item.accuracy ?? 0), 0) /
        performances.length
      : 0;

  const stats = [
    {
      title: "Total Questions",
      value: totalQuestions,
      icon: BarChart3,
    },
    {
      title: "Average Score",
      value: `${avgScore.toFixed(1)}`,
      icon: Trophy,
    },
    {
      title: "Accuracy",
      value: `${accuracy.toFixed(1)}%`,
      icon: Target,
    },
    {
      title: "Total Attempts",
      value: totalAttempts,
      icon: Activity,
    },
  ];

  return (
    <Card className="container mx-auto mb-10">
      <CardHeader className="border-b bg-muted/30">
        <CardTitle className="text-lg capitalize">{topic.name}</CardTitle>
        <CardDescription className="text-sm">
          {topic.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl border bg-card p-4 transition-all hover:shadow-sm"
              >
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{item.title}</p>
                  <div className="rounded-xl border bg-muted/40 p-2">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <p className="text-xl font-semibold tracking-tight">
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopicOverviewCard;
