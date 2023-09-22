import { z } from "zod";

export const linkPasswordSchema = z.object({
  password: z.string().min(1),
});

export type FormData = z.infer<typeof linkPasswordSchema>;
