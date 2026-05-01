"use client";

import {formatDistanceToNow} from "date-fns";

import {useSuspenseQuestion} from "@/features/questions/hooks/use-questions";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";

import {useSuspenseAnswersHistory} from "../hooks/use-answers";
import EvaluationCard from "./evaluation-card";
import EvaluationStatus from "./evaluation-status";

interface AnswerHistoryProps {
  questionId: string;
}

const AnswerHistory = ({questionId}: AnswerHistoryProps) => {
  const {data: question} = useSuspenseQuestion(questionId);

  const {data: answersHistory} = useSuspenseAnswersHistory(questionId);

  const attempts = answersHistory.items;
  const latestAttempt = attempts[0];

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl border gap-3">
        <CardHeader>
          <CardTitle>Question Prompt</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base leading-7">{question.question}</p>
          <Badge
            className="uppercase"
            variant={
              question.difficulty === "EASY"
                ? "success"
                : question.difficulty === "MEDIUM"
                  ? "warning"
                  : "destructive"
            }
          >
            {question.difficulty}
          </Badge>
          <Badge className="uppercase ml-2">
            {question.isAI ? "AI Generated" : "Manual"}
          </Badge>
        </CardContent>
      </Card>
      {!latestAttempt ? (
        <Card className="rounded-2xl border">
          <CardHeader>
            <CardTitle>No attempts yet</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            Submit your first answer to start evaluation and history tracking.
          </CardContent>
        </Card>
      ) : latestAttempt.evaluation ? (
        <EvaluationCard answer={latestAttempt} />
      ) : (
        <EvaluationStatus answerId={latestAttempt.id} questionId={questionId} />
      )}
      {!!attempts.length && (
        <Card className="rounded-2xl border">
          <CardHeader>
            <CardTitle>Submission History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {attempts.map((attempt) => (
              <div
                key={attempt.id}
                className="space-y-2 rounded-xl border p-4 text-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <Badge
                    variant={attempt.evaluation ? "success" : "warning"}
                    className="uppercase"
                  >
                    {attempt.evaluation ? "Evaluated" : "Pending"}
                  </Badge>
                  <span className="text-muted-foreground">
                    {formatDistanceToNow(new Date(attempt.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <p className="line-clamp-4 whitespace-pre-wrap text-muted-foreground">
                  {attempt.content}
                </p>
                {attempt.evaluation ? (
                  <p className="font-medium">
                    Score: {attempt.evaluation.score}/10
                  </p>
                ) : (
                  <p className="font-medium text-muted-foreground">
                    Score: Pending
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnswerHistory;
