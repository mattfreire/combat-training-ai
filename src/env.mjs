import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z
      .string()
      .url()
      .refine(
        (str) => !str.includes("YOUR_MYSQL_URL_HERE"),
        "You forgot to change the default URL"
      ),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    NEXTAUTH_URL: z.preprocess(
      // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
      // Since NextAuth.js automatically uses the VERCEL_URL if present.
      (str) => process.env.VERCEL_URL ?? str,
      // VERCEL_URL doesn't include `https` so it cant be validated as a URL
      process.env.VERCEL ? z.string() : z.string().url()
    ),
    // Add ` on ID and SECRET if you want to make sure they're not empty
    DISCORD_CLIENT_ID: z.string(),
    DISCORD_CLIENT_SECRET: z.string(),
    TRIGGER_API_KEY: z.string(),
    TRIGGER_API_URL: z.string(),
    MINIO_ENDOINT: z.string(),
    MINIO_PORT: z.coerce.number(),
    MINIO_ACCESS_KEY: z.string(),
    MINIO_SECRET_KEY: z.string(),
    MILVUS_ADDRESS: z.string(),
    MILVUS_USERNAME: z.string().optional(),
    MILVUS_PASSWORD: z.string().optional(),
    OPENAI_API_KEY: z.string(),
    PINO_LOG_LEVEL: z.enum(["error", "fatal", "warn", "info", "debug", "trace"]),
    FILE_STORAGE_PATH: z.string(),
  },
  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_TRIGGER_PUBLIC_API_KEY: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
    TRIGGER_API_KEY: process.env.TRIGGER_API_KEY,
    TRIGGER_API_URL: process.env.TRIGGER_API_URL,
    NEXT_PUBLIC_TRIGGER_PUBLIC_API_KEY: process.env.NEXT_PUBLIC_TRIGGER_PUBLIC_API_KEY,
    MINIO_ENDOINT: process.env.MINIO_ENDOINT,
    MINIO_PORT: process.env.MINIO_PORT,
    MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
    MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY,
    MILVUS_ADDRESS: process.env.MILVUS_ADDRESS,
    MILVUS_USERNAME: process.env.MILVUS_USERNAME,
    MILVUS_PASSWORD: process.env.MILVUS_PASSWORD,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    PINO_LOG_LEVEL: process.env.PINO_LOG_LEVEL,
    FILE_STORAGE_PATH: process.env.FILE_STORAGE_PATH,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
