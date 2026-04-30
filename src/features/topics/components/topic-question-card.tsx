import Link from "next/link";
import {EyeIcon, FileQuestionIcon} from "lucide-react";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {Question} from "@/generated/prisma/client";

interface TopicQuestionCardProps {
  question: Question;
}

const TopicQuestionCard = ({question}: TopicQuestionCardProps) => {
  return (
    <Card className="p-4 shadow-none hover:shadow transition-all">
      <CardContent className="flex flex-row items-center justify-between gap-3 p-0">
        <div className="flex items-center gap-3 w-full">
          <FileQuestionIcon />
          <div className="w-full">
            <CardTitle className="text-base font-medium capitalize">
              {question.question}
            </CardTitle>
            <CardDescription className="text-xs">
              {question.difficulty}
            </CardDescription>
            <Badge>{question.isAI ? "AI Generated" : "Manual"}</Badge>
          </div>
        </div>
        <div className="flex gap-3 items-center flex-wrap md:flex-nowrap">
          <Button size="icon" asChild>
            <Link href={`/topics/${question.topicId}/questions/${question.id}`}>
              <EyeIcon className="size-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopicQuestionCard;
