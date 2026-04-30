import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {toast} from "sonner";

import {useTRPC} from "@/trpc/client";
import {useGlobalParams} from "@/features/global/hooks/use-global-params";

export const useSuspenseTopics = () => {
  const trpc = useTRPC();

  const [params] = useGlobalParams();

  return useSuspenseQuery(trpc.topics.getMany.queryOptions(params));
};

export const useSuspenseTopic = (id: string) => {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.topics.getOne.queryOptions({id}));
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
        queryClient.invalidateQueries(
          trpc.topics.getOne.queryOptions({id: data.id}),
        );
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
        queryClient.invalidateQueries(
          trpc.topics.getOne.queryFilter({id: data.id}),
        );
      },
    }),
  );
};
