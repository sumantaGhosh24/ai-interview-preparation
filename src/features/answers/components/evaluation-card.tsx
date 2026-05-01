import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {
  Answer,
  AnswerEvaluation,
  EvaluationImprovement,
  EvaluationMistake,
} from "@/generated/prisma/client";

interface EvaluationCardProps {
  answer: Answer & {
    evaluation:
      | (AnswerEvaluation & {
          mistakes: EvaluationMistake[];
          improvements: EvaluationImprovement[];
        })
      | null;
  };
}

const EvaluationCard = ({answer}: EvaluationCardProps) => {
  const evaluation = answer.evaluation;

  if (!evaluation) return null;

  return (
    <Card className="rounded-2xl border">
      <CardHeader>
        <CardTitle>AI Feedback</CardTitle>
        <p className="text-muted-foreground">
          Review your performance and improve your answer quality.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border p-4">
            <p className="text-sm text-muted-foreground">Score</p>
            <p className="mt-2 text-3xl font-bold">{evaluation.score}/10</p>
          </div>
          <div className="rounded-xl border p-4">
            <p className="text-sm text-muted-foreground">Model Answer</p>
            <p className="mt-2 text-sm whitespace-pre-wrap">
              {evaluation.modelAnswer}
            </p>
          </div>
        </div>
        <div>
          <h3 className="font-semibold">Mistakes</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {evaluation.mistakes.map((item) => (
              <li key={item.id} className="rounded-lg border p-3">
                {item.content}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold">Improvements</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {evaluation.improvements.map((item) => (
              <li key={item.id} className="rounded-lg border p-3">
                {item.content}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default EvaluationCard;
