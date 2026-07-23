"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Search, Calendar, User, BookOpen, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

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

const DEFAULT_POSTS: BlogPost[] = [
  {
    id: "blog-1",
    title: "How Escrow Payment Guarantees Confident Patient Bookings",
    slug: "how-escrow-payment-guarantees-confident-bookings",
    summary: "Understand how Escrow keeps patient money safe and guarantees that dentist clinics deliver on their promised treatment plans.",
    content: ``,
    coverImage: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=60",
    author: "Dr. Alexander Cross",
    isPublished: true,
    publishedAt: "2026-07-20T08:00:00Z",
    createdAt: "2026-07-20T08:00:00Z",
  },
  {
    id: "blog-2",
    title: "Understanding the Dentist Licensing & Verification Progress",
    slug: "understanding-dentist-licensing-verification-progress",
    summary: "A deep dive into our multi-phase verification queue structure: license validations, operations checks, and clinical depth scoring.",
    content: ``,
    coverImage: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=60",
    author: "Audit Committee",
    isPublished: true,
    publishedAt: "2026-07-18T12:30:00Z",
    createdAt: "2026-07-18T12:30:00Z",
  },
];

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("cms_blog_posts");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Only show published articles in marketing view
        setPosts(parsed.filter((p: BlogPost) => p.isPublished));
      } catch (e) {
        setPosts(DEFAULT_POSTS);
      }
    } else {
      setPosts(DEFAULT_POSTS);
    }
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
    <div className="bg-slate-50 min-h-screen py-16 px-6 md:px-12">
      <div className="max-w-400 w-11/12 mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
          <div className="space-y-2 max-w-xl text-left">
            <h1 className="text-4xl font-black text-[#10436B] tracking-tight">RatedDocs Resource Center</h1>
            <p className="text-gray-500 text-lg leading-relaxed">
              Read vetted oral hygiene guidelines, verification procedures, and patient safety insights.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="h-10 w-full rounded-lg border border-gray-200 pl-10 pr-4 text-sm font-semibold outline-none focus:border-[#10436B] focus:ring-1 focus:ring-[#10436B] bg-white"
            />
            <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-gray-400" />
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-24 bg-white border border-[#CEE0F4] rounded-3xl text-gray-400 shadow-xs">
            No articles found matching "{search}".
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* Featured Post (1 Col Hero Banner) */}
            {featuredPost && (
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="group grid grid-cols-1 lg:grid-cols-5 bg-white border border-[#CEE0F4] rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-300"
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
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F4F9FD] text-[#10436B] text-xs font-bold rounded-full">
                      Featured Article
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-[#1A1A2E] leading-snug group-hover:text-[#10436B] transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                      {featuredPost.summary}
                    </p>
                  </div>

                  <div className="flex justify-between items-center border-t border-slate-100 pt-5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#10436B]/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-[#10436B]" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#1A1A2E]">{featuredPost.author}</p>
                        <p className="text-[10px] text-gray-400 font-medium">
                          {new Date(featuredPost.publishedAt || featuredPost.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    <span className="flex items-center gap-1 text-[#10436B] text-xs font-bold group-hover:translate-x-1 transition-transform">
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
                    className="group flex flex-col bg-white border border-[#CEE0F4] rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300"
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
                        <h3 className="font-bold text-base text-[#1A1A2E] group-hover:text-[#10436B] transition-colors leading-snug line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                          {post.summary}
                        </p>
                      </div>

                      <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-auto">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#10436B]/5 flex items-center justify-center">
                            <User className="h-3.5 w-3.5 text-[#10436B]" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-[#1A1A2E]">{post.author}</p>
                            <p className="text-[9px] text-gray-400">
                              {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <span className="flex items-center gap-0.5 text-xs font-bold text-[#10436B] group-hover:translate-x-0.5 transition-transform">
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
