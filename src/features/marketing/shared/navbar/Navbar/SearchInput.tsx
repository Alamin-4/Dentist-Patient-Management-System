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
    onSubmit?: () => void;
}

function SearchInputContent({
    value: propValue,
    onChange: propOnChange,
    placeholder = "Search by dentist name or specialty",
    variant = "desktop",
    onSubmit,
}: SearchInputProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const [localValue, setLocalValue] = useState(propValue || "");
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        if (isFocused) return;

        const urlSearch = searchParams.get("search") || "";
        const src = searchParams.get("src") || "";

        if (pathname === "/find-dentists") {
            if (src === "nav") {
                setLocalValue(urlSearch);
            } else {
                setLocalValue("");
            }
        } else {
            setLocalValue(urlSearch);
            propOnChange(urlSearch);
        }
    }, [searchParams, pathname, isFocused]);

    useEffect(() => {
        if (pathname === "/find-dentists") {
            return;
        }
        setLocalValue(propValue || "");
    }, [propValue, pathname]);

    const handleSearchSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        const params = new URLSearchParams(searchParams.toString());
        const textQuery = localValue.trim();

        if (pathname !== "/find-dentists") {
            propOnChange(textQuery);
        }

        if (textQuery) {
            params.set("search", textQuery);
            params.set("src", "nav");
        } else {
            params.delete("search");
            params.delete("src");
        }
        params.delete("page");

        router.push(`/find-dentists?${params.toString()}`);
        onSubmit?.();
    };

    const handleClear = () => {
        setLocalValue("");
        if (pathname !== "/find-dentists") {
            propOnChange("");
        }

        const params = new URLSearchParams(searchParams.toString());
        params.delete("search");
        params.delete("src");
        params.delete("page");
        router.push(`/find-dentists?${params.toString()}`);
        onSubmit?.();
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
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => setLocalValue(e.target.value)}
                className={cn(
                    "w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-4 pr-20 text-sm outline-none transition-all duration-200",
                    "focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 focus:shadow-sm",
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
                    className="p-1.5 rounded-lg bg-primary hover:bg-[#0D3658] text-white transition-all shadow-sm active:scale-95 flex items-center justify-center cursor-pointer"
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
                props.variant === "desktop" ? "hidden md:flex flex-1 max-w-xs" : "md:hidden",
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