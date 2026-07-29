"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    LogOut,
    User as UserIcon,
    Settings,
    LifeBuoy,
    FolderOpen,
    Check,
    LayoutDashboard,
    Tag,
    Plane,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuGroup,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { User } from "./type";
import { cn } from "@/lib/utils";

interface UserMenuProps {
    user: User;
    onLogout: () => void;
    variant?: "desktop" | "mobile";
    onClose?: () => void;
}

export default function UserMenu({
    user,
    onLogout,
    variant = "desktop",
    onClose,
}: UserMenuProps) {
    const router = useRouter();
    const [status, setStatus] = useState<"active" | "away" | "dnd">("active");

    const displayName = user?.name || user?.email?.split("@")[0] || "User";
    const initials = user?.email
        ? user.email.slice(0, 2).toUpperCase()
        : "U";

    const role = user?.role?.toLowerCase() || "patient";

    // Determine dashboard route based on role
    const getDashboardRoute = () => {
        if (user?.role === "PATIENT") return "/patient";
        if (user?.role === "DENTIST") return "/dentist";
        if (user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") return "/admin";
        return "/";
    };

    const handleNavigation = (route: string) => {
        onClose?.();
        router.push(route);
    };

    const handleLogout = () => {
        onClose?.();
        onLogout();
    };

    if (variant === "mobile") {
        return (
            <>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Avatar className="h-10 w-10 border border-gray-200">
                        <AvatarImage src={user?.image || undefined} />
                        <AvatarFallback className="bg-primary text-white font-semibold text-sm">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-text truncate">
                            {displayName}
                        </p>
                        <p className="text-xs text-sec-text truncate">{user?.email}</p>
                    </div>
                </div>

                <button
                    onClick={() => handleNavigation(getDashboardRoute())}
                    className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 py-3 text-center font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                    <LayoutDashboard size={18} /> My Dashboard
                </button>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-50 text-red-600 py-3 text-center font-semibold transition-colors hover:bg-red-100 cursor-pointer"
                >
                    <LogOut size={18} /> Logout
                </button>
            </>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1.5 p-1 rounded-full bg-[#F2F5F6] hover:bg-[#E2E8F0] focus:outline-none transition-colors group cursor-pointer">
                <div className="relative">
                    <Avatar className="h-8 w-8 border border-gray-200">
                        <AvatarImage src={user?.image || undefined} />
                        <AvatarFallback className="bg-primary text-white font-semibold text-xs">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <span className={cn(
                        "absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white transition-colors duration-200",
                        status === "active" && "bg-emerald-500",
                        status === "away" && "bg-amber-500",
                        status === "dnd" && "bg-rose-500"
                    )} />
                </div>
                <span className="hidden text-sm font-semibold text-slate-700 md:block max-w-25 w-full pr-2 truncate group-hover:text-primary transition-colors">
                    {displayName.split(" ")[0].slice(0, 10)}
                </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-64 p-1.5 mt-2 bg-white border border-slate-100 shadow-xl rounded-xl space-y-0.5 z-50"
            >
                {/* User Details Header */}
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

                {/* Dashboard Nav link (since they are in marketing navbar, not dashboard) */}
                <DropdownMenuGroup>
                    <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors" onClick={() => handleNavigation(getDashboardRoute())}>
                        <LayoutDashboard className="h-4 w-4 text-slate-400" />
                        <span>My Dashboard</span>
                        <DropdownMenuShortcut className="text-slate-400">⌘D</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                {/* Role-specific Relative Actions Section */}
                <DropdownMenuGroup>
                    {role === "dentist" ? (
                        <>
                            <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors" onClick={() => handleNavigation("/dentist/profile")}>
                                <UserIcon className="h-4 w-4 text-slate-400" />
                                <span>My Profile</span>
                                <DropdownMenuShortcut className="text-slate-400">⌘P</DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors" onClick={() => handleNavigation("/dentist/settings")}>
                                <Settings className="h-4 w-4 text-slate-400" />
                                <span>Settings</span>
                                <DropdownMenuShortcut className="text-slate-400">⌘S</DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors" onClick={() => handleNavigation("/dentist/pricing-protocols")}>
                                <Tag className="h-4 w-4 text-slate-400" />
                                <span>Pricing Protocols</span>
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors" onClick={() => handleNavigation("/dentist/support")}>
                                <LifeBuoy className="h-4 w-4 text-slate-400" />
                                <span>Help & Support</span>
                            </DropdownMenuItem> */}
                        </>
                    ) : role === "patient" ? (
                        <>
                            <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors" onClick={() => handleNavigation("/patient/settings")}>
                                <UserIcon className="h-4 w-4 text-slate-400" />
                                <span>Profile & Settings</span>
                                <DropdownMenuShortcut className="text-slate-400">⌘P</DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors" onClick={() => handleNavigation("/patient/documents")}>
                                <FolderOpen className="h-4 w-4 text-slate-400" />
                                <span>Document Vault</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors" onClick={() => handleNavigation("/patient/travel-checklist")}>
                                <Plane className="h-4 w-4 text-slate-400" />
                                <span>Travel Checklist</span>
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors" onClick={() => handleNavigation("/about-us")}>
                                <LifeBuoy className="h-4 w-4 text-slate-400" />
                                <span>Help & Support</span>
                            </DropdownMenuItem> */}
                        </>
                    ) : (
                        <>
                            <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors" onClick={() => handleNavigation("/admin/profile")}>
                                <UserIcon className="h-4 w-4 text-slate-400" />
                                <span>My Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors" onClick={() => handleNavigation("/admin/settings")}>
                                <Settings className="h-4 w-4 text-slate-400" />
                                <span>Settings</span>
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    className="text-red-600 cursor-pointer flex items-center gap-2.5 px-3 py-2 text-sm font-medium hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
                    onClick={handleLogout}
                >
                    <LogOut className="h-4 w-4 shrink-0" />
                    <span>Logout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}