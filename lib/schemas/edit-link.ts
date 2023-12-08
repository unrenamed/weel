import { COUNTRIES } from "@/lib/constants";
import { z } from "zod";

export const editLinkSchema = z.object({
  url: z.string().trim().min(1).url(),
  domain: z.string().trim().min(1),
  key: z
    .string()
    .trim()
    .min(1)
    .regex(/[a-zA-Z0-9\-/]+/, 'Only numbers, letters, "-" and "/" are allowed'),
  ios: z.string().trim().url().nullable(),
  android: z.string().trim().url().nullable(),
  geo: z
    .record(
      z.string().refine((val) => Object.keys(COUNTRIES).includes(val), {
        message: `Not valid CCA2 country code. The supported codes include ${Object.keys(
          COUNTRIES
        ).join(", ")}`,
      }),
      z.string().trim().url()
    )
    .refine((val) => Object.keys(val).length > 0, {
      message: "Geo object cannot be empty",
    })
    .refine((val) => Object.keys(val).length <= 5, {
      message: "Geo object cannot have more than 5 locations",
    })
    .nullable(),
  expiresAt: z
    .string()
    .min(1)
    .regex(
      /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)$/,
      "Expiration date is not valid ISO 8601 date and time format with a UTC offset"
    )
    .nullable(),
});
