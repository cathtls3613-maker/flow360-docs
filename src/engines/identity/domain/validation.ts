import { z } from "zod";

import { ValidationError } from "@/lib/errors";

/**
 * Validation rules for identity inputs. These are business rules and
 * therefore live in the engine — screens reuse them, never redefine
 * them.
 */

export const signUpSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Please enter your name.")
    .max(200, "Name is too long."),
  companyName: z
    .string()
    .trim()
    .min(1, "Please enter your company name.")
    .max(200, "Company name is too long."),
  email: z.email("Please enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(72, "Password is too long."),
});

export const signInSchema = z.object({
  email: z.email("Please enter a valid email address."),
  password: z.string().min(1, "Please enter your password."),
});

/**
 * Parses unknown input against a schema, converting failures into the
 * application's standard ValidationError with per-field details.
 */
export function parseOrThrow<T>(schema: z.ZodType<T>, input: unknown): T {
  const result = schema.safeParse(input);
  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const field = issue.path.join(".") || "form";
      if (!(field in fieldErrors)) {
        fieldErrors[field] = issue.message;
      }
    }
    const firstMessage = Object.values(fieldErrors)[0] ?? "Invalid input.";
    throw new ValidationError(firstMessage, { fieldErrors });
  }
  return result.data;
}
