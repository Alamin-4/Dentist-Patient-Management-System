"use client";

import { cn } from "@/lib/utils";
import {
  User,
  Star,
  ShieldCheck,
  DollarSign,
  Package,
  ImageIcon,
} from "lucide-react";
import { useRef } from "react";

export type ProfileTab =
  | "overview"
  | "pricing"
  | "reviews"
  | "protocols"
  | "materials"
  | "results";

const tabs: { id: ProfileTab; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: User },
  { id: "pricing", label: "Pricing", icon: DollarSign },
  { id: "reviews", label: "Review & Ratings", icon: Star },
  { id: "protocols", label: "Clinical Protocols", icon: ShieldCheck },
  { id: "materials", label: "Materials", icon: Package },
  { id: "results", label: "Results", icon: ImageIcon },
];

interface ProfileTabsProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
}

export default function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
      <div
        ref={scrollRef}
        className="flex items-center gap-1 px-4 overflow-x-auto scrollbar-hide border-b border-slate-200"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex shrink-0 items-center gap-2 py-4 px-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap",
              activeTab === tab.id
                ? "border-[#003366] text-[#003366]"
                : "border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200",
            )}
          >
            <tab.icon className="size-4 shrink-0" />
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
