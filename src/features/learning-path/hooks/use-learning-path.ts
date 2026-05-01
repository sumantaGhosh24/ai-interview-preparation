import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {toast} from "sonner";

import {useTRPC} from "@/trpc/client";
import {useGlobalParams} from "@/features/global/hooks/use-global-params";

export const useSuspenseLearningPaths = () => {
  const trpc = useTRPC();

  const [params] = useGlobalParams();

  return useSuspenseQuery(trpc.learningPaths.getMany.queryOptions(params));
};

export const useSuspenseLearningPathByTopicId = (topicId: string) => {
  const trpc = useTRPC();

  return useSuspenseQuery(
    trpc.learningPaths.getByTopicId.queryOptions({topicId}),
  );
};

export const useCreateLearningPath = () => {
  const queryClient = useQueryClient();

  const trpc = useTRPC();

  return useMutation(
    trpc.learningPaths.create.mutationOptions({
      onSuccess: (data) => {
        toast.success("Learning path created");

        queryClient.invalidateQueries(
          trpc.learningPaths.getByTopicId.queryOptions({topicId: data.topicId}),
        );
      },
      onError: (error) => {
        toast.error(`Failed to create learning path: ${error.message}`);
      },
    }),
  );
};

export const useRemoveLearningPath = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.learningPaths.remove.mutationOptions({
      onSuccess: (data) => {
        toast.success("Learning path removed");

        queryClient.invalidateQueries(
          trpc.learningPaths.getByTopicId.queryOptions({topicId: data.topicId}),
        );

        queryClient.invalidateQueries(
          trpc.learningPaths.getMany.queryOptions({}),
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove learning path: ${error.message}`);
      },
    }),
  );
};
