import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { useTRPC } from "@/trpc/client";
import { useGlobalParams } from "@/features/global/hooks/use-global-params";

export const useSuspenseAnswersHistory = (questionId: string) => {
  const trpc = useTRPC();

  const [params] = useGlobalParams();

  return useSuspenseQuery(trpc.answers.getAnswersHistory.queryOptions({ ...params, questionId }));
};

export const useSubmitAnswer = () => {
  const queryClient = useQueryClient();

  const trpc = useTRPC();

  return useMutation(
    trpc.answers.submit.mutationOptions({
      onSuccess: (data) => {
        toast.success("Answer submitted");

        queryClient.invalidateQueries(
          trpc.answers.getAnswersHistory.queryOptions({
            questionId: data.questionId,
          }),
        );
      },
      onError: (error) => {
        toast.error(`Failed to submit answer: ${error.message}`);
      },
    }),
  );
};
