import { z } from 'zod'
import { publicProcedure, router } from '../trpc'
import { examRouter } from './exams'
import { examGroupRouter } from './examGroups'
import { questionRouter } from './questions'

export const appRouter = router({
  examGroup: examGroupRouter,
  exam: examRouter,
  question :questionRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
