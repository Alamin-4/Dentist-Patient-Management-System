"use client";

import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import Navbar from "@/app/(marketing)/_components/shared/navbar/Navbar";
import Footer from "@/app/(marketing)/_components/shared/footer/footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-16 sm:py-24">
        {/* Background blobs */}
        <div className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-pink-100/70 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-0 h-80 w-80 rounded-full bg-blue-100/60 blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-1/3 h-56 w-56 -translate-x-1/2 rounded-full bg-indigo-50/50 blur-2xl" />

        {/* Illustration */}
        <div className="relative mb-10 flex items-center justify-center select-none">
          {/* Ghost "404" backdrop */}
          <span className="text-[120px] sm:text-[160px] lg:text-[200px] font-black leading-none tracking-tighter text-slate-100">
            404
          </span>

          {/* Magnifying glass overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              viewBox="0 0 220 220"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-36 h-36 sm:w-44 sm:h-44 drop-shadow-xl"
              aria-hidden="true"
            >
              {/* Glass circle */}
              <circle cx="92" cy="92" r="72" fill="white" stroke="#DC2626" strokeWidth="12" />
              {/* 404 inside glass */}
              <text
                x="92"
                y="104"
                textAnchor="middle"
                fontSize="38"
                fontWeight="800"
                fill="#1A1A2E"
                fontFamily="system-ui, sans-serif"
                letterSpacing="-1"
              >
                404
              </text>
              {/* Handle */}
              <line
                x1="148"
                y1="148"
                x2="200"
                y2="200"
                stroke="#1A1A1A"
                strokeWidth="16"
                strokeLinecap="round"
              />
              {/* Decorative dots */}
              <circle cx="38" cy="50" r="5" fill="#10436B" opacity="0.3" />
              <circle cx="160" cy="30" r="3.5" fill="#E3A32A" opacity="0.5" />
              <circle cx="20" cy="130" r="4" fill="#DC2626" opacity="0.25" />
            </svg>
          </div>

          {/* Floating decorative leaves */}
          <svg
            viewBox="0 0 80 80"
            className="absolute -top-2 left-1/2 -translate-x-4 w-10 h-10 opacity-70"
            aria-hidden="true"
          >
            <ellipse cx="30" cy="50" rx="22" ry="12" fill="#4ADE80" transform="rotate(-40 30 50)" />
            <ellipse cx="50" cy="30" rx="18" ry="10" fill="#86EFAC" transform="rotate(-60 50 30)" />
          </svg>
        </div>

        {/* Heading & sub-text */}
        <div className="relative z-10 max-w-md space-y-3 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Page not found
          </h1>
          <p className="text-base leading-relaxed text-gray-500">
            Sorry, the page you are looking for doesn&apos;t exist. It may have
            moved, been deleted, or the URL is incorrect.
          </p>
        </div>

        {/* CTA buttons */}
        <div className="relative z-10 mt-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-7 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 active:scale-[0.97] sm:w-auto"
          >
            <ArrowLeft className="size-4" />
            Go back
          </button>

          <Link
            href="/find-dentist"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#10436B] px-7 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-[#0d3558] active:scale-[0.97] sm:w-auto"
          >
            <Search className="size-4" />
            Find Verified Dentist
          </Link>
        </div>

        {/* Trust badge */}
        <div className="relative z-10 mt-10 flex items-center gap-2 rounded-full border border-slate-100 bg-white px-4 py-2 text-xs text-slate-400 shadow-sm">
          <span className="size-2 rounded-full bg-emerald-400" />
          RatedDocs — Find Verified Dental Professionals
        </div>
      </main>

      <Footer />
    </div>
  );
}
