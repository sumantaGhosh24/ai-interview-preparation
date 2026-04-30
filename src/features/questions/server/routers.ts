import {TRPCError} from "@trpc/server";
import z from "zod";

import {inngest} from "@/inngest/client";
import prisma from "@/lib/db";
import {createTRPCRouter, protectedProcedure} from "@/trpc/init";
import {PAGINATION} from "@/constants/pagination";
import {Difficulty} from "@/generated/prisma/enums";

import {
  getPreviousWeaknesses,
  getRecommendedDifficulty,
} from "../helpers/utils";

export const questionsRouter = createTRPCRouter({
  createManual: protectedProcedure
    .input(
      z.object({
        topicId: z.string(),
        question: z.string().min(10),
        difficulty: z.enum(Difficulty),
      }),
    )
    .mutation(async ({input}) => {
      const topic = await prisma.topic.findUnique({
        where: {id: input.topicId},
      });

      if (!topic) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Topic not found",
        });
      }

      return prisma.question.create({
        data: {
          topicId: input.topicId,
          question: input.question,
          difficulty: input.difficulty,
          isAI: false,
        },
      });
    }),
  generateAdaptive: protectedProcedure
    .input(
      z.object({topicId: z.string(), numberOfQuestions: z.number().default(1)}),
    )
    .mutation(async ({input, ctx}) => {
      const topic = await prisma.topic.findUnique({
        where: {id: input.topicId},
      });

      if (!topic) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Topic not found",
        });
      }

      const jobId = crypto.randomUUID();

      const difficulty = await getRecommendedDifficulty(
        ctx.auth.user.id,
        input.topicId,
      );

      const previousWeaknesses = await getPreviousWeaknesses(
        ctx.auth.user.id,
        input.topicId,
      );

      await inngest.send({
        name: "question/generate",
        data: {
          userId: ctx.auth.user.id,
          topicId: topic.id,
          topicName: topic.name,
          difficulty,
          previousWeaknesses,
          numberOfQuestions: input.numberOfQuestions,
          jobId,
        },
      });

      return {topicId: topic.id, jobId};
    }),
  remove: protectedProcedure
    .input(z.object({id: z.string()}))
    .mutation(async ({input}) => {
      return prisma.question.delete({
        where: {id: input.id},
      });
    }),
  getByTopic: protectedProcedure
    .input(
      z.object({
        topicId: z.string(),
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(PAGINATION.MIN_PAGE_SIZE)
          .max(PAGINATION.MAX_PAGE_SIZE)
          .default(PAGINATION.DEFAULT_PAGE_SIZE),
        search: z.string().default(""),
      }),
    )
    .query(async ({input}) => {
      const {page, pageSize, search} = input;

      const [items, totalCount] = await Promise.all([
        prisma.question.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where: {
            topicId: input.topicId,
            question: {
              contains: search,
              mode: "insensitive",
            },
          },
          orderBy: {
            updatedAt: "desc",
          },
        }),
        prisma.question.count({
          where: {
            topicId: input.topicId,
            question: {
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
    }),
});
