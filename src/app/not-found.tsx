"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Home,
  Search,
  UserPlus,
  ChevronRight,
  FileQuestion,
} from "lucide-react";
import { cn } from "@/lib/utils";

const QUICK_LINKS: {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  label: string;
  desc: string;
  href?: string;
  isBack?: boolean;
}[] = [
  {
    icon: ArrowLeft,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-500",
    label: "Go Back",
    desc: "Return to the previous page",
    isBack: true,
  },
  {
    icon: Home,
    iconBg: "bg-[#EEF8FF]",
    iconColor: "text-[#10436B]",
    label: "Home",
    desc: "Back to the main page",
    href: "/",
  },
  {
    icon: Search,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    label: "Find a Dentist",
    desc: "Browse verified professionals",
    href: "/find-dentist",
  },
  {
    icon: UserPlus,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
    label: "Join as a Doctor",
    desc: "List your dental practice",
    href: "/register-doctor",
  },
];

function QuickLinkCard({
  item,
}: {
  item: (typeof QUICK_LINKS)[number];
}) {
  const Icon = item.icon;

  const inner = (
    <div className="flex items-center gap-3 group-hover:[&_.arrow]:translate-x-0.5">
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105",
          item.iconBg
        )}
      >
        <Icon className={cn("size-4.5", item.iconColor)} />
      </div>
      <div className="min-w-0 flex-1 text-left">
        <p className="text-sm font-bold text-slate-800 group-hover:text-[#10436B] transition-colors">
          {item.label}
        </p>
        <p className="text-xs text-slate-400">{item.desc}</p>
      </div>
      <ChevronRight className="arrow size-4 shrink-0 text-slate-300 transition-all group-hover:text-[#10436B]" />
    </div>
  );

  const baseClass =
    "group block w-full rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3 transition-all hover:border-[#10436B]/25 hover:bg-[#EEF8FF] hover:shadow-sm active:scale-[0.98]";

  if (item.isBack) {
    return (
      <button onClick={() => window.history.back()} className={baseClass}>
        {inner}
      </button>
    );
  }

  return (
    <Link href={item.href!} className={baseClass}>
      {inner}
    </Link>
  );
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Minimal Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/90 py-4 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl w-11/12 items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/logos/mainlogo.png"
              alt="RatedDocs"
              height={200}
              width={400}
              className="w-32 h-auto object-contain"
            />
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl bg-[#10436B] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#0d3558] active:scale-95 transition-all"
          >
            <Home className="size-4" />
            Go Home
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
        {/* Illustration */}
        <div className="relative mb-10 flex items-center justify-center select-none">
          <span className="text-[130px] sm:text-[170px] lg:text-[210px] font-black leading-none tracking-tighter text-[#E8F0FA]">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-slate-100">
              <FileQuestion className="size-9 sm:size-11 text-[#10436B]" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Copy */}
        <div className="text-center max-w-md space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1A1A2E]">
            Page not found
          </h1>
          <p className="text-base text-[#6B7280] leading-relaxed">
            Sorry, we couldn&apos;t find what you were looking for. The page may
            have moved, been deleted, or the link might be wrong.
          </p>
        </div>

        {/* Primary CTA */}
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#10436B] px-7 py-3 text-sm font-bold text-white shadow-md hover:bg-[#0d3558] active:scale-95 transition-all"
        >
          <Home className="size-4" />
          Back to Home
        </Link>

        {/* Quick links card */}
        <div className="mt-10 w-full max-w-sm">
          <p className="mb-3 text-center text-[11px] font-bold uppercase tracking-widest text-slate-400">
            Or try one of these
          </p>
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm space-y-1.5">
            {QUICK_LINKS.map((item) => (
              <QuickLinkCard key={item.label} item={item} />
            ))}
          </div>
        </div>

        {/* Branding pill */}
        <div className="mt-10 flex items-center gap-2 rounded-full border border-slate-100 bg-white px-4 py-2 text-xs text-slate-400 shadow-sm">
          <span className="size-2 rounded-full bg-emerald-400" />
          RatedDocs — Find Verified Dental Professionals
        </div>
      </main>
    </div>
  );
}
