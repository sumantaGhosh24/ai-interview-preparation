"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

import { useSuspenseQuestionSourceStats } from "../hooks/use-analytics";

const QuestionSourceStats = () => {
  const { data: stats } = useSuspenseQuestionSourceStats();

  const aiQuestions = stats?.aiQuestions ?? 0;
  const manualQuestions = stats?.manualQuestions ?? 0;
  const total = aiQuestions + manualQuestions;

  const aiPercent = total > 0 ? Math.round((aiQuestions / total) * 100) : 0;
  const manualPercent = total > 0 ? Math.round((manualQuestions / total) * 100) : 0;

  return (
    <Card className="mb-5">
      <CardHeader>
        <CardTitle>Question Source Stats</CardTitle>
        <CardDescription>
          Breakdown of your questions by source (AI-generated vs. manual)
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1 flex flex-col justify-center items-center space-y-2">
            <div className="flex gap-3 items-center">
              <Badge variant="default">AI-Generated</Badge>
              <span className="text-2xl font-semibold">{aiQuestions}</span>
              <span className="text-muted-foreground text-sm">({aiPercent}%)</span>
            </div>
            <Progress value={aiPercent} className="w-48 bg-muted" />
          </div>
          <div className="flex-1 flex flex-col justify-center items-center space-y-2">
            <div className="flex gap-3 items-center">
              <Badge variant="secondary">Manual</Badge>
              <span className="text-2xl font-semibold">{manualQuestions}</span>
              <span className="text-muted-foreground text-sm">({manualPercent}%)</span>
            </div>
            <Progress value={manualPercent} className="w-48 bg-muted" />
          </div>
        </div>
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <span className="font-medium">Total questions:</span> {total}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionSourceStats;
