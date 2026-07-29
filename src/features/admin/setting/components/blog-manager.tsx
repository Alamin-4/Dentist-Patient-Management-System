"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Edit3, Trash2, Globe, ArrowLeft, Image as ImageIcon } from "lucide-react";
import { RichDocumentEditor } from "@/components/ui/rich-document-editor";
import { blogPostSchema, type BlogPostFormValues } from "@/validation/settings-schemas";
import { bindServerErrors, useBlogPosts, useSaveBlogPost, useDeleteBlogPost } from "@/core/hooks/admin/settings/useAdminSettings";
import { cn } from "@/lib/utils";

/**
 * =============================================================================
 * INSTRUCTION: BLOG MANAGER WITH ZOD VALIDATION & FIELD ERROR DISPLAY
 * =============================================================================
 * - Form input fields use React Hook Form + Zod (`blogPostSchema`).
 * - Validation errors are displayed directly under each target input field in red text.
 * - API error responses bind to form fields via `bindServerErrors(err, setError)`.
 * =============================================================================
 */

interface BlogPost extends BlogPostFormValues {
  id: string;
  createdAt: string;
  publishedAt?: string;
}

export function BlogManager() {
  const [view, setView] = useState<"list" | "edit">("list");
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: posts = [], isLoading } = useBlogPosts();
  const savePostMutation = useSaveBlogPost();
  const deletePostMutation = useDeleteBlogPost();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    setError,
    formState: { errors },
  } = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: "",
      slug: "",
      summary: "",
      content: "",
      coverImage: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=60",
      author: "Admin Editor",
      isPublished: false,
    },
  });

  const contentValue = watch("content");
  const titleValue = watch("title");
  const isPublishedValue = watch("isPublished");

  const handleCreateNew = () => {
    setEditingId(null);
    reset({
      title: "",
      slug: "",
      summary: "",
      content: `<h1>Article Title</h1><p>Start writing article content here...</p><h2>1. Section Heading</h2><p>Enter detailed information.</p>`,
      coverImage: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=60",
      author: "Admin Editor",
      isPublished: false,
    });
    setView("edit");
  };

  const handleEdit = (post: BlogPost) => {
    setEditingId(post.id);
    reset({
      title: post.title,
      slug: post.slug,
      summary: post.summary,
      content: post.content,
      coverImage: post.coverImage,
      author: post.author,
      isPublished: post.isPublished,
    });
    setView("edit");
  };

  const onSubmit = async (data: BlogPostFormValues) => {
    try {
      await savePostMutation.mutateAsync({
        ...data,
        id: editingId,
      });
      setView("list");
      reset();
    } catch (err: any) {
      bindServerErrors(err, setError);
    }
  };

  if (view === "list") {
    return (
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-text">Blog Articles Manager</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Publish news, guides, clinical verification updates, and oral hygiene resources.
            </p>
          </div>

          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 rounded-lg bg-primary hover:bg-[#0d3656] text-white px-4 py-2 text-xs font-bold active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Create Article
          </button>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.length === 0 ? (
            <div className="col-span-2 text-center py-12 border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
              No blog articles created yet. Get started by clicking "Create Article".
            </div>
          ) : (
            posts.map((post: BlogPost) => (
              <div
                key={post.id}
                className="group border border-slate-200 bg-white rounded-xl overflow-hidden flex flex-col transition-colors hover:border-primary/40"
              >
                {/* Cover Image */}
                <div className="h-44 w-full bg-slate-100 overflow-hidden relative">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="h-full w-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                  <span
                    className={cn(
                      "absolute top-3 right-3 text-[10px] uppercase font-bold px-2 py-0.5 rounded-md border",
                      post.isPublished
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    )}
                  >
                    {post.isPublished ? "Published" : "Draft"}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="font-bold text-base text-text leading-snug line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">
                      By {post.author} &middot; {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {post.summary}
                    </p>
                  </div>

                  <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                    <button
                      onClick={() => handleEdit(post)}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                      title="Edit Article"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deletePostMutation.mutate(post.id)}
                      className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 transition-colors cursor-pointer"
                      title="Delete Article"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // Visual Edit / Create Article View with Form Errors
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* Back button header */}
      <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setView("list")}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-text cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Articles List
        </button>
      </div>

      {/* Global Form Validation Alerts */}
      {(errors.title || errors.content || errors.summary) && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 font-medium space-y-1">
          <p className="font-bold">Form contains errors:</p>
          {errors.title && <p>&bull; {errors.title.message}</p>}
          {errors.summary && <p>&bull; {errors.summary.message}</p>}
          {errors.content && <p>&bull; {errors.content.message}</p>}
        </div>
      )}

      {/* Article Configuration Sidebar & Editor */}
      <div className="flex flex-col xl:flex-row gap-6 items-start">

        {/* Sidebar settings */}
        <div className="w-full xl:w-72 shrink-0 rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Article Parameters
          </h4>

          {/* Excerpt */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-600">Summary / Excerpt</label>
            <textarea
              {...register("summary")}
              rows={3}
              placeholder="Short summary describing the article..."
              className={cn(
                "w-full rounded-lg border p-2.5 text-xs font-medium outline-none transition-colors bg-white resize-none",
                errors.summary ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-primary"
              )}
            />
            {errors.summary && (
              <p className="text-[11px] text-red-500 font-semibold">{errors.summary.message}</p>
            )}
          </div>

          {/* Author */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-600">Author Name</label>
            <input
              type="text"
              {...register("author")}
              placeholder="E.g. Dr. Alexander Cross"
              className={cn(
                "h-9 w-full rounded-lg border px-3 text-xs outline-none transition-colors bg-white",
                errors.author ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-primary"
              )}
            />
            {errors.author && (
              <p className="text-[11px] text-red-500 font-semibold">{errors.author.message}</p>
            )}
          </div>

          {/* Cover Image URL */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-600">Cover Image URL</label>
            <div className="relative">
              <input
                type="text"
                {...register("coverImage")}
                placeholder="https://images.unsplash.com/..."
                className={cn(
                  "h-9 w-full rounded-lg border pl-8 pr-3 text-xs outline-none transition-colors bg-white truncate",
                  errors.coverImage ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-primary"
                )}
              />
              <ImageIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            </div>
            {errors.coverImage && (
              <p className="text-[11px] text-red-500 font-semibold">{errors.coverImage.message}</p>
            )}
          </div>

          {/* Publish toggle */}
          <div className="flex items-center justify-between border-t border-slate-200 pt-4">
            <label className="text-xs font-bold text-slate-600">Publish Article</label>
            <button
              type="button"
              onClick={() => setValue("isPublished", !isPublishedValue)}
              className={cn(
                "w-9 h-5 rounded-full transition-all relative flex items-center px-0.5 cursor-pointer",
                isPublishedValue ? "bg-emerald-500" : "bg-slate-300"
              )}
            >
              <div
                className={cn(
                  "w-4 h-4 bg-white rounded-full transition-all",
                  isPublishedValue ? "translate-x-4" : "translate-x-0"
                )}
              />
            </button>
          </div>
        </div>

        {/* Rich Document Editor */}
        <div className="flex-1 w-full min-w-0">
          <RichDocumentEditor
            categoryName="BLOG MANAGER"
            title={titleValue}
            onTitleChange={(val) => setValue("title", val, { shouldValidate: true })}
            content={contentValue || ""}
            onChange={(val) => setValue("content", val, { shouldValidate: true })}
            onSave={handleSubmit(onSubmit)}
            isSaving={savePostMutation.isPending}
          />
        </div>

      </div>
    </form>
  );
}
