"use client";

import { HelpCircle, Bell, Menu, LogOut, User, Settings, BarChart2, ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/context/sidebar-context";
import { useLogout, useMe } from "@/hooks/auth/useAuth";
import Link from "next/link";

export function AdminNavbar() {
  const { toggle } = useSidebar();
  const { mutate: logout } = useLogout();
  const { user } = useMe();

  const userInitials = (
    (user?.name?.split(" ")[0]?.charAt(0) || "") +
    (user?.name?.split(" ")[1]?.charAt(0) || user?.email?.charAt(0) || "")
  ).toUpperCase() || "A";

  return (
    <header className="shrink-0 border-b border-gray-200 bg-white w-full z-30 sticky top-0 left-0">
      <nav className="px-4 lg:px-6 flex h-14 items-center justify-between">
        {/* Left: hamburger (mobile only) */}
        <div className="flex items-center">
          <button
            onClick={toggle}
            aria-label="Toggle sidebar"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Mobile logo */}
          <div className="flex items-center gap-2 ml-2 lg:hidden">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#C9963F]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-3 w-3 text-white"
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
            <span className="text-sm font-bold text-[#0D2B3E]">RatedDocs</span>
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1.5">
          {/* Help */}
          <button
            aria-label="Help"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
          >
            <HelpCircle className="h-4 w-4" />
          </button>

          {/* Notifications bell — links to /admin/notifications */}
          <Link
            href="/admin/notifications"
            aria-label="Notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-1 ring-white" />
          </Link>

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                aria-label="User menu"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0D2B3E] text-white text-xs font-bold hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#0D2B3E]/30 focus:ring-offset-1 ml-1"
              >
                {userInitials}
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 p-2 mt-1">
              {/* User info header */}
              <div className="px-2 py-2 mb-1">
                <p className="text-sm font-semibold text-text truncate">
                  {user?.name || "Admin"}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 truncate">
                  {user?.email}
                </p>
                <span className="mt-1.5 inline-flex items-center rounded-full bg-[#0D2B3E]/10 px-2 py-0.5 text-[10px] font-semibold text-[#0D2B3E]">
                  Admin
                </span>
              </div>

              <DropdownMenuSeparator />

              {/* My Profile → /admin/profile */}
              <DropdownMenuItem asChild className="gap-2 text-[13px] cursor-pointer">
                <Link href="/admin/profile">
                  <User className="h-3.5 w-3.5 text-gray-500" />
                  My Profile
                  <ChevronRight className="h-3 w-3 text-gray-300 ml-auto" />
                </Link>
              </DropdownMenuItem>

              {/* Settings → /admin/settings */}
              <DropdownMenuItem asChild className="gap-2 text-[13px] cursor-pointer">
                <Link href="/admin/settings">
                  <Settings className="h-3.5 w-3.5 text-gray-500" />
                  Settings
                  <ChevronRight className="h-3 w-3 text-gray-300 ml-auto" />
                </Link>
              </DropdownMenuItem>

              {/* Notifications → /admin/notifications */}
              <DropdownMenuItem asChild className="gap-2 text-[13px] cursor-pointer">
                <Link href="/admin/notifications">
                  <Bell className="h-3.5 w-3.5 text-gray-500" />
                  Notifications
                  <ChevronRight className="h-3 w-3 text-gray-300 ml-auto" />
                </Link>
              </DropdownMenuItem>

              {/* Reports → /admin/reports */}
              <DropdownMenuItem asChild className="gap-2 text-[13px] cursor-pointer">
                <Link href="/admin/reports">
                  <BarChart2 className="h-3.5 w-3.5 text-gray-500" />
                  Reports
                  <ChevronRight className="h-3 w-3 text-gray-300 ml-auto" />
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Sign out */}
              <DropdownMenuItem
                className="gap-2 text-[13px] text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
                onClick={() => logout()}
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
}
