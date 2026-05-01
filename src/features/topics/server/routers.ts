import { TRPCError } from "@trpc/server";
import z from "zod";

import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { PAGINATION } from "@/constants/pagination";
import { invalidateTopicCaches } from "@/lib/cache-invalidation";
import { getOrSetCache } from "@/lib/cache";
import { cacheKeys } from "@/lib/cache-keys";

export const topicsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string(), description: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const topic = await prisma.topic.create({
        data: {
          userId: ctx.auth.user.id,
          name: input.name,
          description: input.description,
        },
      });

      await invalidateTopicCaches(ctx.auth.user.id);

      return topic;
    }),
  update: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string(), description: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const updatedTopic = await prisma.topic.update({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
        data: {
          name: input.name,
          description: input.description,
        },
      });

      await invalidateTopicCaches(ctx.auth.user.id, input.id);

      return updatedTopic;
    }),
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const deletedTopic = await prisma.topic.delete({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
      });

      await invalidateTopicCaches(ctx.auth.user.id, input.id);

      return deletedTopic;
    }),
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(PAGINATION.MIN_PAGE_SIZE)
          .max(PAGINATION.MAX_PAGE_SIZE)
          .default(PAGINATION.DEFAULT_PAGE_SIZE),
        search: z.string().default(""),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search } = input;
      const userId = ctx.auth.user.id;

      return getOrSetCache(
        cacheKeys.topicsList(userId, page, pageSize, search),
        async () => {
          const [items, totalCount] = await Promise.all([
            prisma.topic.findMany({
              skip: (page - 1) * pageSize,
              take: pageSize,
              where: {
                userId: userId,
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              orderBy: {
                updatedAt: "desc",
              },
            }),
            prisma.topic.count({
              where: {
                userId: userId,
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            }),
          ]);

          const totalPages = Math.ceil(totalCount / pageSize);
          const hasNextPage = page < totalPages;
          const hasPreviousPage = page > 1;

          return {
            items,
            page,
            pageSize,
            totalCount,
            totalPages,
            hasNextPage,
            hasPreviousPage,
          };
        },
        300,
      );
    }),
  getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const userId = ctx.auth.user.id;
    const topicId = input.id;

    return getOrSetCache(
      cacheKeys.topicDetail(userId, topicId),
      async () => {
        const topic = await prisma.topic.findUniqueOrThrow({
          where: { id: topicId, userId: userId },
          include: {
            questions: true,
            performance: {
              where: {
                userId: userId,
              },
            },
          },
        });

        if (!topic) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Topic not found",
          });
        }

        const recentAnswers = await prisma.answer.findMany({
          where: {
            userId: userId,
            question: {
              topicId: topicId,
            },
          },
          include: {
            evaluation: true,
            question: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        });

        return {
          ...topic,
          totalQuestions: topic.questions.length,
          recentAnswers,
        };
      },
      300,
    );
  }),
});
