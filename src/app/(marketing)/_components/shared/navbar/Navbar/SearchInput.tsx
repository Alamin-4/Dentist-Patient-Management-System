"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    variant?: "desktop" | "mobile";
}

export default function SearchInput({
    value,
    onChange,
    placeholder = "Search by procedure and budget",
    variant = "desktop",
}: SearchInputProps) {
    return (
        <div
            className={cn(
                "relative",
                variant === "desktop" ? "hidden md:flex flex-1 max-w-md" : "md:hidden",
            )}
        >
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={cn(
                    "w-full rounded-lg border border-gray-200 bg-gray-50/50 pl-4 pr-12 text-sm outline-none focus:border-[#10436B] transition-all",
                    variant === "desktop" ? "py-2.5" : "py-2",
                )}
            />
            <Search
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={variant === "desktop" ? 20 : 18}
            />
        </div>
    );
}