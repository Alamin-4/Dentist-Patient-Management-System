"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuMountain } from "react-icons/lu";

import {
  LayoutDashboard,
  User,
  Calendar,
  Users,
  BarChart3,
  Settings,
  LifeBuoy,
  LogOut,
  Video,
  Search,
  CalendarDays,
  FilePlusCorner,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { FcDocument } from "react-icons/fc";

const dentistMenuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard/dentist" },
  { icon: User, label: "Profile", href: "/dashboard/dentist/profile" },
  {
    icon: Video,
    label: "Consultations",
    href: "/dashboard/dentist/consultations",
  },
  { icon: Calendar, label: "Bookings", href: "/dashboard/dentist/bookings" },
  { icon: Users, label: "Patients", href: "/dashboard/dentist/patients" },
  { icon: BarChart3, label: "Results", href: "/dashboard/dentist/results" },
  { icon: Settings, label: "Settings", href: "/dashboard/dentist/settings" },
  { icon: LifeBuoy, label: "Support", href: "/dashboard/dentist/support" },
];

const patientMenuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard/patient" },
  {
    icon: Search,
    label: "Find Verified Dentists",
    href: "/dashboard/patient/find-dentist",
  },
  {
    icon: CalendarDays,
    label: "My Bookings",
    href: "/dashboard/patient/bookings",
  },
  {
    icon: LuMountain,
    label: "Document Vault",
    href: "/dashboard/patient/documents",
  },
  { icon: Calendar, label: "My Results", href: "/dashboard/patient/results" },
  { icon: Users, label: "Referrals", href: "/dashboard/patient/referrals" },
  {
    icon: BarChart3,
    label: "Travel Checklist",
    href: "/dashboard/patient/travel-checklist",
  },
  {
    icon: Settings,
    label: "Profile & Settings",
    href: "/dashboard/patient/settings",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      hidden={pathname === "/dashboard/verification"}
      className="flex h-full w-68 flex-col bg-white px-4.5 py-6"
    >
      <nav className="flex-1 space-y-1 px-4">
        {dentistMenuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#163E5C] text-white"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
          <LogOut className="h-5 w-5" />
          Log Out
        </button>
      </div>
    </aside>
  );
}
