import { z } from "zod";

export const changeLinkPasswordSchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string().min(4, {
    message: "Password must be at least 4 characters long",
  }),
});

export type FormData = z.infer<typeof changeLinkPasswordSchema>;
