import { DentistVerificationResponse } from "./types";
import { FileText, ExternalLink } from "lucide-react";

export function DentistLicenseTab({ data }: { data: DentistVerificationResponse }) {
    const { license_step } = data;
    if (!license_step) return <div>No license data available.</div>;

    return (
        <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-[#1A1A2E]">License & Identity Details</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-4">
                    <InfoRow label="Registration Authority" value={license_step.registration_authority_name} />
                    <InfoRow label="Registration Number" value={license_step.registration_no} />
                    <InfoRow label="Location" value={`${license_step.city}, ${license_step.country}`} />
                    <InfoRow label="Status" value={license_step.status} highlight={license_step.status === "APPROVED"} />
                    <InfoRow label="Reviewer Notes" value={license_step.reviewer_notes} />
                    <InfoRow label="Verified At" value={new Date(license_step.verified_at).toLocaleString()} />
                </div>
                <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-700">Documents</h4>
                    <DocumentLink label="License Document (PDF)" url={license_step.file} />
                </div>
            </div>
        </div>
    );
}

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
    return (
        <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
            <p className={`mt-1 text-sm font-medium ${highlight ? "text-emerald-600" : "text-[#1A1A2E]"}`}>{value}</p>
        </div>
    );
}

function DocumentLink({ label, url }: { label: string; url: string }) {
    return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg border border-gray-200 p-3 text-sm text-blue-600 hover:bg-blue-50 transition-colors">
            <FileText className="h-4 w-4" />
            {label}
            <ExternalLink className="ml-auto h-3 w-3" />
        </a>
    );
}