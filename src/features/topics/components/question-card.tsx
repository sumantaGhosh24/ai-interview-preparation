import Link from "next/link";
import { EyeIcon, FileQuestionIcon, TrashIcon } from "lucide-react";

import { useRemoveQuestion } from "@/features/questions/hooks/use-questions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Question } from "@/generated/prisma/client";

interface TopicQuestionCardProps {
  question: Question;
}

const QuestionCard = ({ question }: TopicQuestionCardProps) => {
  const removeQuestion = useRemoveQuestion();

  const handleRemove = () => {
    if (removeQuestion.isPending) {
      return;
    }

    removeQuestion.mutate({
      id: question.id,
    });
  };

  return (
    <Card className="p-4 shadow-none hover:shadow transition-all">
      <CardContent className="flex flex-row items-center justify-between gap-3 p-0">
        <div className="flex items-center gap-3 w-full">
          <FileQuestionIcon />
          <div className="w-full">
            <CardTitle className="text-base font-medium capitalize">{question.question}</CardTitle>
            <CardDescription className="text-xs">
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
              <Badge className="uppercase ml-2">{question.isAI ? "AI Generated" : "Manual"}</Badge>
            </CardDescription>
          </div>
        </div>
        <div className="flex gap-3 items-center flex-wrap md:flex-nowrap">
          <Button size="icon" asChild>
            <Link href={`/topics/${question.topicId}/questions/${question.id}`}>
              <EyeIcon className="size-4" />
            </Link>
          </Button>
          <Button size="icon" variant="destructive" onClick={handleRemove}>
            <TrashIcon className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
