import { BadgeCheck } from "lucide-react";

export default function PricingSection({
  procedures = [],
}: {
  procedures?: Array<{
    id: string;
    name: string;
    price: number;
    notes?: string;
  }>;
}) {
  if (!procedures || procedures.length === 0) {
    return (
      <section id="pricing" className="rounded-lg border border-slate-200 bg-white p-6 space-y-4">
        <h2 className="text-xl lg:text-2xl font-bold text-[#0E3E65]">
          Pricing
        </h2>
        <div className="text-center py-6 text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-sm">
          No procedures or pricing details configured.
        </div>
      </section>
    );
  }

  return (
    <section id="pricing" className="rounded-lg border border-slate-200 bg-white p-6 space-y-4">
      <h2 className="text-xl lg:text-2xl font-bold text-[#0E3E65]">
        Pricing
      </h2>

      <div className="divide-y divide-slate-100">
        {procedures.map((proc, index) => (
          <div
            key={proc.id || index}
            className="py-4 flex justify-between items-center first:pt-0 last:pb-0"
          >
            <div className="space-y-0.5">
              <p className="text-[15px] font-semibold text-slate-900">{proc.name}</p>
              {proc.notes && (
                <p className="text-xs text-slate-500 font-medium">{proc.notes}</p>
              )}
            </div>
            <div className="text-[15px] font-extrabold text-[#0E3E65]">
              ${proc.price ? proc.price.toLocaleString() : "0"}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
