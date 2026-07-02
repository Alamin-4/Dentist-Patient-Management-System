import { cn } from "@/lib/utils";
import { DentistVerificationResponse } from "./types";

export function VerificationSidebar({ data }: { data: DentistVerificationResponse }) {
    return (
        <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
            <p className="mb-3 text-sm font-bold text-[#1A1A2E]">Verification Status</p>
            <div className="divide-y divide-gray-50">
                <VerificationStatus label="Phase 1 — License" status={data.license_verification} short="Ph.1" />
                <VerificationStatus label="Phase 2 — Operations" status={data.operations_verification} short="Ph.2" />
                <VerificationStatus label="Phase 3 — Clinical" status={data.clinical_verification} short="Ph.3" />
            </div>
        </div>
    );
}

function VerificationStatus({ label, status, short }: { label: string; status: string; short: string }) {
    const isDone = status === "APPROVED";
    return (
        <div className="flex items-center justify-between py-1.5">
            <div className="flex items-center gap-2">
                <span className="flex h-6 w-8 items-center justify-center rounded-md bg-gray-100 text-xs font-bold text-gray-500">
                    {short}
                </span>
                <span className="text-sm text-gray-600">{label}</span>
            </div>
            <span className={cn("text-xs font-semibold", isDone ? "text-emerald-600" : "text-amber-500")}>
                {isDone ? "Approved" : status}
            </span>
        </div>
    );
}