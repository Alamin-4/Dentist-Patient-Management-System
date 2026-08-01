"use client";

import { useState } from "react";
import { FileText, ChevronDown, ChevronUp, PencilLine } from "lucide-react";
import { DentistProfileData } from "./profile.types";
import { SectionCard } from "@/components/shared/section-card";

interface ClinicalDepthCardProps {
  dentist?: DentistProfileData | null;
}

function getFileName(url: string, defaultName: string): string {
  if (!url) return defaultName;
  try {
    const parts = url.split("/");
    const lastPart = parts[parts.length - 1];
    return decodeURIComponent(lastPart);
  } catch (e) {
    return defaultName;
  }
}

export function ClinicalDepthCard({ dentist }: ClinicalDepthCardProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Get clinic address from profile data if available, fallback to default address if none
  const clinicAddress =
    (dentist?.dentistClinicDepthVerification as any)?.clinicAddress ||
    (dentist?.dentistClinicDepthVerification as any)?.clinic_address ||
    (dentist?.dentistClinicDepthVerification as any)?.clinicLocation ||
    "";

  // Parse address if it is an object
  const formattedAddress = typeof clinicAddress === "object" && clinicAddress !== null
    ? (clinicAddress as any).address || ""
    : String(clinicAddress);

  const procedureDocs = (dentist?.dentistClinicDepthVerification as any)?.procedureDocs || [];

  // Group documents dynamically by procedure name
  const groupedDocs = procedureDocs.reduce((acc: Record<string, Array<{ type: string; url: string; name: string }>>, doc: any) => {
    const procName = doc.dentistProcedure?.globalProcedure?.name || "Procedure Documents";
    if (!acc[procName]) {
      acc[procName] = [];
    }

    if (doc.ceCertificate) {
      acc[procName].push({
        type: "CE Certificate",
        url: doc.ceCertificate,
        name: getFileName(doc.ceCertificate, "CE certificate.pdf"),
      });
    }
    if (doc.materialBrands) {
      acc[procName].push({
        type: "Material Brands",
        url: doc.materialBrands,
        name: getFileName(doc.materialBrands, "Material brands.pdf"),
      });
    }
    if (doc.invoice) {
      acc[procName].push({
        type: "Invoice",
        url: doc.invoice,
        name: getFileName(doc.invoice, "Invoice.pdf"),
      });
    }
    if (doc.protocolPdf) {
      acc[procName].push({
        type: "Protocol PDF",
        url: doc.protocolPdf,
        name: getFileName(doc.protocolPdf, "Protocol.pdf"),
      });
    }

    return acc;
  }, {});

  const groupKeys = Object.keys(groupedDocs);
  const activeSection = expandedSection || (groupKeys.length > 0 ? groupKeys[0] : null);

  const toggleSection = (section: string) => {
    if (activeSection === section) {
      setExpandedSection("NONE"); // Close the accordion
    } else {
      setExpandedSection(section);
    }
  };

  return (
    <SectionCard className="p-6">
      {/* Header section */}
      <div className="flex items-center justify-between border-b border-border pb-5">
        <h2 className="text-xl font-bold text-gray-900">Clinical Depth</h2>
        <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors">
          <PencilLine className="h-5 w-5" />
        </button>
      </div>

      {/* Location section */}
      {
        formattedAddress && (
          <div className="py-5">
            <h3 className="text-sm font-bold text-gray-900 mb-2">Clinic Location</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              {formattedAddress}
            </p>
          </div>
        )
      }


      <div className="border-t border-border pt-5 space-y-4">
        {groupKeys.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/30 p-8 text-center mt-2">
            <div className="rounded-full bg-gray-100 p-3 text-gray-400 mb-3">
              <FileText className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-gray-800">No verification files uploaded yet</p>
            <p className="text-xs text-gray-400 mt-1 max-w-xs leading-relaxed">
              Please upload your clinical depth and material verification documents in the verification progress sidebar.
            </p>
          </div>
        ) : (
          groupKeys.map((sectionName) => {
            const docs = groupedDocs[sectionName];
            const isExpanded = activeSection === sectionName;

            return (
              <div key={sectionName} className="border border-gray-100 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => toggleSection(sectionName)}
                  className="flex w-full items-center justify-between px-5 py-4 text-sm font-semibold text-gray-800 hover:bg-gray-50/50 transition-colors"
                >
                  <span>{sectionName}</span>
                  {isExpanded ? (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  )}
                </button>

                {isExpanded && (
                  <div className="p-5 border-t border-border bg-white space-y-3">
                    {docs.length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-2">No files uploaded for this procedure</p>
                    ) : (
                      docs.map((doc: any, index: number) => (
                        <a
                          key={index}
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-4 rounded-xl border border-gray-100/70 p-4 hover:border-gray-200/80 hover:bg-gray-50/30 transition-all shadow-sm cursor-pointer"
                        >
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-gray-800">
                              {doc.name}
                            </p>
                            <p className="text-xs text-brand-medium-navy font-semibold mt-0.5 hover:underline flex items-center gap-1">
                              {doc.type} <span className="text-gray-400 font-normal">(Click to view)</span>
                            </p>
                          </div>
                        </a>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </SectionCard>
  );
}
