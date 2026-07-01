// modules/find-dentist/components/ResultsHeader.tsx

"use client";

import CompareToggle from "./CompareToggle";

interface ResultsHeaderProps {
    totalCount: number;
    city: string;
    country: string;
    priceRange: [number, number];
    isLoading: boolean;
    isCompareMode: boolean;
    onCompareToggle: (value: boolean) => void;
}

export default function ResultsHeader({
    totalCount,
    city,
    country,
    priceRange,
    isLoading,
    isCompareMode,
    onCompareToggle,
}: ResultsHeaderProps) {
    const locationText =
        city !== "All Cities"
            ? ` in ${city}`
            : country !== "All Countries"
                ? ` in ${country}`
                : "";

    const priceText = `$${priceRange[0]} – $${priceRange[1] >= 1800 ? "1,800+" : priceRange[1].toLocaleString()
        }`;

    return (
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xs font-medium leading-5 text-slate-500">
                {isLoading ? (
                    <span className="inline-block h-4 w-48 animate-pulse rounded bg-slate-200" />
                ) : (
                    <>
                        <span className="font-semibold text-slate-700">{totalCount}</span>{" "}
                        Dentists Found{locationText} | {priceText}
                    </>
                )}
            </h2>

            <CompareToggle isCompareMode={isCompareMode} onToggle={onCompareToggle} />
        </div>
    );
}