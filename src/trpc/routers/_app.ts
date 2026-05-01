import {topicsRouter} from "@/features/topics/server/routers";
import {questionsRouter} from "@/features/questions/server/routers";
import {answersRouter} from "@/features/answers/server/routers";

import {createTRPCRouter} from "../init";

export const appRouter = createTRPCRouter({
  topics: topicsRouter,
  questions: questionsRouter,
  answers: answersRouter,
});

export type AppRouter = typeof appRouter;
