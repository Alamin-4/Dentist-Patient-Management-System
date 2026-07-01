// modules/find-dentist/components/MapSection.tsx

"use client";

import dynamic from "next/dynamic";
import { Dentist } from "../DentistAllComponents/types";

const DentistMap = dynamic(() => import("../DentistAllComponents/Map/DentistMap"), {
    ssr: false,
    loading: () => (
        <div className="flex h-full w-full items-center justify-center bg-slate-100">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#003366] border-t-transparent" />
        </div>
    ),
});

interface MapSectionProps {
    dentists: Dentist[];
    activeDentistId: string | null;
    onMarkerClick: (dentist: Dentist) => void;
    onCloseCard: () => void;
}

export default function MapSection({
    dentists,
    activeDentistId,
    onMarkerClick,
    onCloseCard,
}: MapSectionProps) {
    return (
        <div className="h-[60vh] w-full sm:h-[70vh] xl:h-screen">
            <div className="sticky top-24 h-full w-full overflow-hidden rounded-lg border border-slate-100 shadow">
                <DentistMap
                    dentists={dentists}
                    activeDentistId={activeDentistId}
                    onMarkerClick={(dentist) => onMarkerClick(dentist)}
                    onCloseCard={onCloseCard}
                />
            </div>
        </div>
    );
}