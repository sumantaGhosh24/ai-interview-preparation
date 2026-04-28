import {createTRPCRouter} from "../init";

export const appRouter = createTRPCRouter({
  interviews: {},
});

export type AppRouter = typeof appRouter;
