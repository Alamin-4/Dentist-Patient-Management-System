"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { HamburgerButton } from "./hamburger-button";
import useAuth, { useMe } from "@/hooks/auth/useAuth";
import { useRouter } from "next/navigation";
import {
  LogOut,
  User,
  Settings,
  FolderOpen,
  Activity,
  Users,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { logoutMutation } = useAuth();
  const { mutate: logout } = logoutMutation;
  const router = useRouter();
  const { data: meData, isPending } = useMe();
  const user = meData?.data?.user || meData?.user || null;
  const [status, setStatus] = useState<"active" | "away" | "dnd">("active");

  const logutHandler = () => {
    logout();
    router.push("/");
  };

  const displayName = user?.name || (user?.email ? user.email.split("@")[0] : "User");
  const role = user?.role?.toLowerCase() || "patient";

  return (
    <header className="border-b border-border/80 bg-white w-full">
      <nav className="px-4 lg:px-8 flex h-20 items-center justify-between">
        <div className="flex items-center gap-3">
          <HamburgerButton />
          <Link href={"/"}>
            <Image
              src={"/logos/mainlogo.png"}
              alt="Website logo"
              height={200}
              width={400}
              loading="eager"
              className="w-43 h-auto object-contain"
            /></Link>
        </div>
        <div className="flex items-center gap-6">
          {isPending ? (
            <div className="flex items-center gap-1.5 p-1.5 pr-3.5 rounded-full bg-[#F2F5F6] animate-pulse">
              <div className="h-10 w-10 rounded-full bg-slate-200 border-2 border-white" />
              <div className="hidden md:block h-4 w-12 bg-slate-200 rounded" />
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1.5 p-1.5 pr-3.5 rounded-full bg-[#F2F5F6] hover:bg-[#E2E8F0] focus:outline-none transition-colors group cursor-pointer">
                <div className="relative">
                  <Avatar className="h-10 w-10 border-2 border-white">
                    <AvatarImage src={user?.image || undefined} />
                    <AvatarFallback className="bg-[#10436B] text-white font-semibold text-xs uppercase">
                      {user?.email ? user.email.slice(0, 2).toUpperCase() : "US"}
                    </AvatarFallback>
                  </Avatar>
                  <span className={cn(
                    "absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white transition-colors duration-200",
                    status === "active" && "bg-emerald-500",
                    status === "away" && "bg-amber-500",
                    status === "dnd" && "bg-rose-500"
                  )} />
                </div>
                <span className="hidden text-sm font-semibold text-slate-700 md:block max-w-24 truncate group-hover:text-[#10436B] transition-colors">
                  {displayName.split(" ")[0].slice(0, 10)}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-64 p-1.5 mt-2 bg-white border border-slate-100 shadow-xl rounded-xl space-y-0.5 z-50"
              >
                <DropdownMenuLabel className="px-2.5 py-2 text-left border-b border-slate-50 mb-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {displayName}
                    </p>
                    <span className={cn(
                      "inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium capitalize",
                      role === "dentist"
                        ? "bg-blue-50 text-blue-700 border border-blue-100"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                    )}>
                      {role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5 font-normal">
                    {user?.email || "No email linked"}
                  </p>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  {role === "dentist" ? (
                    <>
                      <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors" asChild>
                        <Link href="/dentist/profile">
                          <User className="h-4 w-4 text-slate-400" />
                          <span>My Profile</span>
                          <DropdownMenuShortcut className="text-slate-400">⌘P</DropdownMenuShortcut>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors" asChild>
                        <Link href="/dentist/settings">
                          <Settings className="h-4 w-4 text-slate-400" />
                          <span>Settings</span>
                          <DropdownMenuShortcut className="text-slate-400">⌘S</DropdownMenuShortcut>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors" asChild>
                        <Link href="/dentist/referrals">
                          <Users className="h-4 w-4 text-slate-400" />
                          <span>Referrals</span>
                        </Link>
                      </DropdownMenuItem>
                      {/* <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors" asChild>
                        <Link href="/dentist/support">
                          <LifeBuoy className="h-4 w-4 text-slate-400" />
                          <span>Help & Support</span>
                        </Link>
                      </DropdownMenuItem> */}
                    </>
                  ) : role === "patient" ? (
                    <>
                      <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors" asChild>
                        <Link href="/patient/settings">
                          <User className="h-4 w-4 text-slate-400" />
                          <span>Profile & Settings</span>
                          <DropdownMenuShortcut className="text-slate-400">⌘P</DropdownMenuShortcut>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors" asChild>
                        <Link href="/patient/documents">
                          <FolderOpen className="h-4 w-4 text-slate-400" />
                          <span>Document Vault</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors" asChild>
                        <Link href="/patient/results">
                          <Activity className="h-4 w-4 text-slate-400" />
                          <span>My Results</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors" asChild>
                        <Link href="/patient/referrals">
                          <Users className="h-4 w-4 text-slate-400" />
                          <span>Referrals</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors" asChild>
                        <Link href="/admin/profile">
                          <User className="h-4 w-4 text-slate-400" />
                          <span>My Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors" asChild>
                        <Link href="/admin/settings">
                          <Settings className="h-4 w-4 text-slate-400" />
                          <span>Settings</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="text-red-600 cursor-pointer flex items-center gap-2.5 px-3 py-2 text-sm font-medium hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
                  onClick={() => logutHandler()}
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </nav>
    </header>
  );
}
