"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  User,
  BookOpen,
  ChevronRight,
  Sparkles,
  TrendingUp,
  ArrowRight,
  Clock,
} from "lucide-react";
import { cn } from "@/core/lib/utils";
import { apiClient } from "@/core/api/client";
import CustomSectionHeading from "@/features/shared/custom-section-heading";
import CustomDesText from "@/features/shared/custom-des-text";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string;
  author: string;
  category?: string;
  readTime?: string;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
}

const CATEGORIES = [
  "All Articles",
  "Dental Tourism Guides",
  "Cost & Savings",
  "Safety & Verification",
  "Procedure Guides",
];

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Articles");

  useEffect(() => {
    const loadBlogPosts = async () => {
      try {
        setLoading(true);
        const response = await apiClient.blogs.getPublished();
        const apiData = response?.data || response;
        if (Array.isArray(apiData)) {
          setPosts(apiData);
        } else {
          setPosts([]);
        }
      } catch {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    loadBlogPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.summary.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "All Articles" ||
        (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());

      return matchesSearch && matchesCategory;
    });
  }, [posts, search, selectedCategory]);

  const featuredPost = useMemo(() => {
    return filteredPosts[0] || null;
  }, [filteredPosts]);

  const gridPosts = useMemo(() => {
    return filteredPosts.slice(1);
  }, [filteredPosts]);

  return (
    <div className="bg-slate-50 flex-1 py-8 sm:py-12 px-4 sm:px-6 md:px-12 flex flex-col">
      <div className="max-w-400 w-full md:w-11/12 mx-auto space-y-8 sm:space-y-10 flex-1 flex flex-col">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
          <div className="space-y-2 max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-primary text-xs font-bold border border-border">
              <Sparkles className="size-3.5 text-accent shrink-0" />
              <span>RatedDocs Knowledge Hub</span>
            </div>
            <CustomSectionHeading value="Dental Tourism & Oral Health Resource Center" />
            <CustomDesText value="Vetted guides, transparent procedure pricing comparisons, and expert international dentist safety standards directly from our database." />
          </div>

          <div className="relative w-full md:w-80 shrink-0">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search database articles..."
              className="h-11 w-full rounded-xl border border-gray-200 pl-10 pr-4 text-xs sm:text-sm font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white shadow-xs"
            />
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1 w-full sm:w-auto">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer border",
                    selectedCategory === cat
                      ? "bg-primary text-white border-primary shadow-xs"
                      : "bg-white text-sec-text border-gray-200 hover:border-primary/40 hover:text-primary"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>


          </div>
        </div>

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 bg-white border border-border rounded-2xl">
            <div className="h-8 w-8 rounded-full border-4 border-slate-200 border-t-primary animate-spin mb-3" />
            <p className="text-xs text-slate-400 font-medium">Loading published articles from database...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-16 px-4 bg-white border border-border rounded-2xl text-sm font-medium text-gray-400 shadow-xs min-h-75 space-y-3">
            <BookOpen className="h-10 w-10 text-slate-300" />
            <p className="text-base text-text font-bold">No published blog posts found in database</p>
            <p className="text-xs text-sec-text">
              {search ? `No articles matching "${search}"` : "Articles published in the database will appear here."}
            </p>
            {search && (
              <button
                onClick={() => { setSearch(""); setSelectedCategory("All Articles"); }}
                className="mt-2 text-xs font-bold text-primary hover:underline cursor-pointer"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-12">
            {featuredPost && (
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="group grid grid-cols-1 lg:grid-cols-5 bg-white border border-border rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 relative"
              >
                <div className="lg:col-span-3 h-64 sm:h-80 md:h-96 relative bg-slate-100 overflow-hidden">
                  <img
                    src={featuredPost.coverImage || "/placeholder-blog.jpg"}
                    alt={featuredPost.title}
                    className="h-full w-full object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 bg-primary text-white text-xs font-bold rounded-full shadow-md">
                    <Sparkles className="h-3.5 w-3.5 text-accent" />
                    Featured Article
                  </div>
                </div>

                <div className="lg:col-span-2 p-6 sm:p-8 md:p-10 flex flex-col justify-between gap-6 text-left">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
                      {featuredPost.category && (
                        <span className="px-2.5 py-0.5 rounded-md bg-secondary text-primary font-bold">
                          {featuredPost.category}
                        </span>
                      )}
                      {featuredPost.readTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {featuredPost.readTime}
                        </span>
                      )}
                    </div>

                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-text leading-snug group-hover:text-primary transition-colors">
                      {featuredPost.title}
                    </h2>

                    <p className="text-sec-text text-xs sm:text-sm leading-relaxed line-clamp-3">
                      {featuredPost.summary}
                    </p>
                  </div>

                  <div className="flex justify-between items-center border-t border-slate-100 pt-5 mt-auto">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                        <User className="h-4.5 w-4.5 text-primary" />
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

                    <span className="flex items-center gap-1 text-primary text-xs sm:text-sm font-bold group-hover:translate-x-1 transition-transform">
                      Read Full Article
                      <ChevronRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            )}

            <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-[#0E3E65] via-[#113254] to-[#163E5C] p-6 sm:p-8 md:p-10 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-sky-200 text-xs font-bold backdrop-blur-xs">
                  <TrendingUp className="h-3.5 w-3.5 text-accent" />
                  Save Up to 70% on Dental Work
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                  Planning a Dental Trip Abroad?
                </h3>
                <p className="text-xs sm:text-sm text-sky-100 leading-relaxed">
                  Compare transparent pricing, verified clinic licenses, and real patient reviews across 500+ international dentists.
                </p>
              </div>

              <Link
                href="/find-dentists"
                className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-accent hover:bg-yellow-500 text-text font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <span>Compare Dentist Prices</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {gridPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {gridPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col bg-white border border-border rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300"
                  >
                    <div className="h-48 w-full bg-slate-100 overflow-hidden relative">
                      <img
                        src={post.coverImage || "/placeholder-blog.jpg"}
                        alt={post.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {post.category && (
                        <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-primary text-[11px] font-bold shadow-2xs">
                          {post.category}
                        </span>
                      )}
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between gap-5 text-left">
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium">
                          {post.readTime && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {post.readTime}
                            </span>
                          )}
                        </div>

                        <h3 className="font-bold text-base text-text group-hover:text-primary transition-colors leading-snug line-clamp-2">
                          {post.title}
                        </h3>

                        <p className="text-xs text-sec-text leading-relaxed line-clamp-3">
                          {post.summary}
                        </p>
                      </div>

                      <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-auto">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
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
