"use client";

import { useState, useEffect, Suspense } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    variant?: "desktop" | "mobile";
}

function SearchInputContent({
    value: propValue,
    onChange: propOnChange,
    placeholder = "Search by procedure and budget",
    variant = "desktop",
}: SearchInputProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Manage local input state for smooth typing
    const [localValue, setLocalValue] = useState(propValue || "");

    useEffect(() => {
        // Pre-populate search query from URL search params if available
        const urlSearch = searchParams.get("search") || "";
        const minPrice = searchParams.get("price[min]");
        const maxPrice = searchParams.get("price[max]");

        let displayValue = urlSearch;

        if (minPrice && maxPrice) {
            const minNum = Number(minPrice);
            const maxNum = Number(maxPrice);
            if (minNum > 0 || maxNum < 1800) {
                displayValue = `${urlSearch} ${minNum} to ${maxNum}`.trim();
            }
        } else if (maxPrice) {
            const maxNum = Number(maxPrice);
            if (maxNum < 1800) {
                displayValue = `${urlSearch} under ${maxNum}`.trim();
            }
        } else if (minPrice) {
            const minNum = Number(minPrice);
            if (minNum > 0) {
                displayValue = `${urlSearch} over ${minNum}`.trim();
            }
        }

        if (displayValue) {
            setLocalValue(displayValue);
            propOnChange(urlSearch);
        } else if (!urlSearch && !minPrice && !maxPrice && localValue !== "") {
            setLocalValue("");
        }
    }, [searchParams]);

    // Keep local value synced with prop values if they change externally
    useEffect(() => {
        setLocalValue(propValue || "");
    }, [propValue]);

    const handleSearchSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        const params = new URLSearchParams();
        let textQuery = localValue.trim();

        // 1. Check for ranges: "XXX to YYY", "XXX - YYY", "between XXX and YYY"
        const rangeRegex = /(?:between\s+)?\$?(\d+)\s*(?:to|-|and)\s*\$?(\d+)/i;
        const rangeMatch = textQuery.match(rangeRegex);

        if (rangeMatch) {
            const min = parseInt(rangeMatch[1], 10);
            const max = parseInt(rangeMatch[2], 10);
            if (!isNaN(min) && !isNaN(max)) {
                params.set("price[min]", min.toString());
                params.set("price[max]", max.toString());
                textQuery = textQuery.replace(rangeMatch[0], "").replace(/\b(?:between|budget|price)\b/gi, "");
            }
        } else {
            // 2. Check for single numbers with optional qualifiers like "under", "max", "less than", "up to", "budget", "price"
            const singleRegex = /(?:under|max|less\s+than|up\s+to|budget|price|\$)\s*\$?(\d+)/i;
            const singleMatch = textQuery.match(singleRegex);

            if (singleMatch) {
                const val = parseInt(singleMatch[1], 10);
                if (!isNaN(val)) {
                    params.set("price[max]", val.toString());
                    textQuery = textQuery.replace(singleMatch[0], "").replace(/\b(?:under|max|less\s+than|up\s+to|budget|price|\$)\b/gi, "");
                }
            } else {
                // 3. Check for trailing number: e.g. "Implants 800"
                const trailingRegex = /\s+\$?(\d+)$/;
                const trailingMatch = textQuery.match(trailingRegex);
                if (trailingMatch) {
                    const val = parseInt(trailingMatch[1], 10);
                    if (!isNaN(val)) {
                        params.set("price[max]", val.toString());
                        textQuery = textQuery.replace(trailingRegex, "");
                    }
                } else {
                    // 4. Check if it's just a raw number
                    const rawNumberRegex = /^\$?(\d+)$/;
                    const rawMatch = textQuery.match(rawNumberRegex);
                    if (rawMatch) {
                        const val = parseInt(rawMatch[1], 10);
                        if (!isNaN(val)) {
                            params.set("price[max]", val.toString());
                            textQuery = "";
                        }
                    }
                }
            }
        }

        // Clean up extra spaces in the remaining text query
        textQuery = textQuery.replace(/\s+/g, " ").trim();

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
                    props.variant === "desktop" ? "h-[42px]" : "h-[38px]"
                )} />
            </div>
        }>
            <SearchInputContent {...props} />
        </Suspense>
    );
}