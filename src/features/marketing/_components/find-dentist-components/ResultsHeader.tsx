// modules/find-dentists/components/ResultsHeader.tsx

"use client";

import CompareToggle from "./CompareToggle";

import { DEFAULT_PRICE_RANGE } from "./constants";

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

    const showPrice = priceRange[0] > DEFAULT_PRICE_RANGE[0] || priceRange[1] < DEFAULT_PRICE_RANGE[1];

    let priceText = "";
    if (showPrice) {
        if (priceRange[0] > DEFAULT_PRICE_RANGE[0] && priceRange[1] < DEFAULT_PRICE_RANGE[1]) {
            priceText = ` | $${priceRange[0]} – $${priceRange[1].toLocaleString()}`;
        } else if (priceRange[0] > DEFAULT_PRICE_RANGE[0]) {
            priceText = ` | Over $${priceRange[0]}`;
        } else if (priceRange[1] < DEFAULT_PRICE_RANGE[1]) {
            priceText = ` | Under $${priceRange[1].toLocaleString()}`;
        }
    }

    return (
        <div className="mb-4 flex gap-3 flex-row sm:items-center justify-between">
            <h2 className="text-xs font-medium leading-5 text-slate-500">
                {isLoading ? (
                    <span className="inline-block h-4 w-48 animate-pulse rounded bg-slate-200" />
                ) : (
                    <>
                        <span className="font-semibold text-slate-700">{totalCount}</span>{" "}
                        Dentists Found{locationText}{priceText}
                    </>
                )}
            </h2>

            <CompareToggle isCompareMode={isCompareMode} onToggle={onCompareToggle} />
        </div>
    );
}