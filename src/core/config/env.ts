import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z
    .string()
    .min(1, "NEXT_PUBLIC_API_BASE_URL is required")
    .default("https://api.mvp.rateddocs.com"),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z
    .string()
    .default("https://us.i.posthog.com"),
  NEXT_PUBLIC_COUNTRY_API_KEY: z
    .string()
    .default("D34fM2jYjG3PtnTlgAmEP4tHEqwtSsKnbJ4EkHTb"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || undefined,
  NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY || undefined,
  NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST || undefined,
  NEXT_PUBLIC_COUNTRY_API_KEY: process.env.NEXT_PUBLIC_COUNTRY_API_KEY || undefined,
  NODE_ENV: process.env.NODE_ENV || undefined,
});

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.format());
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;
export type EnvSchema = z.infer<typeof envSchema>;
