"use client";
import { User, Star, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "overview", label: "Overview", icon: User },
  { id: "reviews", label: "Review & Ratings", icon: Star },
  {
    id: "protocols",
    label: "Clinical Protocols & Verification",
    icon: ShieldCheck,
  },
];

export default function ProfileTabs({ activeTab = "overview" }) {
  return (
    <div className="flex items-center gap-8 border-b border-slate-200 bg-white px-8 rounded-lg">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={cn(
            "flex items-center gap-2 py-5 text-sm transition-all border-b-2",
            activeTab === tab.id
              ? "border-[#003366] text-[#003366]"
              : "border-transparent text-slate-400 hover:text-[#6B7280]",
          )}
        >
          <tab.icon className="size-4" />
          {tab.label}
        </button>
      ))}
    </div>
  );
}
