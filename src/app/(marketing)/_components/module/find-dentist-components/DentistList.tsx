// modules/find-dentist/components/DentistList.tsx

"use client";

import DentistCard from "./DentistCard";
import DentistCardSkeleton from "../DentistAllComponents/DentistCardSkeleton";
import EmptyState from "./EmptyState";
import { Dentist } from "../DentistAllComponents/types";

interface DentistListProps {
    dentists: Dentist[];
    isLoading: boolean;
    isCompareMode: boolean;
    compareList: Dentist[];
    onCompareToggle: (dentist: Dentist) => void;
    onCardClick: (dentistId: string) => void;
    onClearFilters: () => void;
}

export default function DentistList({
    dentists,
    isLoading,
    isCompareMode,
    compareList,
    onCompareToggle,
    onCardClick,
    onClearFilters,
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
        return <EmptyState onClearFilters={onClearFilters} />;
    }

    return (
        <div className="grid gap-4">
            {dentists.map((dentist) => (
                <DentistCard
                    key={dentist.id}
                    dentist={dentist}
                    isCompareMode={isCompareMode}
                    isSelectedForCompare={compareList.some((item) => item.id === dentist.id)}
                    onCompareToggle={() => onCompareToggle(dentist)}
                    onPrimaryAction={() => onCardClick(dentist.id)}
                />
            ))}
        </div>
    );
}