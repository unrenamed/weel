import { z } from "zod";

export const linkPasswordSchema = z.object({
  password: z.string().min(1, { message: "Password required" }),
});

export type FormData = z.infer<typeof linkPasswordSchema>;
