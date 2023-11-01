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
    .mutation(async ({ input, ctx }) => {

      const repository = await ctx.db.repository.create({
        data: {
          url: input.repoUrl,
          name: input.repoUrl.split("/").pop() ?? "",
        }
      })

      await client.sendEvent({
        name: "repo.create",
        payload: { repoUrl: input.repoUrl, repoId: repository.id },
      });

      return repository
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.repository.findMany();
  }),

  getFiles: publicProcedure
  .input(z.object({ repoId: z.number() }))
  .query(({ ctx, input }) => {
    return ctx.db.file.findMany({
      where: {
        repoId: input.repoId
      }
    });
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
