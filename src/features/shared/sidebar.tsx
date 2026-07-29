"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import useAuth, { useMe } from "@/hooks/auth/useAuth";
import {
  LayoutDashboard,
  User,
  Calendar,
  CalendarDays,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Video,
  Search,
  FolderOpen,
  Activity,
  Plane,
  Tag,
  Share2,
  X,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

const patientNav: NavGroup[] = [
  {
    items: [
      { icon: LayoutDashboard, label: "Overview", href: "/patient" },
      {
        icon: Search,
        label: "Find Verified Dentist",
        href: "/patient/find-dentists",
      },
      { icon: CalendarDays, label: "My Bookings", href: "/patient/bookings" },
      { icon: FolderOpen, label: "Document Vault", href: "/patient/documents" },
      { icon: MessageSquare, label: "Messages", href: "/patient/messages" },
      { icon: Activity, label: "My Results", href: "/patient/results" },
      { icon: Users, label: "Referrals", href: "/patient/referrals" },
      {
        icon: Plane,
        label: "Travel Checklist",
        href: "/patient/travel-checklist",
      },
      {
        icon: Settings,
        label: "Profile & Settings",
        href: "/patient/settings",
      },
    ],
  },
];

const dentistNav: NavGroup[] = [
  {
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/dentist" },
      { icon: User, label: "Profile", href: "/dentist/profile" },
      {
        icon: Tag,
        label: "Pricing Protocols",
        href: "/dentist/pricing-protocols",
      },
      { icon: Video, label: "Consultations", href: "/dentist/consultations" },
      { icon: MessageSquare, label: "Messages", href: "/dentist/messages" },
      { icon: Calendar, label: "Bookings", href: "/dentist/bookings" },
      { icon: Users, label: "Patients", href: "/dentist/patients" },
      { icon: BarChart3, label: "Results", href: "/dentist/results" },
      { icon: Share2, label: "Referrals", href: "/dentist/referrals" },
      { icon: Settings, label: "Settings", href: "/dentist/settings" },
    ],
  },
];

const DASHBOARD_ROOTS = ["/dentist", "/patient"];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { close } = useSidebar();
  const { logoutMutation } = useAuth();
  const { mutate: logout } = logoutMutation;
  const { user } = useMe();

  const displayName = user?.name || user?.email?.split("@")[0] || "User";
  const initials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : "US";

  const handleLogout = () => {
    logout();
    router.push("/");
    close();
  };

  const isVerificationPath = pathname === "/dentist/verification";

  if (isVerificationPath) {
    return null;
  }

  const role = pathname.startsWith("/dentist") ? "dentist" : "patient";
  const navGroups = role === "dentist" ? dentistNav : patientNav;

  function isActive(href: string) {
    if (DASHBOARD_ROOTS.includes(href)) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <aside className="flex h-full w-64 flex-col pt-4 bg-white">
      <div className="flex items-center justify-end px-4 pt-4 pb-2 lg:hidden">
        <button
          onClick={close}
          aria-label="Close sidebar"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
        {navGroups.map((group, gi) => (
          <div key={gi} className={cn(gi > 0 && "mt-4", "space-y-3")}>
            {group.label && (
              <p className="mb-1 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                {group.label}
              </p>
            )}
            {group.items.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={close}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-[#163E5C] text-white"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon className="h-4.5 w-4.5 shrink-0" />
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={cn(
                        "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold",
                        active
                          ? "bg-white text-[#163E5C]"
                          : "bg-[#163E5C] text-white"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-slate-100 p-3 shrink-0">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-red-50 focus:outline-none transition-colors border border-transparent hover:border-red-100 cursor-pointer group"
          title="Click to Log Out"
        >
          <Avatar className="h-9 w-9 border border-slate-200 group-hover:border-red-200">
            <AvatarImage src={user?.image || undefined} referrerPolicy="no-referrer" />
            <AvatarFallback className="bg-primary text-white font-semibold text-xs uppercase group-hover:bg-red-600 transition-colors">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate leading-tight group-hover:text-red-600 transition-colors duration-150">
              {displayName}
            </p>
            <p className="text-[11px] text-slate-400 truncate mt-0.5 capitalize font-medium group-hover:text-red-400 transition-colors">
              {role} Account
            </p>
          </div>
          <LogOut className="h-4 w-4 text-slate-400 shrink-0 transition-all duration-200 group-hover:text-red-500 group-hover:translate-x-0.5" />
        </button>
      </div>
    </aside>
  );
}
