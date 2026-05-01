"use client";

import {TrashIcon} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Button} from "@/components/ui/button";

import {
  useRemoveLearningPath,
  useSuspenseLearningPathByTopicId,
} from "../hooks/use-learning-path";
import CreateLearningPath from "./create-learning-path";

interface LearningPathProps {
  topicId: string;
}

const LearningPath = ({topicId}: LearningPathProps) => {
  const {data: learningPath} = useSuspenseLearningPathByTopicId(topicId);

  const removeLearningPath = useRemoveLearningPath();

  if (learningPath === null) return <CreateLearningPath topicId={topicId} />;

  const handleRemoveLearningPath = () => {
    if (removeLearningPath.isPending || !learningPath) {
      return;
    }

    removeLearningPath.mutate({
      id: learningPath.id,
    });
  };

  return (
    <Card className="rounded-2xl mb-5">
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle>{learningPath?.title}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Duration: {learningPath?.duration}
          </CardDescription>
        </div>
        <Button
          size="icon"
          variant="destructive"
          onClick={handleRemoveLearningPath}
        >
          <TrashIcon className="size-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {learningPath && learningPath?.phases?.length > 0 ? (
          learningPath?.phases?.map((phase) => (
            <div key={phase.id} className="rounded-lg border p-4 bg-muted/50">
              <h3 className="text-lg font-semibold mb-1">{phase.title}</h3>
              <div className="mb-2 text-muted-foreground text-sm">
                Duration: {phase.duration}
              </div>
              {phase.tasks && phase.tasks.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1">
                  {phase.tasks.map((task) => (
                    <li key={task.id}>
                      <span className="font-medium">{task.task}</span>
                      {task.resource && (
                        <span className="ml-2 text-xs text-blue-600 underline break-all">
                          {task.resource}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No tasks for this phase.
                </p>
              )}
            </div>
          ))
        ) : (
          <div className="text-muted-foreground text-sm">
            No phases found in this learning path.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LearningPath;
