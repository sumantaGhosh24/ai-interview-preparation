"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { useSuspenseRecentAnswers } from "../hooks/use-analytics";

const statusColor = (status: string) => {
  switch (status) {
    case "CORRECT":
      return "default";
    case "INCORRECT":
      return "destructive";
    case "PARTIAL":
      return "secondary";
    case "PENDING":
      return "secondary";
    default:
      return "default";
  }
};

const RecentAnswers = () => {
  const { data: answers } = useSuspenseRecentAnswers();

  return (
    <Card className="mb-5">
      <CardHeader>
        <CardTitle>Recent Answers</CardTitle>
        <CardDescription>
          Last {answers && answers.length > 0 ? answers.length : 0} question attempts
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="space-y-4 pt-4">
        {!answers || answers.length === 0 ? (
          <div className="text-muted-foreground">No recent answers found.</div>
        ) : (
          answers.map((ans) => (
            <div key={ans.id} className="border rounded-lg p-4 space-y-2 shadow-sm bg-muted/40">
              <div className="flex items-center gap-2">
                <Badge variant={statusColor(ans.status)}>{ans.status}</Badge>
                {ans.statusMessage && (
                  <span className="text-xs text-muted-foreground">{ans.statusMessage}</span>
                )}
                <span className="ml-auto text-xs text-muted-foreground">
                  {new Date(ans.createdAt).toLocaleString()}
                </span>
              </div>
              <div>
                <div className="font-medium text-sm mb-1 text-muted-foreground">
                  <span className="mr-3">Question:</span>
                  <span className="text-foreground">{ans.question}</span>
                </div>
                <div className="font-medium text-sm mb-1 text-muted-foreground">
                  <span className="mr-3">Your Answer:</span>
                  <span className="text-foreground">{ans.content}</span>
                </div>
                <div className="text-xs py-1">
                  <span className="font-semibold">Score:</span>{" "}
                  {ans.score !== null ? ans.score : "--"}
                </div>
                {ans.mistakes.length > 0 && (
                  <div className="mt-2">
                    <div className="text-xs font-semibold text-destructive mb-1">Mistakes</div>
                    <ul className="list-disc ml-5 text-xs text-destructive">
                      {ans.mistakes.map((m, idx) => (
                        <li key={idx}>{m}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {ans.improvements.length > 0 && (
                  <div className="mt-2">
                    <div className="text-xs font-semibold text-secondary-foreground mb-1">
                      Improvements
                    </div>
                    <ul className="list-disc ml-5 text-xs text-secondary-foreground">
                      {ans.improvements.map((i, idx) => (
                        <li key={idx}>{i}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default RecentAnswers;
