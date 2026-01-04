import { createTRPCRouter } from "./create-context";
import { exampleRouter } from "./routes/example";
import { adminRouter } from "./routes/admin";

export const appRouter = createTRPCRouter({
  example: exampleRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
