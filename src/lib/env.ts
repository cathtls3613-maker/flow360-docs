import { z } from "zod";

/**
 * Environment configuration with validation.
 *
 * Every setting the application needs from its environment is declared
 * here with a schema. If a required setting is missing or malformed the
 * application fails at startup with a clear message, instead of failing
 * mysteriously at runtime in front of a user.
 *
 * Add new variables in three places:
 *   1. The appropriate schema below.
 *   2. The `runtimeEnv` object (client vars MUST be referenced literally
 *      as `process.env.NEXT_PUBLIC_...` so Next.js can inline them).
 *   3. `.env.example`, so other engineers know the variable exists.
 */

/** Variables that are only available on the server. Never sent to browsers. */
const serverSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  /** Secret key for Supabase admin operations. Server only. */
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
});

/**
 * Variables exposed to the browser. They MUST be prefixed with
 * NEXT_PUBLIC_ and MUST NOT contain secrets.
 */
const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.url().optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
});

const isServer = typeof window === "undefined";

/**
 * Next.js replaces `process.env.NEXT_PUBLIC_*` expressions at build time,
 * so client variables must be listed literally — a dynamic lookup like
 * `process.env[name]` would come back undefined in the browser.
 */
const runtimeEnv = {
  NODE_ENV: process.env.NODE_ENV,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};

const schema = isServer
  ? serverSchema.extend(clientSchema.shape)
  : clientSchema;

function parseEnv() {
  const result = schema.safeParse(runtimeEnv);

  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(
      `Invalid environment configuration:\n${issues}\n` +
        "Check your .env.local file against .env.example.",
    );
  }

  return result.data;
}

/**
 * Validated environment configuration. Import this instead of reading
 * `process.env` directly anywhere else in the codebase.
 */
export const env = parseEnv() as z.infer<typeof serverSchema> &
  z.infer<typeof clientSchema>;
