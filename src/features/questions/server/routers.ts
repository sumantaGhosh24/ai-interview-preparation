import { TRPCError } from "@trpc/server";
import z from "zod";

import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { PAGINATION } from "@/constants/pagination";
import { Difficulty } from "@/generated/prisma/enums";
import { getPreviousWeaknesses, getRecommendedDifficulty } from "@/features/global/helpers/utils";

export const questionsRouter = createTRPCRouter({
  createManual: protectedProcedure
    .input(
      z.object({
        topicId: z.string(),
        question: z.string().min(10),
        difficulty: z.enum(Difficulty),
      }),
    )
    .mutation(async ({ input }) => {
      const topic = await prisma.topic.findUnique({
        where: { id: input.topicId },
      });

      if (!topic) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Topic not found",
        });
      }

      const question = await prisma.question.create({
        data: {
          topicId: input.topicId,
          question: input.question,
          difficulty: input.difficulty,
          isAI: false,
        },
      });

      return question;
    }),
  generateAdaptive: protectedProcedure
    .input(z.object({ topicId: z.string(), numberOfQuestions: z.number().default(1) }))
    .mutation(async ({ input, ctx }) => {
      const topic = await prisma.topic.findUnique({
        where: { id: input.topicId },
      });

      if (!topic) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Topic not found",
        });
      }

      const jobId = crypto.randomUUID();

      const difficulty = await getRecommendedDifficulty(ctx.auth.user.id, input.topicId);

      const previousWeaknesses = await getPreviousWeaknesses(ctx.auth.user.id, input.topicId);

      await prisma.questionGenerationJob.create({
        data: {
          id: jobId,
          userId: ctx.auth.user.id,
          topicId: topic.id,
          numberOfQuestions: input.numberOfQuestions,
          status: "PENDING",
          statusMessage: "Queued for generation",
        },
      });

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

      return { topicId: topic.id, jobId };
    }),
  getGenerationStatus: protectedProcedure
    .input(z.object({ jobId: z.string() }))
    .query(async ({ input, ctx }) => {
      const job = await prisma.questionGenerationJob.findFirst({
        where: {
          id: input.jobId,
          userId: ctx.auth.user.id,
        },
      });

      if (!job) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Question generation job not found",
        });
      }

      return job;
    }),
  remove: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ input }) => {
    const existingQuestion = await prisma.question.findUnique({
      where: {
        id: input.id,
      },
      select: {
        id: true,
        topicId: true,
      },
    });

    if (!existingQuestion) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Question not found",
      });
    }

    const deletedQuestion = await prisma.question.delete({
      where: {
        id: input.id,
      },
    });

    return deletedQuestion;
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
    .query(async ({ input }) => {
      const { page, pageSize, search } = input;

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
  getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
    const questionId = input.id;

    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Question not found",
      });
    }

    return question;
  }),
});
