import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { PAGINATION } from "@/constants/pagination";
import { invalidateAnswerCaches } from "@/lib/cache-invalidation";

export const answersRouter = createTRPCRouter({
  submit: protectedProcedure
    .input(
      z.object({
        questionId: z.string(),
        content: z.string().min(10),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.auth.user.id;
      const answer = await prisma.answer.create({
        data: {
          questionId: input.questionId,
          content: input.content,
          userId,
          status: "PENDING",
          statusMessage: "Queued for evaluation",
        },
      });

      const question = await prisma.question.findUnique({
        where: {
          id: input.questionId,
        },
        select: {
          id: true,
          topicId: true,
        },
      });

      if (!question) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Question not found",
        });
      }

      await invalidateAnswerCaches(userId, question.topicId, question.id);

      await inngest.send({
        name: "answer/submitted",
        data: {
          answerId: answer.id,
          userId,
        },
      });

      return answer;
    }),
  getSubmissionStatus: protectedProcedure
    .input(z.object({ answerId: z.string() }))
    .query(async ({ input, ctx }) => {
      const answer = await prisma.answer.findFirst({
        where: {
          id: input.answerId,
          userId: ctx.auth.user.id,
        },
        select: {
          id: true,
          questionId: true,
          status: true,
          statusMessage: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!answer) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Answer not found",
        });
      }

      return answer;
    }),
  getAnswersHistory: protectedProcedure
    .input(
      z.object({
        questionId: z.string(),
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(PAGINATION.MIN_PAGE_SIZE)
          .max(PAGINATION.MAX_PAGE_SIZE)
          .default(PAGINATION.DEFAULT_PAGE_SIZE),
        search: z.string().default(""),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { page, pageSize, search } = input;

      const [items, totalCount] = await Promise.all([
        prisma.answer.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where: {
            userId: ctx.auth.user.id,
            questionId: input.questionId,
            content: {
              contains: search,
              mode: "insensitive",
            },
          },
          include: {
            evaluation: {
              include: {
                mistakes: true,
                improvements: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        }),
        prisma.answer.count({
          where: {
            userId: ctx.auth.user.id,
            questionId: input.questionId,
            content: {
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
