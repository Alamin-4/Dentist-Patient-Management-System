"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Calendar,
  Users,
  BarChart3,
  Settings,
  LifeBuoy,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: User, label: "Profile", href: "/dashboard/profile" },
  { icon: Calendar, label: "Bookings", href: "/dashboard/bookings" },
  { icon: Users, label: "Patients", href: "/dashboard/patients" },
  { icon: BarChart3, label: "Results", href: "/dashboard/results" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  { icon: LifeBuoy, label: "Support", href: "/dashboard/support" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      hidden={pathname === "/dashboard/verification"}
      className="flex h-full w-64 flex-col border-r bg-white px-4.5 py-6"
    >
      <nav className="flex-1 space-y-1 px-4">
        {menuItems.map((item) => {
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
