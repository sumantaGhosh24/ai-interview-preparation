import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {toast} from "sonner";

import {useTRPC} from "@/trpc/client";
import {useGlobalParams} from "@/features/global/hooks/use-global-params";

export const useSuspenseQuestionsByTopic = (topicId: string) => {
  const trpc = useTRPC();

  const [params] = useGlobalParams();

  return useSuspenseQuery(
    trpc.questions.getByTopic.queryOptions({...params, topicId}),
  );
};

export const useCreateQuestionManual = () => {
  const queryClient = useQueryClient();

  const trpc = useTRPC();

  return useMutation(
    trpc.questions.createManual.mutationOptions({
      onSuccess: (data) => {
        toast.success("Question created");

        queryClient.invalidateQueries(
          trpc.questions.getByTopic.queryOptions({topicId: data.topicId}),
        );
      },
      onError: (error) => {
        toast.error(`Failed to create question: ${error.message}`);
      },
    }),
  );
};

export const useGenerateAdaptiveQuestion = () => {
  const queryClient = useQueryClient();

  const trpc = useTRPC();

  return useMutation(
    trpc.questions.generateAdaptive.mutationOptions({
      onSuccess: (data) => {
        toast.success("Adaptive question generated");

        queryClient.invalidateQueries(
          trpc.questions.getByTopic.queryOptions({topicId: data.topicId}),
        );
      },
      onError: (error) => {
        toast.error(`Failed to update question: ${error.message}`);
      },
    }),
  );
};

export const useRemoveQuestion = () => {
  const trpc = useTRPC();

  const queryClient = useQueryClient();

  return useMutation(
    trpc.questions.remove.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Question "${data.id}" removed`);

        queryClient.invalidateQueries(
          trpc.questions.getByTopic.queryOptions({topicId: data.topicId}),
        );
      },
    }),
  );
};
