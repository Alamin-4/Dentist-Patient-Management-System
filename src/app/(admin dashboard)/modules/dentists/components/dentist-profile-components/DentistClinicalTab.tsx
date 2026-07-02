import { DentistVerificationResponse } from "./types";
import { FileText, ExternalLink, MapPin } from "lucide-react";

export function DentistClinicalTab({ data }: { data: DentistVerificationResponse }) {
    const { clinical_step } = data;
    if (!clinical_step) return <div>No clinical data available.</div>;

    return (
        <div className="space-y-5">
            <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-lg font-bold text-[#1A1A2E]">Clinic Information</h3>
                <div className="flex items-start gap-3">
                    <MapPin className="mt-1 h-5 w-5 text-gray-400" />
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Clinic Address</p>
                        <p className="mt-1 text-sm font-medium text-[#1A1A2E]">{clinical_step.clinic_address}</p>
                    </div>
                </div>
            </div>

            <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-lg font-bold text-[#1A1A2E]">Materials & Protocols</h3>
                {clinical_step.materials && clinical_step.materials.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {clinical_step.materials.map((mat, idx) => (
                            <div key={idx} className="space-y-3 rounded-lg border border-gray-50 bg-gray-50/50 p-4">
                                <p className="text-sm font-semibold text-gray-700">Material Set {idx + 1}</p>
                                <p className="text-xs text-gray-500 break-all">Procedure ID: {mat.own_procedure}</p>
                                <DocumentLink label="CE Certificate" url={mat.ce_certificate} />
                                <DocumentLink label="Material Brands" url={mat.material_brands} />
                                <DocumentLink label="Invoice" url={mat.invoice} />
                                <DocumentLink label="Protocol PDF" url={mat.protocol_pdf} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">No materials data available.</p>
                )}
            </div>
        </div>
    );
}

function DocumentLink({ label, url }: { label: string; url: string }) {
    return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-3 text-sm text-blue-600 hover:bg-blue-50 transition-colors">
            <FileText className="h-4 w-4" />
            {label}
            <ExternalLink className="ml-auto h-3 w-3" />
        </a>
    );
}