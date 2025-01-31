import { z } from "zod";

export const passwordSchema = z
  .string({ message: "password is required" })
  .min(8, {
    message:
      "Password must be at least 8 characters, contain at least one uppercase letter, and contain at least one number",
  })
  .regex(/[A-Z]/, {
    message:
      "Password must be at least 8 characters, contain at least one uppercase letter, and contain at least one number",
  })
  .regex(/[0-9]/, {
    message:
      "Password must be at least 8 characters, contain at least one uppercase letter, and contain at least one number",
  });

export const emailSchema = z
  .string({ message: "email is required" })
  .email({ message: "Invalid email" });
