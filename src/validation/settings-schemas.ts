import * as z from "zod";

/**
 * =============================================================================
 * INSTRUCTIONS FOR ZOD VALIDATION & API ERROR BINDING
 * =============================================================================
 * 1. Zod Schemas define front-end validation rules for every input field.
 * 2. Use `zodResolver(schema)` inside React Hook Form `useForm` hooks.
 * 3. In the UI, render field-specific error messages directly beneath the target input:
 *    `{errors.fieldName && <p className="text-xs text-red-500 font-medium">{errors.fieldName.message}</p>}`
 * 4. When an API call fails, pass the backend error to `bindServerErrors(error, setError)`
 *    to automatically populate server-side field validation errors into React Hook Form.
 * =============================================================================
 */

// 1. Policy Document Schema
export const policySchema = z.object({
  activeTab: z.enum(["privacy", "terms", "cookies"]),
  title: z.string().min(3, "Title must be at least 3 characters long."),
  content: z.string().min(10, "Document content must be at least 10 characters long."),
});
export type PolicyFormValues = z.infer<typeof policySchema>;

// 2. Blog Post Schema
export const blogPostSchema = z.object({
  title: z.string().min(3, "Article title must be at least 3 characters long."),
  slug: z.string().optional(),
  summary: z
    .string()
    .min(10, "Summary excerpt must be at least 10 characters long.")
    .max(300, "Summary excerpt cannot exceed 300 characters."),
  content: z.string().min(20, "Article content body must be at least 20 characters long."),
  coverImage: z.string().url("Please enter a valid cover image URL (e.g. https://images.unsplash.com/...)"),
  author: z.string().min(2, "Author name must be at least 2 characters long."),
  isPublished: z.boolean(),
});
export type BlogPostFormValues = z.infer<typeof blogPostSchema>;

// 3. General & Social Branding Schema
export const generalSocialsSchema = z.object({
  footerText: z
    .string()
    .min(10, "Footer tagline must be at least 10 characters long.")
    .max(250, "Footer tagline cannot exceed 250 characters."),
  email: z.string().email("Please enter a valid support email address."),
  phone: z.string().min(7, "Hotline phone must be at least 7 characters."),
  address: z.string().min(5, "Office address must be at least 5 characters."),
  facebook: z.string().url("Must be a valid URL").or(z.literal("")),
  twitter: z.string().url("Must be a valid URL").or(z.literal("")),
  instagram: z.string().url("Must be a valid URL").or(z.literal("")),
  linkedin: z.string().url("Must be a valid URL").or(z.literal("")),
});
export type GeneralSocialsFormValues = z.infer<typeof generalSocialsSchema>;

// 4. Platform Fee Schema
export const platformFeeSchema = z.object({
  rate: z
    .number({ message: "Fee rate must be a valid number." })
    .min(0, "Platform fee cannot be less than 0%.")
    .max(100, "Platform fee cannot exceed 100%."),
});
export type PlatformFeeFormValues = z.infer<typeof platformFeeSchema>;

// 5. Platform Announcement Schema
export type AnnouncementAudience = "all" | "patients" | "dentists";

export const announcementSchema = z.object({
  title: z.string().min(3, "Announcement title must be at least 3 characters long."),
  message: z.string().min(10, "Announcement message must be at least 10 characters long."),
  audience: z.enum(["all", "patients", "dentists"], {
    message: "Please select a target audience.",
  }),
});
export type AnnouncementFormValues = z.infer<typeof announcementSchema>;
