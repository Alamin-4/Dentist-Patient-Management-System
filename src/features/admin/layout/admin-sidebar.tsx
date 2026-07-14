"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Globe,
  Star,
  ShieldCheck,
  ShieldAlert,
  X,
  Stethoscope,
  CreditCard,
  Bell,
  type LucideIcon,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/context/sidebar-context";

interface NavItem {
  icon: LucideIcon;
  label: string;
  href: string;
  badge?: number;
}

interface NavGroup {
  label?: string;
  items: NavItem[];
}

const adminNav: NavGroup[] = [
  {
    label: "OVERVIEW",
    items: [{ icon: LayoutDashboard, label: "Dashboard", href: "/admin" }],
  },
  {
    label: "PRACTICE",
    items: [
      { icon: Stethoscope, label: "Dentists", href: "/admin/dentists" },
      { icon: Users, label: "Patients", href: "/admin/patients" },
      { icon: Calendar, label: "Bookings", href: "/admin/bookings" },
      {
        icon: ShieldCheck,
        label: "Verification Queue",
        href: "/admin/verification-queue",
        badge: 0,
      },
      {
        icon: Stethoscope,
        label: "Specialty",
        href: "/admin/specialty",
      },
      {
        icon: Stethoscope,
        label: "Procedures",
        href: "/admin/procedures",
      }
    ],
  },
  {
    label: "ENGAGEMENT",
    items: [
      { icon: Star, label: "Reviews & Ratings", href: "/admin/reviews" },
      { icon: Bell, label: "Notifications", href: "/admin/notifications" },
    ],
  },
  {
    label: "FINANCE",
    items: [
      {
        icon: CreditCard,
        label: "Payments & Escrow",
        href: "/admin/payments",
      },
      { icon: BarChart3, label: "Reports", href: "/admin/reports" },
    ],
  },
  {
    label: "DIRECTORY",
    items: [
      { icon: Globe, label: "KOL Management", href: "/admin/kol-management" },
    ],
  },
  {
    label: "TRUST & SAFETY",
    items: [
      {
        icon: ShieldAlert,
        label: "Anti-Collusion",
        href: "/admin/anti-collusion",
        badge: 7,
      },
      {
        icon: Globe,
        label: "SEO Review Pages",
        href: "/admin/seo-review-pages",
        badge: 4,
      },
    ],
  },
  {
    label: "SYSTEM",
    items: [{ icon: Settings, label: "Settings", href: "/admin/settings" }],
  },
];

const ADMIN_ROOT = "/admin";

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { close } = useSidebar();

  function isActive(href: string) {
    if (href === ADMIN_ROOT) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  }

  function handleLogout() {
    router.push("/admin-login");
    close();
  }

  return (
    <aside className="flex h-full w-72 flex-col bg-[#0D2B3E]">
      {/* Logo header */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C9963F] shrink-0">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-4 w-4 text-white"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                d="M22 12h-4l-3 9L9 3l-3 9H2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="leading-tight">
            <p className="text-[13px] font-bold text-white tracking-tight">
              RatedDocs
            </p>
          </div>
        </div>

        {/* Mobile close */}
        <button
          onClick={close}
          aria-label="Close sidebar"
          className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-white/10 hover:text-white transition-colors lg:hidden"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav
        className={cn(
          "flex-1 overflow-y-auto px-3 py-4",
          // Custom scrollbar — tuned for dark navy sidebar
          "[&::-webkit-scrollbar]:w-1",
          "[&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-white/4",
          "[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/18",
          "[&::-webkit-scrollbar-thumb]:transition-colors",
          "[&::-webkit-scrollbar-thumb:hover]:bg-white/32",
          // Firefox
          "scrollbar-thin scrollbar-track-transparent",
        )}
      >
        {adminNav.map((group, gi) => (
          <div key={gi} className={cn(gi > 0 && "mt-5")}>
            {group.label && (
              <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={close}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                      active
                        ? "bg-white/15 text-white"
                        : "text-slate-400 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    <item.icon className="h-[18px] w-[18px] shrink-0" />
                    <span className="flex-1 truncate text-[13px]">
                      {item.label}
                    </span>
                    {item.badge !== undefined && (
                      <span
                        className={cn(
                          "flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-semibold",
                          active
                            ? "bg-white text-[#0D2B3E]"
                            : "bg-white/20 text-white",
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="shrink-0 flex flex-row items-center justify-between border-t border-white/10 p-3">
        <div className="flex items-center gap-3 px-2 py-2 mb-1 rounded-lg">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-[#1a4a6b] text-white text-xs font-bold">
              JS
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-white truncate leading-tight">
              Jordan Smith
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
              <p className="text-[11px] text-slate-400">Admin</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
        </button>
      </div>
    </aside>
  );
}
