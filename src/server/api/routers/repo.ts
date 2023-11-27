import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { getLogger } from "~/server/logging";
import { minioService } from "~/server/services/minio";
import { client } from "~/trigger";

const logger = getLogger("api:repo");

export const repoRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ repoUrl: z.string() }))
    .mutation(async ({ input, ctx }) => {

      const urlSegments = input.repoUrl.split("/");
      const projectName = urlSegments.pop() ?? "";
      const userName = urlSegments.pop() ?? "";
      const repositoryName = `${userName}/${projectName}`;

      const repository = await ctx.db.repository.create({
        data: {
          url: input.repoUrl,
          name: repositoryName,
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
        repoId: input.repoId,
        relativePath: {
          not: {
            contains: ".git"
          }
        }
      }
    });
  }),

  getFileContent: publicProcedure
  .input(z.object({ fileId: z.number() }))
  .query(async ({ ctx, input }) => {
    logger.info({ fileId: input.fileId }, "getting file content")
    const file = await ctx.db.file.findUniqueOrThrow({
      where: {
        id: input.fileId,
      }
    });
    const buf = minioService.readFileLocal(file.relativePath)
    return buf.toString('utf-8');
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
