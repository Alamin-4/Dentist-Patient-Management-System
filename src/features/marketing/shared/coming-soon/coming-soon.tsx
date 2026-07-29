"use client";

import Link from "next/link";
import { ArrowLeft, Search, CalendarDays } from "lucide-react";

interface ComingSoonProps {
  title: string;
  description: string;
}

export default function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <section className="relative w-full bg-white overflow-hidden py-24 md:py-32 flex items-center justify-center min-h-[70vh]">
      {/* Background Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-blue-50/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-75 h-75 bg-amber-50/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-2xl w-11/12 text-center space-y-8">
        {/* Simple Icon Badge */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 border border-amber-100 text-[#E3A32A]">
          <CalendarDays className="w-8 h-8" />
        </div>

        <div className="space-y-4 max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#E3A32A]">
            Coming Soon
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-text tracking-tight leading-tight">
            {title}
          </h1>
          <p className="text-base text-gray-500 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 max-w-md mx-auto">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full sm:w-auto rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 active:scale-[0.97]"
          >
            <ArrowLeft className="w-4 h-4 text-gray-500" />
            Go to Homepage
          </Link>
          <Link
            href="/find-dentists"
            className="flex items-center justify-center gap-2 w-full sm:w-auto rounded-xl bg-primary hover:bg-[#0d3558] px-6 py-3 text-sm font-bold text-white shadow-md shadow-primary/10 transition-all active:scale-[0.97]"
          >
            <Search className="w-4 h-4" />
            Find Verified Dentist
          </Link>
        </div>
      </div>
    </section>
  );
}
