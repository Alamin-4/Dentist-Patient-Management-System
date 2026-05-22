"use client";

import { CheckCircle2 } from "lucide-react";

export default function VerificationSection({ dentist }: { dentist: any }) {
  const protocols = [
    { label: "Licence", value: "MX-2847361" },
    { label: "Sterilization protocol", value: "In-app video submitted" },
    { label: "CE certificate Veneers", value: "Accepted" },
    { label: "CE certificate Implants", value: "Accepted" },
    { label: "Material supplier invoices", value: "Publicly visible" },
    { label: "Profile freshness", value: "Updated 14 days ago" },
  ];

  return (
    <div className="rounded-[24px] border border-slate-100 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-black text-[#003366] tracking-tight mb-8">
        Clinical Protocols & Verification
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-10 gap-x-6">
        {protocols.map((item) => (
          <div key={item.label} className="space-y-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {item.label}
            </p>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-[#4CA30D] fill-green-50" />
              <span className="text-sm font-bold text-slate-800">
                {item.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
