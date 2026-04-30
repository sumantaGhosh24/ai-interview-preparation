import z from "zod";

import prisma from "@/lib/db";
import {createTRPCRouter, protectedProcedure} from "@/trpc/init";
import {PAGINATION} from "@/constants/pagination";

export const topicsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({name: z.string(), description: z.string()}))
    .mutation(async ({input, ctx}) => {
      return prisma.topic.create({
        data: {
          userId: ctx.auth.user.id,
          name: input.name,
          description: input.description,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({id: z.string(), name: z.string(), description: z.string()}),
    )
    .mutation(({ctx, input}) => {
      return prisma.topic.update({
        where: {id: input.id, userId: ctx.auth.user.id},
        data: {name: input.name, description: input.description},
      });
    }),
  remove: protectedProcedure
    .input(z.object({id: z.string()}))
    .mutation(({ctx, input}) => {
      return prisma.topic.delete({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
      });
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
    .query(async ({ctx, input}) => {
      const {page, pageSize, search} = input;

      const [items, totalCount] = await Promise.all([
        prisma.topic.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where: {
            userId: ctx.auth.user.id,
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
            userId: ctx.auth.user.id,
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
    }),
});
