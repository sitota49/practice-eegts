import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";

export const examGroupRouter = router({
    getExamGroups: publicProcedure.query(async({ctx})=>{
        const examGroups = await ctx.prisma.examGroup.findMany();
        return examGroups;

    }),
});
 