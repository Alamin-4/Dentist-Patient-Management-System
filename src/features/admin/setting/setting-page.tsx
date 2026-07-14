"use client";

import { useState } from "react";
import { Shield, DollarSign, Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";
import settingsData from "@/lib/settings-data";
import { RdvScoreWeights } from "./components/rdv-score-weights";
import { PlatformFee } from "./components/platform-fee";
import { Announcements } from "./components/announcements";

type Section = "rdv-weights" | "platform-fee" | "announcements";

const NAV_ITEMS: { id: Section; icon: React.ReactNode; label: string; sub: string }[] = [
  {
    id: "rdv-weights",
    icon: <Shield className="h-4 w-4" />,
    label: "RDV Score Weights",
    sub: "Score factor weights",
  },
  {
    id: "platform-fee",
    icon: <DollarSign className="h-4 w-4" />,
    label: "Platform Fee",
    sub: "Booking commission rate",
  },
  {
    id: "announcements",
    icon: <Megaphone className="h-4 w-4" />,
    label: "Announcements",
    sub: "Broadcast messages",
  },
];

export default function SettingPage() {
  const [active, setActive] = useState<Section>("rdv-weights");

  return (
    <div className="flex flex-col gap-5 pb-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#1A1A2E]">Settings</h1>
        <p className="mt-0.5 text-sm text-gray-500">
          Configure RDV scoring, platform fees and broadcast messages to users.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        {/* Left nav */}
        <aside className="w-full shrink-0 rounded-lg border border-gray-100 bg-white p-3 shadow-sm lg:w-56 xl:w-64">
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
            Configuration
          </p>
          <nav className="flex flex-col gap-1 sm:flex-row sm:flex-wrap lg:flex-col">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors sm:flex-1 lg:flex-none lg:w-full",
                  active === item.id
                    ? "bg-[#1A1A2E] text-white"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                    active === item.id ? "bg-white/10" : "bg-gray-100"
                  )}
                >
                  {item.icon}
                </span>
                <div className="min-w-0 text-left">
                  <p
                    className={cn(
                      "truncate text-sm font-semibold",
                      active === item.id ? "text-white" : "text-[#1A1A2E]"
                    )}
                  >
                    {item.label}
                  </p>
                  <p
                    className={cn(
                      "truncate text-xs",
                      active === item.id ? "text-white/60" : "text-gray-400"
                    )}
                  >
                    {item.sub}
                  </p>
                </div>
              </button>
            ))}
          </nav>
        </aside>

        {/* Right content */}
        <div className="flex-1 rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
          {active === "rdv-weights" && (
            <RdvScoreWeights initialWeights={settingsData.rdvWeights} />
          )}
          {active === "platform-fee" && (
            <PlatformFee initialFee={settingsData.platformFee} />
          )}
          {active === "announcements" && (
            <Announcements initialAnnouncements={settingsData.announcements} />
          )}
        </div>
      </div>
    </div>
  );
}
