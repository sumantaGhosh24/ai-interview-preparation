"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import { useSuspenseDashboard } from "../hooks/use-analytics";

const StatBox = ({
  label,
  value,
  description,
}: {
  label: string;
  value: React.ReactNode;
  description?: string;
}) => (
  <div className="space-y-1">
    <div className="text-sm text-muted-foreground">{label}</div>
    <div className="text-2xl font-bold">{value}</div>
    {description && <div className="text-xs text-muted-foreground">{description}</div>}
  </div>
);

const TopicPerf = ({
  topic,
  label,
  badgeColor,
}: {
  topic: {
    topicId: string;
    topicName: string;
    accuracy: number;
    avgScore: number;
  } | null;
  label: string;
  badgeColor: "default" | "secondary" | "destructive";
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center space-x-2 pb-2">
      <CardTitle className="text-base">{label}</CardTitle>
      <Badge variant={badgeColor} className="uppercase">
        {topic?.topicName ? topic.topicName : "N/A"}
      </Badge>
    </CardHeader>
    <CardContent className="pt-0 grid grid-cols-2 gap-2">
      <div>
        <div className="text-xs text-muted-foreground mb-1">Accuracy</div>
        <div className="font-semibold">
          {topic ? `${(topic.accuracy * 100).toFixed(1)}%` : "--"}
        </div>
      </div>
      <div>
        <div className="text-xs text-muted-foreground mb-1">Avg Score</div>
        <div className="font-semibold">{topic ? topic.avgScore.toFixed(2) : "--"}</div>
      </div>
    </CardContent>
  </Card>
);

const DashboardData = () => {
  const { data: dashboard } = useSuspenseDashboard();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex flex-col justify-center items-center">
            <StatBox
              label="Topics"
              value={dashboard.totalTopics}
              description="Topics you've created"
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col justify-center items-center">
            <StatBox
              label="Questions"
              value={dashboard.totalQuestions}
              description="Total questions across topics"
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col justify-center items-center">
            <StatBox
              label="Answers"
              value={dashboard.totalAnswers}
              description="Total attempts/answers"
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col justify-center items-center">
            <StatBox
              label="Attempts"
              value={dashboard.totalAttempts}
              description="Total question attempts"
            />
          </CardContent>
        </Card>
      </div>
      <Separator />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Average Performance</CardTitle>
            <CardDescription>Your average performance across all topics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <StatBox label="Avg. Score" value={dashboard.averageScore.toFixed(2)} />
            <StatBox
              label="Avg. Accuracy"
              value={`${(dashboard.averageAccuracy * 100).toFixed(1)}%`}
            />
            <StatBox
              label="Avg. Attempts per Topic"
              value={dashboard.averageAttemptsPerTopic.toFixed(2)}
            />
          </CardContent>
        </Card>
        <TopicPerf label="Best Topic" badgeColor="default" topic={dashboard.bestTopic} />
        <TopicPerf label="Weakest Topic" badgeColor="destructive" topic={dashboard.weakestTopic} />
      </div>
    </div>
  );
};

export default DashboardData;
