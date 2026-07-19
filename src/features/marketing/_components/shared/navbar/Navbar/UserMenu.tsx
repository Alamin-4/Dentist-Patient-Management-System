"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "./type";


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
    const displayName = user?.name || user?.email?.split("@")[0] || "User";
    const initials = user?.email
        ? user.email.slice(0, 2).toUpperCase()
        : "U";

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
                        <AvatarImage src={user?.image || "/avatar.jpg"} />
                        <AvatarFallback className="bg-[#10436B] text-white font-semibold text-sm">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-[#1A1A2E] truncate">
                            {displayName}
                        </p>
                        <p className="text-xs text-[#6B7280] truncate">{user?.email}</p>
                    </div>
                </div>

                <button
                    onClick={() => handleNavigation(getDashboardRoute())}
                    className="flex items-center justify-center rounded-lg border border-gray-200 py-3 text-center font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    My Dashboard
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
            <DropdownMenuTrigger className="flex items-center gap-1.5 p-1 rounded-full bg-[#F2F5F6] hover:bg-[#E2E8F0] focus:outline-none transition-colors">
                <Avatar className="h-8 w-8 border border-gray-200">
                    <AvatarImage src={user?.image || "/avatar.jpg"} />
                    <AvatarFallback className="bg-[#10436B] text-white font-semibold text-xs">
                        {initials}
                    </AvatarFallback>
                </Avatar>
                <span className="hidden text-sm font-semibold md:block max-w-25 w-full pr-2 truncate">
                    {displayName.slice(0, 10)}
                </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="center"
                className="w-56 space-y-2 p-4 mt-2 bg-white border border-gray-100 shadow-xl rounded-lg"
            >
                <div>
                    <p className="text-sm font-semibold text-[#1A1A2E] truncate">
                        {displayName}
                    </p>
                    <p className="text-xs text-[#6B7280] truncate">{user?.email}</p>
                </div>
                <div className="border-b border-slate-100 my-2"></div>
                <DropdownMenuItem
                    className="cursor-pointer hover:bg-gray-50 rounded-lg py-2"
                    onClick={() => handleNavigation(getDashboardRoute())}
                >
                    My Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="cursor-pointer hover:bg-gray-50 rounded-lg py-2"
                    onClick={() => handleNavigation("/settings")}
                >
                    Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="text-red-600 cursor-pointer flex items-center gap-2 hover:bg-red-50 rounded-lg py-2"
                    onClick={handleLogout}
                >
                    <LogOut size={16} /> Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}