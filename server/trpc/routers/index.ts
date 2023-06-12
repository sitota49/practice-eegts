import { z } from 'zod'
import { publicProcedure, router } from '../trpc'
import { examRouter } from './exams'
import { examGroupRouter } from './examGroups'

export const appRouter = router({
  examGroup: examGroupRouter,
  exam: examRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
