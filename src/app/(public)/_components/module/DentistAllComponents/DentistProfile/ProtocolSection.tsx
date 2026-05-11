import { HiShieldCheck } from "react-icons/hi2";

export default function ProtocolSection() {
  const protocols = [
    { label: "Licence", value: "MX-2847361" },
    { label: "Sterilization protocol", value: "In-app video submitted" },
    { label: "CE certificate Veneers", value: "Accepted" },
    { label: "CE certificate Implants", value: "Accepted" },
    { label: "Material supplier invoices", value: "Publicly visible" },
    { label: "Profile freshness", value: "Updated 14 days ago" },
  ];

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6">
      <h2 className="text-xl lg:text-2xl font-bold text-[#033355] mb-8">
        Clinical Protocols & Verification
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {protocols.map((p, i) => (
          <div key={i} className="space-y-2">
            <p className="text-xs text-[#6B7280]">{p.label}</p>
            <div className="flex items-center gap-2">
              <HiShieldCheck className="size-4.5 text-[#4CA30D]" />
              <span className="text-[15px] font-bold text-slate-800">
                {p.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
