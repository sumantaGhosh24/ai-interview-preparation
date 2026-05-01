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

  const answers = answersHistory.items;
  const latestAnswer = answers[0];

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
      {!latestAnswer ? (
        <Card className="rounded-2xl border">
          <CardHeader>
            <CardTitle>No answers yet</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            Submit your first answer to start evaluation and history tracking.
          </CardContent>
        </Card>
      ) : latestAnswer.evaluation ? (
        <EvaluationCard answer={latestAnswer} />
      ) : (
        <EvaluationStatus answerId={latestAnswer.id} questionId={questionId} />
      )}
      {!!answers.length && (
        <Card className="rounded-2xl border">
          <CardHeader>
            <CardTitle>Submission History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {answers.map((answer) => (
              <div
                key={answer.id}
                className="space-y-2 rounded-xl border p-4 text-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <Badge
                    variant={answer.evaluation ? "success" : "warning"}
                    className="uppercase"
                  >
                    {answer.evaluation ? "Evaluated" : "Pending"}
                  </Badge>
                  <span className="text-muted-foreground">
                    {formatDistanceToNow(new Date(answer.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <p className="line-clamp-4 whitespace-pre-wrap text-muted-foreground">
                  {answer.content}
                </p>
                {answer.evaluation ? (
                  <p className="font-medium">
                    Score: {answer.evaluation.score}/10
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
