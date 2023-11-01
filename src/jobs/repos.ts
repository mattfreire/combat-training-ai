import { eventTrigger } from "@trigger.dev/sdk";
import { z } from "zod";
import { db } from "~/server/db";
import { embeddingService } from "~/server/services/embedding";
import { gitService } from "~/server/services/git";
import { minioService } from "~/server/services/minio";
import { client } from "~/trigger";

// Your first job
// This Job will be triggered by an event, log a joke to the console, and then wait 5 seconds before logging the punchline
client.defineJob({
  // This is the unique identifier for your Job, it must be unique across all Jobs in your project
  id: "clone-repo-job",
  name: "Clone Repo Job",
  version: "0.0.1",
  // This is triggered by an event using eventTrigger. You can also trigger Jobs with webhooks, on schedules, and more: https://trigger.dev/docs/documentation/concepts/triggers/introduction
  trigger: eventTrigger({
    name: "repo.create",
    schema: z.object({
      repoUrl: z.string(),
      repoId: z.number(),
    })
  }),
  run: async (payload, io, ctx) => {

    const repository = await db.repository.findFirstOrThrow({
      where: {
        id: payload.repoId
      }
    })

    const collectionName = "repos"
    try {
      await embeddingService.createRepoCollection(collectionName)
      await embeddingService.createIndex(collectionName)
    } catch (e) {
      // collection already exists
    }

    await io.logger.info("Clone repo: ");
    const { path, sourceFolderName } = await gitService.cloneRepo(payload.repoUrl);
    await io.logger.info(`Completed cloning repo to ${path}`);

    const bucketName = "repos"
    try {
      await minioService.createBucket(bucketName);
    } catch (e) {
      // bucket already exists
    }
    await minioService.uploadFolder(path, bucketName, sourceFolderName);
    await io.logger.info(`Completed uploading repo to MinIO bucket ${bucketName}`);

    // await embeddingService.createPartition(collectionName, sourceFolderName)
    // await io.logger.info(`Completed creating partition ${sourceFolderName}`);

    await io.logger.info(`Getting all file paths from ${path}`);
    const filePaths = minioService.getAllFilePaths(path, sourceFolderName)
    await io.logger.info(`Completed getting all file paths`);

    const fileObjs = filePaths.map((filePath) => {
      const fileContent = minioService.readFileLocal(filePath)
      return {
        filePath,
        fileContent: fileContent.toString()
      }
    })

    await db.file.createMany({
      data: fileObjs.map((fileObj) => {
        return {
          url: fileObj.filePath,
          repoId: repository.id
        }
      })
    })

    const rows = []
    for (const fileObj of fileObjs) {
      const chunks = embeddingService.chunkText(fileObj.fileContent, 900)
      for (const chunk of chunks) {
        const embedding = await embeddingService.createEmbedding(chunk)
        // see here: https://milvus.io/docs/bulk_insert.md#2-Insert-entities
        rows.push({
          vector: embedding,
          repo_id: 1,  // map to the ID in the repo table
          file_id: 1,  // map to the ID in the file table
          content: "example",
          // content: chunk,  // always errors out that the content is too long
          metadata: {}
        })
      }
    }

    const response = await embeddingService.insert(collectionName, rows)
    if (parseInt(response.insert_cnt) !== rows.length) {
      await io.logger.error(`Failed to insert all rows into collection ${collectionName}`);
      await io.logger.info(`Response: ${JSON.stringify(response)}`);
      return
    }
    
    await io.logger.info(`Completed uploading repo to MinIO bucket ${bucketName}`);
  },
});
