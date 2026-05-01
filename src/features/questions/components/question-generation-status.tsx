"use client";

import {useEffect} from "react";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {AlertCircle, CheckCircle2, Loader2, Sparkles} from "lucide-react";

import {useTRPC} from "@/trpc/client";
import {useGlobalParams} from "@/features/global/hooks/use-global-params";
import {Card, CardContent} from "@/components/ui/card";
import {Progress} from "@/components/ui/progress";

interface QuestionGenerationStatusProps {
  jobId: string;
  topicId: string;
}

const QuestionGenerationStatus = ({
  jobId,
  topicId,
}: QuestionGenerationStatusProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [params] = useGlobalParams();

  const {data} = useQuery({
    ...trpc.questions.getGenerationStatus.queryOptions({jobId}),
    enabled: !!jobId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "COMPLETED" || status === "FAILED" ? false : 1500;
    },
  });

  const status = data?.status ?? "PENDING";
  const message =
    data?.statusMessage ??
    "Generating AI questions. This may take a few moments.";

  const isRunning = status === "RUNNING" || status === "PENDING";
  const isCompleted = status === "COMPLETED";
  const isFailed = status === "FAILED";
  const progressPercent =
    status === "COMPLETED" ? 100 : status === "RUNNING" ? 65 : 15;

  useEffect(() => {
    if (!isCompleted) return;

    queryClient.invalidateQueries(
      trpc.questions.getByTopic.queryOptions({...params, topicId}),
    );
  }, [isCompleted, queryClient, trpc.questions.getByTopic, params, topicId]);

  if (!jobId) return null;

  return (
    <Card className="mt-4 overflow-hidden rounded-2xl border shadow-sm">
      <CardContent className="space-y-5 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              AI Question Generation
            </p>
            <h3 className="text-lg font-semibold tracking-tight">{message}</h3>
          </div>
          <div className="shrink-0 rounded-xl border bg-muted/40 p-3">
            {isRunning && <Loader2 className="h-5 w-5 animate-spin" />}
            {isCompleted && <CheckCircle2 className="h-5 w-5" />}
            {isFailed && <AlertCircle className="h-5 w-5" />}
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
        <div className="rounded-xl border bg-muted/20 px-4 py-3">
          {isRunning && (
            <div className="flex items-center gap-2 text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              Generating personalized AI questions for this topic...
            </div>
          )}
          {isCompleted && (
            <div className="flex items-center gap-2 text-sm font-medium">
              <CheckCircle2 className="h-4 w-4" />
              Questions generated successfully and saved.
            </div>
          )}
          {isFailed && (
            <div className="flex items-center gap-2 text-sm font-medium">
              <AlertCircle className="h-4 w-4" />
              Failed to generate questions. Please try again.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionGenerationStatus;
