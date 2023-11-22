import { z } from "zod";

export const archiveLinkSchema = z.object({
  archived: z.boolean(),
});
