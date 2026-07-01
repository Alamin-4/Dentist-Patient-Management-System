import { ShieldCheck } from "lucide-react";

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
      <section className="rounded-lg border border-slate-200 bg-white p-6 space-y-6">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-[#0E3E65] mb-1">
            Materials Used
          </h2>
          <p className="text-sm text-[#6B7280]">
            Only certified, internationally recognized dental materials are used in all procedures.
          </p>
        </div>
        <div className="text-center py-10 text-slate-500 bg-[#F8FAFC] rounded-lg border border-dashed border-slate-200">
          No material certifications have been uploaded or verified for this dentist.
        </div>
      </section>
    );
  }

  // Helper to extract file name or return fallback
  const getDocLabel = (url: string, fallback: string) => {
    if (!url) return "";
    try {
      const parts = url.split("/");
      const fileName = parts[parts.length - 1];
      return fileName.length > 30 ? fileName.substring(0, 27) + "..." : fileName;
    } catch {
      return fallback;
    }
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 space-y-6">
      <div>
        <h2 className="text-xl lg:text-2xl font-bold text-[#0E3E65] mb-1">
          Materials Used
        </h2>
        <p className="text-sm text-[#6B7280]">
          Only certified, internationally recognized dental materials are used in all procedures.
        </p>
      </div>

      <div className="space-y-6">
        {materials.map((mat, idx) => {
          const proc = procedures.find(
            (p) => String(p.id) === String(mat.dentistProcedureId)
          );
          const categoryName = proc?.name || "Procedure Documents";

          const items = [];
          if (mat.ceCertificate) {
            items.push({
              name: "CE Certificate",
              detail: getDocLabel(mat.ceCertificate, "ce_certificate.pdf"),
            });
          }
          if (mat.materialBrands) {
            items.push({
              name: "Material Brands",
              detail: getDocLabel(mat.materialBrands, "material_brands.pdf"),
            });
          }
          if (mat.invoice) {
            items.push({
              name: "Supplier Invoice",
              detail: getDocLabel(mat.invoice, "invoice.pdf"),
            });
          }
          if (mat.protocolPdf) {
            items.push({
              name: "Clinical Protocol",
              detail: getDocLabel(mat.protocolPdf, "protocol_pdf.pdf"),
            });
          }

          if (items.length === 0) return null;

          return (
            <div key={idx}>
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">
                {categoryName}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="flex items-start gap-3 rounded-lg border border-slate-200 bg-[#F8FAFC] p-4"
                  >
                    <ShieldCheck className="size-5 text-[#4CA30D] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-slate-900">{item.name}</p>
                      <p className="text-xs text-[#6B7280] truncate max-w-[200px]" title={item.detail}>
                        {item.detail}
                      </p>
                      <span className="mt-1.5 inline-block text-[10px] font-bold text-[#4CA30D] bg-green-50 rounded-full px-2 py-0.5">
                        Supplier invoice verified
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
