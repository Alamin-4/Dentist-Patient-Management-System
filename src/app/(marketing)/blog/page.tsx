"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Search, Calendar, User, BookOpen, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiClient } from "@/core/api/client";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string;
  author: string;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
}

import CustomSectionHeading from "@/features/shared/custom-section-heading";
import CustomDesText from "@/features/shared/custom-des-text";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadBlogPosts = async () => {
      try {
        const response = await apiClient.blogs.getPublished();
        if (response?.data) {
          setPosts(response.data);
        }
      } catch (e) {
        console.error("Error loading blog posts from database:", e);
      }
    };

    loadBlogPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));
  }, [posts, search]);

  const featuredPost = useMemo(() => {
    return filteredPosts[0] || null;
  }, [filteredPosts]);

  const gridPosts = useMemo(() => {
    return filteredPosts.slice(1);
  }, [filteredPosts]);

  return (
    <div className="bg-slate-50 flex-1 py-6 sm:py-10 md:py-12 px-4 sm:px-6 md:px-12 flex flex-col">
      <div className="max-w-400 w-full md:w-11/12 mx-auto space-y-6 sm:space-y-8 lg:space-y-10 flex-1 flex flex-col">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 border-b border-slate-200 pb-6 sm:pb-8">
          <div className="space-y-1.5 max-w-xl text-left">
            <CustomSectionHeading value="RatedDocs Resource Center" />
            <CustomDesText value="Read vetted oral hygiene guidelines, verification procedures, and patient safety insights." />
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="h-10 w-full rounded-lg border border-gray-200 pl-10 pr-4 text-sm font-semibold outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white"
            />
            <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-gray-400" />
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-10 sm:py-16 px-4 bg-white border border-border rounded-2xl text-sm font-medium text-gray-400 shadow-xs min-h-[250px]">
            No articles found matching "{search}".
          </div>
        ) : (
          <div className="space-y-12">

            {/* Featured Post (1 Col Hero Banner) */}
            {featuredPost && (
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="group grid grid-cols-1 lg:grid-cols-5 bg-white border border-border rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="lg:col-span-3 h-64 sm:h-96 relative bg-slate-100 overflow-hidden">
                  <img
                    src={featuredPost.coverImage}
                    alt={featuredPost.title}
                    className="h-full w-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                </div>

                <div className="lg:col-span-2 p-6 md:p-10 flex flex-col justify-between gap-6 text-left">
                  <div className="space-y-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F4F9FD] text-primary text-xs font-bold rounded-full">
                      Featured Article
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-text leading-snug group-hover:text-primary transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                      {featuredPost.summary}
                    </p>
                  </div>

                  <div className="flex justify-between items-center border-t border-slate-100 pt-5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-text">{featuredPost.author}</p>
                        <p className="text-[10px] text-gray-400 font-medium">
                          {new Date(featuredPost.publishedAt || featuredPost.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    <span className="flex items-center gap-1 text-primary text-xs font-bold group-hover:translate-x-1 transition-transform">
                      Read Article
                      <ChevronRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {/* Grid Posts */}
            {gridPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {gridPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col bg-white border border-border rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300"
                  >
                    <div className="h-48 w-full bg-slate-100 overflow-hidden relative">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between gap-5 text-left">
                      <div className="space-y-3">
                        <h3 className="font-bold text-base text-text group-hover:text-primary transition-colors leading-snug line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                          {post.summary}
                        </p>
                      </div>

                      <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-auto">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary/5 flex items-center justify-center">
                            <User className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-text">{post.author}</p>
                            <p className="text-[9px] text-gray-400">
                              {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <span className="flex items-center gap-0.5 text-xs font-bold text-primary group-hover:translate-x-0.5 transition-transform">
                          Read
                          <ChevronRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
