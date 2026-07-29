"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Dentist } from "../find-dentists-page-components/types";
import MapSection from "./MapSection";

interface MobileMapDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    dentists: Dentist[];
    activeDentistId: string | null;
    onMarkerClick: (dentist: Dentist) => void;
    onCloseCard: () => void;
}

export default function MobileMapDialog({
    open,
    onOpenChange,
    dentists,
    activeDentistId,
    onMarkerClick,
    onCloseCard,
}: MobileMapDialogProps) {
    const dentistsWithCoords = dentists.filter((d) => d.coords);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-full sm:max-w-7xl w-11/12 h-[85vh] p-0 overflow-hidden bg-white border border-slate-200 shadow-2xl rounded-xl flex flex-col">
                <DialogHeader className="p-4 border-b border-slate-100 flex flex-row items-center justify-between space-y-0 shrink-0">
                    <div>
                        <DialogTitle className="text-primary font-bold text-lg">Dentist Locations Map</DialogTitle>
                        <DialogDescription className="text-slate-500 text-xs mt-0.5">
                            Showing {dentistsWithCoords.length} of {dentists.length} dentists
                        </DialogDescription>
                    </div>
                </DialogHeader>
                <div className="flex-1 w-full h-full min-h-0 relative">
                    <MapSection
                        dentists={dentists}
                        activeDentistId={activeDentistId}
                        onMarkerClick={onMarkerClick}
                        onCloseCard={onCloseCard}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}