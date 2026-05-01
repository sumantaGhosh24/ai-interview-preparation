import z from "zod";
import {TRPCError} from "@trpc/server";

import prisma from "@/lib/db";
import {createTRPCRouter, protectedProcedure} from "@/trpc/init";
import {inngest} from "@/inngest/client";
import {getPreviousWeaknesses} from "@/features/global/helpers/utils";
import {PAGINATION} from "@/constants/pagination";

export const learningPathsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({topicId: z.string()}))
    .mutation(async ({input, ctx}) => {
      const {topicId} = input;

      const topic = await prisma.topic.findUnique({
        where: {id: input.topicId},
      });

      if (!topic) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Topic not found",
        });
      }

      const previousWeaknesses = await getPreviousWeaknesses(
        ctx.auth.user.id,
        input.topicId,
      );

      await inngest.send({
        name: "learning-path/generate",
        data: {
          userId: ctx.auth.user.id,
          topicId,
          topicName: topic.name,
          previousWeaknesses,
        },
      });

      return {topicId: topic.id};
    }),
  remove: protectedProcedure
    .input(z.object({id: z.string()}))
    .mutation(async ({input, ctx}) => {
      return prisma.learningPath.delete({
        where: {id: input.id, userId: ctx.auth.user.id},
      });
    }),
  getByTopicId: protectedProcedure
    .input(z.object({topicId: z.string()}))
    .query(async ({input, ctx}) => {
      const learningPath = await prisma.learningPath.findFirst({
        where: {
          topicId: input.topicId,
          userId: ctx.auth.user.id,
        },
        include: {
          phases: {
            include: {
              tasks: true,
            },
          },
          topic: true,
        },
      });

      if (!learningPath) {
        return null;
      }

      return learningPath;
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
      }),
    )
    .query(async ({input, ctx}) => {
      const {page, pageSize} = input;

      const [items, totalCount] = await Promise.all([
        prisma.learningPath.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where: {
            userId: ctx.auth.user.id,
          },
          include: {
            topic: true,
            phases: {
              include: {
                tasks: true,
              },
            },
          },
          orderBy: {
            updatedAt: "desc",
          },
        }),
        prisma.learningPath.count({
          where: {
            userId: ctx.auth.user.id,
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
    }),
});
