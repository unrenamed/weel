import { z } from "zod";

export const addPasswordSchema = z
  .object({
    password: z.string().min(4, {
      message: "Password must be at least 4 characters long",
    }),
    confirmPassword: z.string(),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword;
    },
    {
      message: "Passwords must match",
      path: ["confirmPassword"],
    }
  );

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, {
    message: "Current password is required",
  }),
  newPassword: z.string().min(4, {
    message: "New password must be at least 4 characters long",
  }),
});

export const removePasswordSchema = z.object({
  oldPassword: z.string().min(1, {
    message: "Current password is required",
  }),
});

export type AddPasswordFormData = z.infer<typeof addPasswordSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type RemovePasswordFormData = z.infer<typeof removePasswordSchema>;
