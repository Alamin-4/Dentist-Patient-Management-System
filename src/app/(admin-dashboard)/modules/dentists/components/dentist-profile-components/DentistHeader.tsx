import { CheckCircle2, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { DentistVerificationResponse } from "./types";

const STATUS_BADGE: Record<string, string> = {
    approved: "bg-emerald-50 text-emerald-600",
    pending: "bg-amber-50 text-amber-600",
    rejected: "bg-red-50 text-red-500",
};

const STATUS_DOT: Record<string, string> = {
    approved: "bg-emerald-500",
    pending: "bg-amber-500",
    rejected: "bg-red-500",
};

export function DentistHeader({ data }: { data: DentistVerificationResponse }) {
    const { dentist, license_step, clinical_step, face_match_score, queue_status } = data;
    const location = clinical_step?.clinic_address || `${license_step?.city}, ${license_step?.country}`;

    return (
        <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                    <img
                        src={license_step?.professional_headshot || "/default-avatar.png"}
                        alt={dentist.full_name}
                        className="h-16 w-16 shrink-0 rounded-full object-cover border-2 border-gray-100"
                    />
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-xl font-bold text-[#1A1A2E] sm:text-2xl">{dentist.full_name}</h2>
                            {dentist.rdv_score >= 90 && (
                                <span className="flex items-center gap-1 rounded-full bg-[#1A1A2E] px-2.5 py-0.5 text-xs font-bold text-white">
                                    <CheckCircle2 className="h-3 w-3" /> RDV Verified · {dentist.rdv_score}
                                </span>
                            )}
                            <span className={cn("flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold", STATUS_BADGE[queue_status] || "bg-gray-100 text-gray-500")}>
                                <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_DOT[queue_status] || "bg-gray-400")} />
                                {queue_status.charAt(0).toUpperCase() + queue_status.slice(1)}
                            </span>
                            <span className="rounded-full border border-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-500">
                                {dentist.specialty}
                            </span>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-gray-500">
                            <span className="flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5 shrink-0" /> {location}
                            </span>
                            <span className="flex items-center gap-1.5">
                                Face Match: <span className="font-semibold text-gray-700">{face_match_score}%</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}