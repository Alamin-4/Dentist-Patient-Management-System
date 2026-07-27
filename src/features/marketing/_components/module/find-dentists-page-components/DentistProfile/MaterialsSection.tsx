import { CheckCircle2, FileText, Image as ImageIcon, File, ExternalLink } from "lucide-react";

// Helper to determine file type and get the appropriate icon & label
const getDocumentInfo = (url: string) => {
  const ext = url.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') {
    return { icon: FileText, label: "View PDF" };
  }
  if (['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext || '')) {
    return { icon: ImageIcon, label: "View Image" };
  }
  return { icon: File, label: "View Document" };
};

export default function MaterialsSection({
  procedures = [],
  materials = [],
}: {
  procedures?: Array<{
    id: string;
    name: string;
  }>;
  materials?: Array<{
    dentistProcedureId: string | number;
    ceCertificate?: string;
    materialBrands?: string;
    invoice?: string;
    protocolPdf?: string;
  }>;
}) {
  if (!materials || materials.length === 0) {
    return (
      <section id="materials" className="rounded-lg border border-slate-200 bg-white p-6 space-y-4">
        <h2 className="text-xl lg:text-2xl font-bold text-[#0E3E65]">
          Materials
        </h2>
        <div className="text-center py-6 text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-sm">
          No material certifications have been verified.
        </div>
      </section>
    );
  }

  const items = materials
    .map((mat) => {
      const proc = procedures.find(p => String(p.id) === String(mat.dentistProcedureId));
      const procName = proc?.name || "Certified material";
      const brand = mat.materialBrands || "Certified Material";

      const isVeneer = procName.toLowerCase().includes("veneer") ||
        brand.toLowerCase().includes("emax") ||
        brand.toLowerCase().includes("ivoclar");

      const title = isVeneer
        ? (brand.toLowerCase().includes("emax") ? "Emax — Ivoclar" : brand)
        : (brand.toLowerCase().includes("straumann") ? "Straumann BLX" : brand);

      const subtitle = isVeneer
        ? "Veneer material"
        : (procName.toLowerCase().includes("implant") ? "Implant system" : procName);

      const docs = [];
      if (mat.ceCertificate) docs.push({ url: mat.ceCertificate, name: "CE Certificate" });
      if (mat.protocolPdf) docs.push({ url: mat.protocolPdf, name: "Protocol" });
      if (mat.invoice) docs.push({ url: mat.invoice, name: "Invoice" });

      return {
        title,
        subtitle,
        docs,
      };
    })
    .filter((item) => item.title);

  return (
    <section id="materials" className="rounded-lg border border-slate-200 bg-white p-6 space-y-4">
      <h2 className="text-xl lg:text-2xl font-bold text-[#0E3E65]">
        Materials
      </h2>

      <div className="divide-y divide-slate-100">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4 first:pt-0 last:pb-0"
          >
            <div className="min-w-0 flex-1 space-y-1">
              <p className="text-xs font-medium text-slate-500 wrap-break-word">
                {item.subtitle}
              </p>

              {item.docs.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {item.docs.map((doc, docIdx) => {
                    const { icon: Icon, label } = getDocumentInfo(doc.url);
                    return (
                      <a
                        key={docIdx}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all"
                      >
                        <Icon className="w-4 h-4 text-slate-500 group-hover:text-blue-600" />
                        <span>{doc.name}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-1.5 bg-green-50 text-[#4CA30D] px-3 py-1.5 rounded-full border border-green-100">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-semibold text-[#1A1A2E]">
                Supplier verified
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}