import { topicsRouter } from "@/features/topics/server/routers";
import { questionsRouter } from "@/features/questions/server/routers";
import { answersRouter } from "@/features/answers/server/routers";
import { analyticsRouter } from "@/features/analytics/server/routers";
import { learningPathsRouter } from "@/features/learning-path/server/routers";

import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  topics: topicsRouter,
  questions: questionsRouter,
  answers: answersRouter,
  analytics: analyticsRouter,
  learningPaths: learningPathsRouter,
});

export type AppRouter = typeof appRouter;
