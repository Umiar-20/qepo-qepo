import { z } from "zod";

export const editProfileFormSchema = z.object({
  username: z
    .string()
    .min(5, { message: "Username must be at least 5 characters" })
    .max(20, { message: "Username must be at most 20 characters" }),
  bio: z.string().optional(),
});

export type TEditProfileFormSchema = z.infer<typeof editProfileFormSchema>;
