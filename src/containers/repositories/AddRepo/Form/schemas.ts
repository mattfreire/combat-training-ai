import { z } from "zod"

export const addRepoSchema = z.object({
  path: z.string()
})
