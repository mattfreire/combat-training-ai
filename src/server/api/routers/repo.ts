import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { client } from "~/trigger";


export const repoRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ repoUrl: z.string() }))
    .mutation(async ({ input }) => {
      await client.sendEvent({
        name: "repo.create",
        payload: { repoUrl: input.repoUrl },
      });

      return {
        status: "ok",
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.example.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
