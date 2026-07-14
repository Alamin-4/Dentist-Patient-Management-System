import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z
    .string()
    .min(1, "NEXT_PUBLIC_API_BASE_URL is required")
    .default("http://localhost:8000"),
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
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  NEXT_PUBLIC_COUNTRY_API_KEY: process.env.NEXT_PUBLIC_COUNTRY_API_KEY,
  NODE_ENV: process.env.NODE_ENV,
});

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.format());
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;
export type EnvSchema = z.infer<typeof envSchema>;
