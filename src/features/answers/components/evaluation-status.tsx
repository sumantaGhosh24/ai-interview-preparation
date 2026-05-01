"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

import { useTRPC } from "@/trpc/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface EvaluationStatusProps {
  answerId: string;
  questionId: string;
}

const EvaluationStatus = ({ answerId, questionId }: EvaluationStatusProps) => {
  const trpc = useTRPC();

  const queryClient = useQueryClient();

  const { data } = useQuery({
    ...trpc.answers.getSubmissionStatus.queryOptions({ answerId }),
    enabled: !!answerId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "COMPLETED" || status === "FAILED" ? false : 1500;
    },
  });

  const status = data?.status ?? "PENDING";
  const message =
    data?.statusMessage ?? "Your answer has been submitted. AI evaluation is being processed.";

  const progressPercent = status === "COMPLETED" ? 100 : status === "RUNNING" ? 60 : 10;

  useEffect(() => {
    if (status !== "COMPLETED") return;

    queryClient.invalidateQueries(trpc.answers.getAnswersHistory.queryOptions({ questionId }));
  }, [status, queryClient, questionId, trpc.answers.getAnswersHistory]);

  return (
    <Card className="rounded-2xl border">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div className="space-y-1">
          <CardTitle>AI Evaluation Status</CardTitle>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
        <div className="rounded-xl border bg-muted/40 p-3">
          {status === "RUNNING" || status === "PENDING" ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : status === "COMPLETED" ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{progressPercent}%</span>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </CardContent>
    </Card>
  );
};

export default EvaluationStatus;
