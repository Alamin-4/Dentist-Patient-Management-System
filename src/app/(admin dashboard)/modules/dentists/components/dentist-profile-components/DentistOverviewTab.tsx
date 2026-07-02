"use client";

import { FileText, CheckCircle2, AlertCircle } from "lucide-react";

interface DentistOverviewTabProps {
    dentistId: string;
    verification: any;
    apiData: any; // Raw API response
}

export function DentistOverviewTab({ dentistId, verification, apiData }: DentistOverviewTabProps) {
    const { license_step, operation_step, clinical_step } = apiData || {};

    return (
        <div className="space-y-6">
            {/* Phase 1: License */}
            <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[#1A1A2E]">Phase 1: License & Identity</h3>
                    <StatusBadge status={license_step?.status} />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InfoItem label="Registration Authority" value={license_step?.registration_authority_name} />
                    <InfoItem label="Registration No" value={license_step?.registration_no} />
                    <InfoItem label="Location" value={`${license_step?.city}, ${license_step?.country}`} />
                    <InfoItem label="Verified At" value={license_step?.verified_at ? new Date(license_step.verified_at).toLocaleString() : 'N/A'} />
                </div>
                <div className="mt-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-2">Documents</p>
                    <div className="flex flex-wrap gap-3">
                        {license_step?.file && <DocLink label="License PDF" url={license_step.file} />}
                        {license_step?.professional_headshot && <DocLink label="Headshot" url={license_step.professional_headshot} />}
                    </div>
                </div>
            </div>

            {/* Phase 2: Operations */}
            <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[#1A1A2E]">Phase 2: Operations</h3>
                    <StatusBadge status={operation_step?.status} />
                </div>

                <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Sterilization & JCI</h4>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <InfoItem label="JCI Certificate" value={operation_step?.sterilization_verification?.has_jci_certificate ? "Available" : "Not Available"} />
                        <div className="flex flex-wrap gap-3 mt-2">
                            {operation_step?.sterilization_verification?.jci_certificate && <DocLink label="JCI PDF" url={operation_step.sterilization_verification.jci_certificate} />}
                            {operation_step?.sterilization_verification?.walkthrough_video && <DocLink label="Walkthrough Video" url={operation_step.sterilization_verification.walkthrough_video} />}
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">No Surprise Guarantee</h4>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <InfoItem label="Allowed Variation" value={`${operation_step?.no_surprise_guarantee?.allowed_variation_percent || 0}%`} />
                        <InfoItem label="Signer" value={operation_step?.no_surprise_guarantee?.signer_name} />
                        <InfoItem label="Terms Accepted" value={operation_step?.no_surprise_guarantee?.accepted_terms ? "Yes" : "No"} />
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Procedures</h4>
                    {operation_step?.procedures_feature?.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Procedure</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Price</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-400">Notes</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {operation_step.procedures_feature.map((proc: any, idx: number) => (
                                        <tr key={idx}>
                                            <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-[#1A1A2E]">{proc.procedure_name}</td>
                                            <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{proc.currency} {proc.price}</td>
                                            <td className="px-4 py-3 text-sm text-gray-500">{proc.option_notes}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">No procedures listed.</p>
                    )}
                </div>
            </div>

            {/* Phase 3: Clinical */}
            <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[#1A1A2E]">Phase 3: Clinical</h3>
                    <StatusBadge status={clinical_step?.status} />
                </div>

                <div className="mb-4">
                    <InfoItem label="Clinic Address" value={clinical_step?.clinic_address} />
                </div>

                <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Materials & Protocols</h4>
                    {clinical_step?.materials?.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {clinical_step.materials.map((mat: any, idx: number) => (
                                <div key={idx} className="rounded-lg border border-gray-50 bg-gray-50/50 p-4 space-y-3">
                                    <p className="text-sm font-semibold text-gray-700">Material Set {idx + 1}</p>
                                    <div className="flex flex-wrap gap-3">
                                        {mat.ce_certificate && <DocLink label="CE Certificate" url={mat.ce_certificate} />}
                                        {mat.material_brands && <DocLink label="Brands" url={mat.material_brands} />}
                                        {mat.invoice && <DocLink label="Invoice" url={mat.invoice} />}
                                        {mat.protocol_pdf && <DocLink label="Protocol" url={mat.protocol_pdf} />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">No materials data available.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

// --- Helper Components (Matching your exact design system) ---

function StatusBadge({ status }: { status: string }) {
    const isApproved = status === "APPROVED";
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${isApproved ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
            {isApproved ? <CheckCircle2 className="mr-1 h-3 w-3" /> : <AlertCircle className="mr-1 h-3 w-3" />}
            {isApproved ? 'Approved' : status || 'Pending'}
        </span>
    );
}

function InfoItem({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
            <p className="mt-1 text-sm font-medium text-[#1A1A2E] wrap-break-word">{value || 'N/A'}</p>
        </div>
    );
}

function DocLink({ label, url }: { label: string; url: string }) {
    return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors">
            <FileText className="h-3.5 w-3.5" />
            {label}
        </a>
    );
}