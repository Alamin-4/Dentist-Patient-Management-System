"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import SearchInput from "./SearchInput";
import AuthButtons from "./AuthButtons";
import UserMenu from "./UserMenu";
import LanguageSelector from "./LanguageSelector";
import { User } from "./type";


interface NavItem {
    label: string;
    href: string;
    hasDropdown?: boolean;
}

interface MobileMenuProps {
    navConfig: NavItem[];
    pathname: string;
    searchQuery: string;
    onSearchChange: (value: string) => void;
    user: User | null;
    onSignInClick: () => void;
    onSignUpClick: () => void;
    onLogout: () => void;
}

export default function MobileMenu({
    navConfig,
    pathname,
    searchQuery,
    onSearchChange,
    user,
    onSignInClick,
    onSignUpClick,
    onLogout,
}: MobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleClose = () => setIsOpen(false);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <button
                    className="lg:hidden text-gray-600 hover:text-gray-900 transition-colors focus:outline-none cursor-pointer"
                    aria-label="Toggle menu"
                >
                    <Menu size={26} />
                </button>
            </SheetTrigger>
            <SheetContent
                side="right"
                className="w-75 sm:w-87.5 p-6 bg-white flex flex-col gap-6 overflow-y-auto border-l border-gray-100 shadow-xl"
            >
                <SheetHeader className="p-0 border-b border-gray-100 pb-4" >
                    <SheetTitle className="text-left font-semibold text-lg text-[#10436B] flex items-center gap-2">
                        <Image
                            src="/logos/mainlogo.png"
                            alt="Website logo"
                            height={20}
                            width={400}
                            className="w-40 h-auto object-contain"
                        />
                    </SheetTitle>
                </SheetHeader>

                {/* Search */}
                <SearchInput
                    value={searchQuery}
                    onChange={onSearchChange}
                    placeholder="Search..."
                    variant="mobile"
                />

                {/* Navigation Links */}
                <div className="flex flex-col gap-2">
                    {navConfig.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            onClick={handleClose}
                            className={cn(
                                "text-base font-semibold py-2.5 px-3 rounded-lg hover:bg-gray-50 hover:text-[#10436B] transition-all duration-200 flex items-center justify-between",
                                pathname === item.href
                                    ? "text-[#10436B] bg-blue-50/50"
                                    : "text-gray-700",
                            )}
                        >
                            {item.label}
                            {item.hasDropdown && (
                                <ChevronDown size={16} className="text-gray-400" />
                            )}
                        </Link>
                    ))}
                </div>

                {/* Bottom Section */}
                <div className="mt-auto border-t border-gray-100 pt-6 flex flex-col gap-4">
                    {user ? (
                        <UserMenu
                            user={user}
                            onLogout={onLogout}
                            variant="mobile"
                            onClose={handleClose}
                        />
                    ) : (
                        <AuthButtons
                            onSignInClick={onSignInClick}
                            onSignUpClick={onSignUpClick}
                            variant="mobile"
                            onClose={handleClose}
                        />
                    )}

                    {/* Language Selector - Now Professional Dropdown */}
                    <div className="border-t border-gray-100 pt-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Globe size={16} className="text-gray-400" />
                            <p className="text-xs text-gray-500 font-semibold uppercase">
                                Language
                            </p>
                        </div>
                        <LanguageSelector
                            variant="mobile"
                            onClose={handleClose}
                        />
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}