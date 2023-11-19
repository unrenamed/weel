import { getDateTimeLocal } from "@/lib/utils";
import { format } from "date-fns";
import { z } from "zod";

export const createEditLinkSchema = z.object({
  url: z
    .string()
    .trim()
    .min(1, "Please enter a destination URL to continue")
    .url(
      "Please enter a valid URL. Make sure it starts with 'http://' or 'https://' and includes a valid domain (e.g., www.example.com)"
    ),
  domain: z.string().trim().min(1),
  key: z
    .string()
    .trim()
    .min(1, "Please enter a name for your short link to continue.")
    .regex(/[a-zA-Z0-9\-/]+/, 'Only numbers, letters, "-" and "/" are allowed'),
  password: z
    .string()
    .min(4, {
      message: "Password must be at least 4 characters long",
    })
    .optional(),
  ios: z
    .string()
    .trim()
    .url(
      "Please enter a valid URL. Make sure it starts with 'http://' or 'https://' and includes a valid domain (e.g., www.example.com)"
    )
    .optional(),
  android: z
    .string()
    .trim()
    .url(
      "Please enter a valid URL. Make sure it starts with 'http://' or 'https://' and includes a valid domain (e.g., www.example.com)"
    )
    .optional(),
  geo: z
    .array(
      z.object({
        country: z.string().min(1, "Select any country from the dropdown"),
        url: z.string().trim().url("Enter a valid URL"),
      })
    )
    .max(5)
    .optional(),
  expiresAt: z
    .string()
    .min(1, "Please enter a date and time")
    .pipe(
      z.coerce.date().min(new Date(), {
        message: `Please enter a date and time later than ${format(
          new Date(),
          "dd.MM.yyyy, HH:mm"
        )}`,
      })
    )
    .transform(getDateTimeLocal)
    .optional(),
});

export type FormData = z.infer<typeof createEditLinkSchema>;
