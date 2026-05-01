"use client";

import {useState} from "react";

import LoadingSwap from "@/components/loading-swap";
import {Button} from "@/components/ui/button";

import {useCreateLearningPath} from "../hooks/use-learning-path";

interface CreateLearningPathProps {
  topicId: string;
}

const CreateLearningPath = ({topicId}: CreateLearningPathProps) => {
  const [loading, setLoading] = useState(false);

  const createLearningPath = useCreateLearningPath();

  const handleCreateLearningPath = () => {
    setLoading(true);

    createLearningPath.mutate({
      topicId,
    });
  };

  return (
    <Button
      type="button"
      onClick={handleCreateLearningPath}
      disabled={createLearningPath.isPending || loading}
      className="w-full mb-5"
    >
      <LoadingSwap isLoading={createLearningPath.isPending || loading}>
        Create Learning Path
      </LoadingSwap>
    </Button>
  );
};

export default CreateLearningPath;
