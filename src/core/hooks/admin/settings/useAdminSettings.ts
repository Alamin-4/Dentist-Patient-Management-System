import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormSetError, FieldValues, Path } from "react-hook-form";
import toast from "react-hot-toast";

/**
 * =============================================================================
 * API ERROR BINDING INSTRUCTION HELPER
 * =============================================================================
 * `bindServerErrors` inspects API error responses from Axios or backend services
 * and sets field-level errors on React Hook Form instances via `setError`.
 *
 * Backend Error Format Examples Handled:
 * 1. `{ errors: { email: "Email is taken", phone: "Invalid format" } }`
 * 2. `{ errors: [{ field: "email", message: "Email is taken" }] }`
 * 3. `{ message: "Generic fallback message" }`
 * =============================================================================
 */
export function bindServerErrors<TFieldValues extends FieldValues>(
  error: any,
  setError: UseFormSetError<TFieldValues>
) {
  const responseData = error?.response?.data;
  let hasSetField = false;

  if (responseData?.errors) {
    if (Array.isArray(responseData.errors)) {
      // Handles array format: [{ field: 'email', message: 'Invalid' }]
      responseData.errors.forEach((err: { field: string; message: string }) => {
        if (err.field && err.message) {
          setError(err.field as Path<TFieldValues>, {
            type: "server",
            message: err.message,
          });
          hasSetField = true;
        }
      });
    } else if (typeof responseData.errors === "object") {
      // Handles object format: { email: 'Invalid email' }
      Object.keys(responseData.errors).forEach((key) => {
        setError(key as Path<TFieldValues>, {
          type: "server",
          message: responseData.errors[key],
        });
        hasSetField = true;
      });
    }
  }

  // Display generic toast error if no specific field error was populated
  const message = responseData?.message || error?.message || "An unexpected error occurred.";
  if (!hasSetField) {
    toast.error(message);
  }
}

/**
 * =============================================================================
 * REACT QUERY HOOKS FOR ADMIN SETTINGS & CMS
 * =============================================================================
 */

// 1. Policies Hooks
export function usePolicies() {
  return useQuery({
    queryKey: ["admin-policies"],
    queryFn: async () => {
      const privacy = localStorage.getItem("policy_privacy") || "";
      const terms = localStorage.getItem("policy_terms") || "";
      const cookies = localStorage.getItem("policy_cookies") || "";
      return { privacy, terms, cookies };
    },
    staleTime: 1000 * 60,
  });
}

export function useSavePolicy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { type: "privacy" | "terms" | "cookies"; content: string }) => {
      await new Promise((r) => setTimeout(r, 400)); // Simulating API latency
      localStorage.setItem(`policy_${payload.type}`, payload.content);
      return payload;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-policies"] });
      toast.success(`${data.type.toUpperCase()} policy saved successfully.`);
    },
  });
}

// 2. Blog Posts Hooks
export function useBlogPosts() {
  return useQuery({
    queryKey: ["admin-blog-posts"],
    queryFn: async () => {
      const saved = localStorage.getItem("cms_blog_posts");
      return saved ? JSON.parse(saved) : [];
    },
    staleTime: 1000 * 30,
  });
}

export function useSaveBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postData: any) => {
      await new Promise((r) => setTimeout(r, 400));
      const saved = localStorage.getItem("cms_blog_posts");
      let posts = saved ? JSON.parse(saved) : [];

      let slug =
        postData.slug ||
        postData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

      if (postData.id) {
        posts = posts.map((p: any) => (p.id === postData.id ? { ...p, ...postData, slug } : p));
      } else {
        const newPost = {
          ...postData,
          id: `blog-${Date.now()}`,
          slug,
          createdAt: new Date().toISOString(),
        };
        posts = [newPost, ...posts];
      }

      localStorage.setItem("cms_blog_posts", JSON.stringify(posts));
      return posts;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      toast.success("Blog article saved successfully.");
    },
  });
}

export function useDeleteBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const saved = localStorage.getItem("cms_blog_posts");
      let posts = saved ? JSON.parse(saved) : [];
      posts = posts.filter((p: any) => p.id !== id);
      localStorage.setItem("cms_blog_posts", JSON.stringify(posts));
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      toast.success("Article deleted.");
    },
  });
}
