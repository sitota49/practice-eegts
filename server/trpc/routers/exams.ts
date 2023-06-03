import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";

export const examRouter = router({
    getExamsCount: publicProcedure
        .input(
            z.object({
                examGroupId: z.string(),
            })
        )
        .query(async ({ ctx , input}) => {

            return await ctx.prisma.exam.count(
                {
                    where: {
                        examGroupId: input.examGroupId
                    }
                }
            );

        }),
    getExams: publicProcedure
        .input(
            z.object({
                skip: z.number(),
                search: z.string().optional(),
                examGroupId: z.string()
            })
        )
        .query(async ({ ctx, input }) => {

            return await ctx.prisma.exam.findMany({
                skip: input.skip,
                take: 6,
                orderBy: {
                    createdAt: "desc",
                },
                where: {
                    name: {
                        contains: input.search,
                    },
                    examGroupId: input.examGroupId
                },
            });


        }),
    searchExamsCount: publicProcedure
        .input(
            z.object({
                search: z.string().optional(),

                examGroupId: z.string()
            })
        )
        .query(async ({ ctx, input }) => {

            return await ctx.prisma.exam.count({
                where: {
                    name: {
                        contains: input.search,
                    },
                    examGroupId: input.examGroupId,
                },
            });

        }),
    //  exams searched
    getSearchedExams: publicProcedure
        .input(
            z.object({
                skip: z.number(),
                search: z.string().optional(),
                examGroupId: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            // if exam group id is provided
            if (input.examGroupId) {
                return await ctx.prisma.exam.findMany({
                    skip: input.skip,
                    take: 6,
                    orderBy: {
                        createdAt: "desc",
                    },
                    where: {
                        name: {
                            contains: input.search,
                        },
                        examGroupId: input.examGroupId,
                    },
                });
            }
            else {

                return await ctx.prisma.exam.findMany({
                    skip: input.skip,
                    take: 6,
                    orderBy: {
                        createdAt: "desc",
                    },
                    where: {
                        name: {
                            contains: input.search,

                        },
                    },
                });
            }

        }),

});
