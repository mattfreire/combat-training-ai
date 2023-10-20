import { eventTrigger } from "@trigger.dev/sdk";
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
  }),
  run: async (payload, io, ctx) => {
    // This logs a message to the console
    const payloadData = payload as { 
      repoUrl: string
    }
    await io.logger.info("Clone repo: ");
    
    const { path } = await gitService.cloneRepo(payloadData.repoUrl);

    await io.logger.info(`Completed cloning repo to ${path}`);

    const bucketName = "repos"
    await minioService.uploadFolder(path, bucketName);
    
    await io.logger.info(`Completed uploading repo to MinIO bucket ${bucketName}`);

    const files = minioService.printFiles('repos');
  },
});
