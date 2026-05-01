"use client";

import { TrashIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LearningPath, LearningPathPhase, LearningPathTask } from "@/generated/prisma/client";
import { Button } from "@/components/ui/button";

import { useRemoveLearningPath } from "../hooks/use-learning-path";

interface FullLearningPath extends LearningPath {
  phases: (LearningPathPhase & {
    tasks: LearningPathTask[];
  })[];
}

interface LearningPathCardProps {
  learningPath: FullLearningPath;
}

const LearningPathCard = ({ learningPath }: LearningPathCardProps) => {
  const removeLearningPath = useRemoveLearningPath();

  const handleRemoveLearningPath = () => {
    if (removeLearningPath.isPending) {
      return;
    }

    removeLearningPath.mutate({
      id: learningPath.id,
    });
  };

  return (
    <Card className="p-4 shadow-none hover:shadow transition-all w-full">
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle>{learningPath?.title}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Duration: {learningPath?.duration}
          </CardDescription>
        </div>
        <Button size="icon" variant="destructive" onClick={handleRemoveLearningPath}>
          <TrashIcon className="size-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {learningPath && learningPath?.phases?.length > 0 ? (
          learningPath?.phases?.map((phase) => (
            <div key={phase.id} className="rounded-lg border p-4 bg-muted/50">
              <h3 className="text-lg font-semibold mb-1">{phase.title}</h3>
              <div className="mb-2 text-muted-foreground text-sm">Duration: {phase.duration}</div>
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
                <p className="text-sm text-muted-foreground">No tasks for this phase.</p>
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

export default LearningPathCard;
