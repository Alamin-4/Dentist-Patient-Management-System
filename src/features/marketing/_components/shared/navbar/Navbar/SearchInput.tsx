"use client";

import { useState, useEffect, Suspense } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    variant?: "desktop" | "mobile";
}

function SearchInputContent({
    value: propValue,
    onChange: propOnChange,
    placeholder = "Search by dentist name or specialty",
    variant = "desktop",
}: SearchInputProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const [localValue, setLocalValue] = useState(propValue || "");

    useEffect(() => {
        if (pathname === "/find-dentists") {
            return;
        }
        const urlSearch = searchParams.get("search") || "";
        setLocalValue(urlSearch);
        propOnChange(urlSearch);
    }, [searchParams, pathname]);

    useEffect(() => {
        if (pathname === "/find-dentists") {
            return;
        }
        setLocalValue(propValue || "");
    }, [propValue, pathname]);

    const handleSearchSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        const params = new URLSearchParams();
        const textQuery = localValue.trim();

        propOnChange(textQuery);

        if (textQuery) {
            params.set("search", textQuery);
        }

        router.push(`/find-dentists?${params.toString()}`);
    };

    const handleClear = () => {
        setLocalValue("");
        propOnChange("");

        const params = new URLSearchParams();
        router.push(`/find-dentists?${params.toString()}`);
    };

    return (
        <form
            onSubmit={handleSearchSubmit}
            className={cn(
                "relative flex items-center w-full",
                variant === "desktop" ? "hidden md:flex flex-1 max-w-md" : "md:hidden",
            )}
        >
            <input
                type="text"
                placeholder={placeholder}
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                className={cn(
                    "w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-4 pr-20 text-sm outline-none transition-all duration-200",
                    "focus:bg-white focus:border-[#10436B] focus:ring-4 focus:ring-[#10436B]/10 focus:shadow-sm",
                    variant === "desktop" ? "py-2.5" : "py-2.5",
                )}
            />
            <div className="absolute right-2 flex items-center gap-1">
                {localValue && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                        aria-label="Clear search"
                    >
                        <X size={15} />
                    </button>
                )}
                <button
                    type="submit"
                    className="p-1.5 rounded-lg bg-[#10436B] hover:bg-[#0D3658] text-white transition-all shadow-sm active:scale-95 flex items-center justify-center cursor-pointer"
                    aria-label="Search"
                >
                    <Search size={15} />
                </button>
            </div>
        </form>
    );
}

export default function SearchInput(props: SearchInputProps) {
    return (
        <Suspense fallback={
            <div className={cn(
                "relative flex items-center w-full",
                props.variant === "desktop" ? "hidden md:flex flex-1 max-w-md" : "md:hidden",
            )}>
                <div className={cn(
                    "w-full rounded-xl border border-gray-200 bg-gray-50/50 animate-pulse",
                    props.variant === "desktop" ? "h-10.5" : "h-9.5"
                )} />
            </div>
        }>
            <SearchInputContent {...props} />
        </Suspense>
    );
}