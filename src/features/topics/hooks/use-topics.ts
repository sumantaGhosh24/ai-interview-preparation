import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {toast} from "sonner";

import {useTRPC} from "@/trpc/client";

import {useTopicsParams} from "./use-topics-params";

export const useSuspenseTopics = () => {
  const trpc = useTRPC();

  const [params] = useTopicsParams();

  return useSuspenseQuery(trpc.topics.getMany.queryOptions(params));
};

export const useCreateTopic = () => {
  const queryClient = useQueryClient();

  const trpc = useTRPC();

  return useMutation(
    trpc.topics.create.mutationOptions({
      onSuccess: () => {
        toast.success("Topic created");
        queryClient.invalidateQueries(trpc.topics.getMany.queryOptions({}));
      },
      onError: (error) => {
        toast.error(`Failed to create topic: ${error.message}`);
      },
    }),
  );
};

export const useUpdateTopic = () => {
  const queryClient = useQueryClient();

  const trpc = useTRPC();

  return useMutation(
    trpc.topics.update.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Topic "${data.name}" updated`);
        queryClient.invalidateQueries(trpc.topics.getMany.queryOptions({}));
      },
      onError: (error) => {
        toast.error(`Failed to update topic: ${error.message}`);
      },
    }),
  );
};

export const useRemoveTopic = () => {
  const trpc = useTRPC();

  const queryClient = useQueryClient();

  return useMutation(
    trpc.topics.remove.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Topic "${data.name}" removed`);
        queryClient.invalidateQueries(trpc.topics.getMany.queryOptions({}));
      },
    }),
  );
};
