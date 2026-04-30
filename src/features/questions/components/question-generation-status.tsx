"use client";

import {useRealtime} from "inngest/react";
import {CheckCircle2, AlertCircle, Sparkles, Loader2} from "lucide-react";

import {questionGenerationChannel} from "@/inngest/channels/question-channel";
import {getRealtimeQuestionGenerationToken} from "@/inngest/actions/get-realtime-token";
import {Card, CardContent} from "@/components/ui/card";
import {Progress} from "@/components/ui/progress";

interface QuestionGenerationStatusProps {
  jobId: string;
}

const QuestionGenerationStatus = ({jobId}: QuestionGenerationStatusProps) => {
  const channel = questionGenerationChannel({
    jobId,
  });

  const {messages} = useRealtime({
    channel,
    topics: ["progress"],
    token: () => getRealtimeQuestionGenerationToken(jobId),
    enabled: !!jobId,
  });

  const progress = messages.byTopic.progress?.data;

  if (!progress) return null;

  const isRunning = progress.status === "RUNNING";
  const isCompleted = progress.status === "COMPLETED";
  const isFailed = progress.status === "FAILED";

  return (
    <Card className="mt-4 overflow-hidden rounded-2xl border shadow-sm">
      <CardContent className="space-y-5 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              AI Question Generation
            </p>
            <h3 className="text-lg font-semibold tracking-tight">
              {progress.message}
            </h3>
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
            <span className="font-medium">{progress.progress}%</span>
          </div>
          <Progress value={progress.progress} className="h-2" />
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
