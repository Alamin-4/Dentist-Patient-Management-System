"use client";

import { useState, useRef, useEffect } from "react";
import { Shield, DollarSign, Megaphone, Globe, BookOpen, Mail, Newspaper, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { RdvScoreWeights } from "./components/rdv-score-weights";
import { PlatformFee } from "./components/platform-fee";
import { Announcements } from "./components/announcements";
import { GeneralSocials } from "./components/general-socials";
import { PoliciesEditor } from "./components/policies-editor";
import { ContactMessagesTable } from "./components/contact-messages-table";
import { BlogManager } from "./components/blog-manager";

type Section =
  | "rdv-weights"
  | "platform-fee"
  | "announcements"
  | "general-socials"
  | "policies-editor"
  | "blog-manager";

const NAV_ITEMS: { id: Section; icon: React.ReactNode; label: string; sub: string }[] = [
  {
    id: "policies-editor",
    icon: <BookOpen className="h-4 w-4" />,
    label: "Policies Editor",
    sub: "Privacy, Terms, & Cookie docs",
  },
  {
    id: "blog-manager",
    icon: <Newspaper className="h-4 w-4" />,
    label: "Blog Manager",
    sub: "Publish & edit articles",
  },
  {
    id: "general-socials",
    icon: <Globe className="h-4 w-4" />,
    label: "General & Socials",
    sub: "Branding, social profiles & contact info",
  },
  // {
  //   id: "contact-messages",
  //   icon: <Mail className="h-4 w-4" />,
  //   label: "Contact Messages",
  //   sub: "Inquiries from the website",
  // },
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
  const [active, setActive] = useState<Section>("policies-editor");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeItem = NAV_ITEMS.find((item) => item.id === active) || NAV_ITEMS[0];

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col gap-6 pb-8 text-slate-800">
      {/* Page header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-black tracking-tight text-[#1A1A2E]">Admin Settings & Content Manager</h1>
        <p className="mt-1 text-xs md:text-sm text-slate-500">
          Manage site content, legal policies, blog posts, general contact branding, and commission rates.
        </p>
      </div>

      {/* Two-column / Mobile Custom Dropdown layout */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">

        {/* Custom Styled Mobile Dropdown Selector (visible < lg) */}
        <div ref={dropdownRef} className="w-full lg:hidden relative z-20 space-y-1.5">
          <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block px-1">
            Navigation Menu
          </label>

          {/* Active Item Dropdown Trigger Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="flex w-full items-center justify-between rounded-xl bg-[#1A1A2E] text-white p-3 border border-[#1A1A2E] cursor-pointer transition-all active:scale-[0.99]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white">
                {activeItem.icon}
              </span>
              <div className="text-left min-w-0">
                <p className="text-xs font-bold truncate text-white">{activeItem.label}</p>
                <p className="text-[11px] truncate text-white/60">{activeItem.sub}</p>
              </div>
            </div>
            <ChevronDown
              className={cn("h-4 w-4 text-white/70 transition-transform duration-200 shrink-0 ml-2", isMobileMenuOpen && "rotate-180")}
            />
          </button>

          {/* Floating Dropdown Options Panel */}
          {isMobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 mt-1.5 rounded-xl border border-slate-200 bg-white p-2 shadow-lg animate-in fade-in-50 duration-150 z-50 max-h-80 overflow-y-auto">
              <div className="flex flex-col gap-1">
                {NAV_ITEMS.map((item) => {
                  const isSelected = item.id === active;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActive(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-all cursor-pointer",
                        isSelected
                          ? "bg-[#10436B]/10 text-[#10436B] font-bold"
                          : "text-slate-700 hover:bg-slate-50"
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={cn(
                            "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors",
                            isSelected ? "bg-[#10436B] text-white" : "bg-slate-100 text-[#10436B]"
                          )}
                        >
                          {item.icon}
                        </span>
                        <div className="min-w-0">
                          <p className={cn("text-xs truncate", isSelected ? "font-black text-[#10436B]" : "font-bold text-[#1A1A2E]")}>
                            {item.label}
                          </p>
                          <p className="text-[11px] truncate text-slate-400">{item.sub}</p>
                        </div>
                      </div>
                      {isSelected && <Check className="h-4 w-4 text-[#10436B] shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Desktop Sidebar Nav (visible lg and up) */}
        <aside className="hidden lg:block w-full shrink-0 rounded-xl border border-slate-200 bg-white p-3 lg:w-60 xl:w-64">
          <p className="mb-2.5 px-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            Navigation Menu
          </p>
          <nav className="flex flex-col gap-1.5">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all cursor-pointer border",
                  active === item.id
                    ? "bg-[#1A1A2E] text-white border-[#1A1A2E]"
                    : "text-slate-600 border-transparent hover:bg-slate-100/70"
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors",
                    active === item.id ? "bg-white/10 text-white" : "bg-slate-100 text-[#10436B]"
                  )}
                >
                  {item.icon}
                </span>
                <div className="min-w-0 text-left">
                  <p
                    className={cn(
                      "truncate text-xs font-bold",
                      active === item.id ? "text-white" : "text-[#1A1A2E]"
                    )}
                  >
                    {item.label}
                  </p>
                  <p
                    className={cn(
                      "truncate text-[11px]",
                      active === item.id ? "text-white/60" : "text-slate-400"
                    )}
                  >
                    {item.sub}
                  </p>
                </div>
              </button>
            ))}
          </nav>
        </aside>

        {/* Right Content Area */}
        <div className="flex-1 rounded-xl border border-slate-200 bg-white p-4 md:p-6 min-w-0">
          {active === "rdv-weights" && <RdvScoreWeights />}
          {active === "platform-fee" && <PlatformFee />}
          {active === "announcements" && <Announcements />}
          {active === "general-socials" && <GeneralSocials />}
          {active === "policies-editor" && <PoliciesEditor />}
          {/* {active === "contact-messages" && <ContactMessagesTable />} */}
          {active === "blog-manager" && <BlogManager />}
        </div>
      </div>
    </div>
  );
}
