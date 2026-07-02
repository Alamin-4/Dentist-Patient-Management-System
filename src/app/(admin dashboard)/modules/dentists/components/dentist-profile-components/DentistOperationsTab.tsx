import { DentistVerificationResponse } from "./types";
import { FileText, ExternalLink } from "lucide-react";

export function DentistOperationsTab({ data }: { data: DentistVerificationResponse }) {
    const { operation_step } = data;
    if (!operation_step) return <div>No operations data available.</div>;

    const { sterilization_verification, no_surprise_guarantee, procedures_feature } = operation_step;

    return (
        <div className="space-y-5">
            {/* Sterilization */}
            <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-lg font-bold text-[#1A1A2E]">Sterilization & JCI</h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                        <InfoRow label="JCI Certificate" value={sterilization_verification?.has_jci_certificate ? "Available" : "Not Available"} highlight={sterilization_verification?.has_jci_certificate} />
                        {sterilization_verification?.jci_certificate && (
                            <DocumentLink label="Download JCI Certificate" url={sterilization_verification.jci_certificate} />
                        )}
                        {sterilization_verification?.walkthrough_video && (
                            <DocumentLink label="Watch Walkthrough Video" url={sterilization_verification.walkthrough_video} />
                        )}
                    </div>
                </div>
            </div>

            {/* No Surprise Guarantee */}
            <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-lg font-bold text-[#1A1A2E]">No Surprise Guarantee</h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <InfoRow label="Allowed Variation" value={`${no_surprise_guarantee?.allowed_variation_percent || 0}%`} />
                    <InfoRow label="Signer Name" value={no_surprise_guarantee?.signer_name || "N/A"} />
                    <InfoRow label="Typed Signature" value={no_surprise_guarantee?.typed_signature || "N/A"} />
                    <InfoRow label="Terms Accepted" value={no_surprise_guarantee?.accepted_terms ? "Yes" : "No"} highlight={no_surprise_guarantee?.accepted_terms} />
                    <InfoRow label="Signed At" value={new Date(no_surprise_guarantee?.signed_at || "").toLocaleString()} />
                </div>
            </div>

            {/* Procedures */}
            <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-lg font-bold text-[#1A1A2E]">Procedures & Pricing</h3>
                {procedures_feature && procedures_feature.length > 0 ? (
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
                                {procedures_feature.map((proc) => (
                                    <tr key={proc.procedure_name}>
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