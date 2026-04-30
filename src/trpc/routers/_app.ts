import {topicsRouter} from "@/features/topics/server/routers";

import {createTRPCRouter} from "../init";

export const appRouter = createTRPCRouter({
  topics: topicsRouter,
});

export type AppRouter = typeof appRouter;
