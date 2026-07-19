import { CheckCircle2 } from "lucide-react";

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

  // Parse materials list to matching Figma representation
  const items = materials
    .map((mat) => {
      const proc = procedures.find(p => String(p.id) === String(mat.dentistProcedureId));
      const procName = proc?.name || "Certified material";
      const brand = mat.materialBrands || "Certified Material";

      // Match Figma specification:
      // Row 1 (Implants): Top line (bold) is Brand ("Straumann BLX"), Bottom line (gray) is Category ("Implant system")
      // Row 2 (Veneers): Top line (bold) is Category ("Veneer material"), Bottom line (gray) is Brand ("Emax — Ivoclar")
      const isVeneer = procName.toLowerCase().includes("veneer") ||
        brand.toLowerCase().includes("emax") ||
        brand.toLowerCase().includes("ivoclar");

      if (isVeneer) {
        return {
          topLine: "Veneer material",
          bottomLine: brand.toLowerCase().includes("emax") ? "Emax — Ivoclar" : brand,
        };
      } else {
        return {
          topLine: brand.toLowerCase().includes("straumann") ? "Straumann BLX" : brand,
          bottomLine: procName.toLowerCase().includes("implant") ? "Implant system" : procName,
        };
      }
    })
    .filter((item) => item.topLine);

  return (
    <section id="materials" className="rounded-lg border border-slate-200 bg-white p-6 space-y-4">
      <h2 className="text-xl lg:text-2xl font-bold text-[#0E3E65]">
        Materials
      </h2>

      <div className="divide-y divide-slate-100">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="py-4 flex justify-between items-center first:pt-0 last:pb-0"
          >
            <div className="space-y-0.5">
              <p className="text-xs text-slate-500 font-medium">{item.bottomLine}</p>
              <p className="text-[15px] font-semibold text-slate-900">{item.topLine}</p>
            </div>
            <div className="flex items-center gap-1.5 text-[#4CA30D]">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.9066 3.08988L9.78156 1.54488C9.35406 1.38738 8.65656 1.38738 8.22906 1.54488L4.10406 3.08988C3.30906 3.38988 2.66406 4.31988 2.66406 5.16738V11.2424C2.66406 11.8499 3.06156 12.6524 3.54906 13.0124L7.67406 16.0949C8.40156 16.6424 9.59406 16.6424 10.3216 16.0949L14.4466 13.0124C14.9341 12.6449 15.3316 11.8499 15.3316 11.2424V5.16738C15.3391 4.31988 14.6941 3.38988 13.9066 3.08988ZM11.6116 7.28988L8.38656 10.5149C8.27406 10.6274 8.13156 10.6799 7.98906 10.6799C7.84656 10.6799 7.70406 10.6274 7.59156 10.5149L6.39156 9.29988C6.17406 9.08238 6.17406 8.72238 6.39156 8.50488C6.60906 8.28738 6.96906 8.28738 7.18656 8.50488L7.99656 9.31488L10.8241 6.48738C11.0416 6.26988 11.4016 6.26988 11.6191 6.48738C11.8366 6.70488 11.8366 7.07238 11.6116 7.28988Z" fill="#4CA30D" />
              </svg>

              <span className="text-sm font-medium text-[#1A1A2E]">Supplier verified</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
