"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, User, Calendar, BookOpen, Clock } from "lucide-react";

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
    content: `<h1>How Escrow Payment Guarantees Confident Patient Bookings</h1><p>Last updated: July 23, 2026</p><h2>Why Patient Confidence Matters</h2><p>In medical travel and private dental care, patients face enormous anxiety concerning billing and clinical quality. Escrow bridges this gap.</p><h2>The Surprise Guarantee Structure</h2><p>When patients book consultations on RatedDocs, their payments are held securely in escrow. Payouts are not released to the dentist until:</p><ul><li>The consultation is marked active and completed.</li><li>A signed treatment contract is uploaded and validated.</li></ul><h2>Long-Term Accountability</h2><p>By maintaining escrow release metrics, RatedDocs aligns dentist incentives directly with clinical excellence.</p>`,
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
    content: `<h1>Understanding Dentist Verification Progress</h1><p>Last updated: July 23, 2026</p><h2>Phase 1: License Verification</h2><p>We cross-verify dental registries across multiple states to confirm active practice credentials.</p><h2>Phase 2: Operations Check</h2><p>Clinics must upload sterilization checklists and device logs.</p><h2>Phase 3: Clinic Depth & RDV</h2><p>We calculate an objective score based on actual patient feedback.</p>`,
    coverImage: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=60",
    author: "Audit Committee",
    isPublished: true,
    publishedAt: "2026-07-18T12:30:00Z",
    createdAt: "2026-07-18T12:30:00Z",
  },
];

export default function BlogPostPage() {
  const { slug } = useParams() as { slug: string };
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("cms_blog_posts");
    let blogList = DEFAULT_POSTS;
    if (saved) {
      try {
        blogList = JSON.parse(saved);
      } catch (e) {}
    }

    const matched = blogList.find((p) => p.slug === slug);
    if (matched) {
      setPost(matched);
    }
    setLoading(false);
  }, [slug]);

  const wordCount = useMemo(() => {
    if (!post?.content) return 0;
    const cleanText = post.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    return cleanText ? cleanText.split(" ").filter(Boolean).length : 0;
  }, [post?.content]);

  const readTime = useMemo(() => {
    const mins = Math.ceil(wordCount / 200);
    return mins > 0 ? mins : 1;
  }, [wordCount]);

  const isHtml = post?.content ? /<[a-z][\s\S]*>/i.test(post.content) : false;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="h-8 w-8 rounded-full border-4 border-slate-200 border-t-[#10436B] animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <h2 className="text-xl font-bold text-slate-800">Article not found</h2>
        <p className="text-slate-400 text-xs mt-2 mb-6">The article you are trying to view does not exist or has been archived.</p>
        <Link
          href="/blog"
          className="flex items-center gap-1.5 px-5 py-2.5 bg-[#10436B] text-white font-bold text-xs rounded-lg hover:bg-[#0d3656] transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Resource Center
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-16 px-6 md:px-12 text-left">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Navigation */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#10436B] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Resource Center
        </Link>

        {/* Cover Image */}
        <div className="w-full h-64 sm:h-[380px] rounded-3xl overflow-hidden border border-[#CEE0F4] relative bg-slate-200">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Container Card */}
        <div className="bg-white border border-[#CEE0F4] rounded-3xl p-6 md:p-12 space-y-8">
          
          {/* Header Metadata */}
          <div className="border-b border-slate-100 pb-6 space-y-4">
            <h1 className="text-3xl md:text-4xl font-black text-[#1A1A2E] tracking-tight leading-snug">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Author details */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#10436B]/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-[#10436B]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1A1A2E]">{post.author}</p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Read stats details */}
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200/60">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4 text-[#10436B]" />
                  {wordCount} words
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-[#10436B]" />
                  {readTime} min read
                </span>
              </div>
            </div>
          </div>

          {/* Excerpt */}
          <p className="text-[#10436B] font-bold text-sm leading-relaxed bg-[#F4F9FD] p-4 border-l-4 border-[#10436B] rounded-r-xl">
            {post.summary}
          </p>

          {/* Document Content Parser */}
          {isHtml ? (
            <div
              className="blog-rendered-content prose prose-slate max-w-none text-[#1A1A2E] text-[15px] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          ) : (
            <div className="prose prose-slate max-w-none text-[#1A1A2E] text-[15px] leading-relaxed">
              {post.content.split("\n").map((line, idx) => {
                if (line.startsWith("# ")) return null;
                if (line.startsWith("## ")) {
                  return (
                    <h2
                      key={idx}
                      className="text-xl font-bold text-[#1A1A2E] mt-8 mb-4 border-b pb-1.5 border-slate-100"
                    >
                      {line.replace("## ", "")}
                    </h2>
                  );
                }
                if (line.startsWith("### ")) {
                  return (
                    <h3
                      key={idx}
                      className="text-lg font-bold text-[#10436B] mt-6 mb-3"
                    >
                      {line.replace("### ", "")}
                    </h3>
                  );
                }
                if (line.startsWith("> ")) {
                  return (
                    <blockquote
                      key={idx}
                      className="border-l-4 border-[#E3A32A] bg-amber-50/40 px-5 py-3 my-4 rounded-r-xl text-slate-600 italic"
                    >
                      {line.replace("> ", "")}
                    </blockquote>
                  );
                }
                if (line.trim() === "") return <div key={idx} className="h-3" />;
                return (
                  <p key={idx} className="mb-4 text-slate-600">
                    {line}
                  </p>
                );
              })}
            </div>
          )}

        </div>

      </div>

      <style jsx global>{`
        .blog-rendered-content h1 {
          font-size: 1.85rem;
          font-weight: 900;
          color: #1a1a2e;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .blog-rendered-content h2 {
          font-size: 1.35rem;
          font-weight: 800;
          color: #1a1a2e;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 0.35rem;
        }
        .blog-rendered-content h3 {
          font-size: 1.15rem;
          font-weight: 700;
          color: #10436b;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
        }
        .blog-rendered-content p {
          margin-bottom: 1rem;
          line-height: 1.7;
          color: #475569;
        }
        .blog-rendered-content blockquote {
          border-left: 4px solid #e3a32a;
          background-color: #fefce8;
          padding: 0.75rem 1.25rem;
          margin: 1rem 0;
          font-style: italic;
          border-radius: 0 0.5rem 0.5rem 0;
          color: #475569;
        }
        .blog-rendered-content ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .blog-rendered-content ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
}
