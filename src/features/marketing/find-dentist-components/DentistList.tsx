// modules/find-dentists/components/DentistList.tsx

"use client";

import DentistCard from "./DentistCard";
import DentistCardSkeleton from "../find-dentists-page-components/DentistCardSkeleton";
import EmptyState from "./EmptyState";
import { Dentist } from "../find-dentists-page-components/types";
import { cn } from "@/core/lib/utils";

interface DentistListProps {
    dentists: Dentist[];
    isLoading: boolean;
    isCompareMode: boolean;
    compareList: Dentist[];
    onCompareToggle: (dentist: Dentist) => void;
    /** @deprecated Card navigates internally — kept for API compatibility only */
    onCardClick?: (dentistId: string) => void;
    onClearFilters: () => void;
    onViewOnMap?: (dentist: Dentist) => void;
    hasActiveFilters?: boolean;
    mapView: boolean
}

export default function DentistList({
    dentists,
    isLoading,
    isCompareMode,
    compareList,
    onCompareToggle,
    onClearFilters,
    onViewOnMap,
    hasActiveFilters = true,
    mapView
}: DentistListProps) {
    if (isLoading) {
        return (
            <div className="grid gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <DentistCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (dentists.length === 0) {
        return (
            <EmptyState
                onClearFilters={onClearFilters}
                hasActiveFilters={hasActiveFilters}
            />
        );
    }

    return (
        <div className={cn("grid grid-cols-1 gap-4 md:gap-6")}>
            {dentists.map((dentist) => (
                <DentistCard
                    key={dentist.id}
                    dentist={dentist}
                    isCompareMode={isCompareMode}
                    isSelectedForCompare={compareList.some((item) => item.id === dentist.id)}
                    onCompareToggle={() => onCompareToggle(dentist)}
                    onViewOnMap={onViewOnMap}
                    isButtonShow={true}
                    mapView={mapView}
                />
            ))}
        </div>
    );
}