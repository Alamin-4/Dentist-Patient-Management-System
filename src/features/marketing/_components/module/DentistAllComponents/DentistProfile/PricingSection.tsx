import { BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      <section className="rounded-lg border border-slate-200 bg-white p-6 space-y-6">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-[#0E3E65] mb-1">
            Pricing & Packages
          </h2>
          <p className="text-sm text-[#6B7280]">
            All prices are all-inclusive. No hidden fees — guaranteed.
          </p>
        </div>
        <div className="text-center py-10 text-slate-500 bg-[#F8FAFC] rounded-lg border border-dashed border-slate-200">
          No procedures or pricing details have been configured for this dentist.
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 space-y-6">
      <div>
        <h2 className="text-xl lg:text-2xl font-bold text-[#0E3E65] mb-1">
          Pricing & Packages
        </h2>
        <p className="text-sm text-[#6B7280]">
          All prices are all-inclusive. No hidden fees — guaranteed.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {procedures.map((proc, index) => {
          const highlighted = index === 1;
          return (
            <div
              key={proc.id || index}
              className={`rounded-lg border p-5 space-y-4 flex flex-col ${highlighted
                  ? "border-[#003366] bg-[#EEF8FF]"
                  : "border-slate-200 bg-white"
                }`}
            >
              {highlighted && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#003366] px-3 py-1 text-[11px] font-bold text-white w-fit">
                  <BadgeCheck className="size-3.5" /> Most Popular
                </span>
              )}
              <div>
                <p className="text-base font-bold text-slate-900">{proc.name}</p>
                {proc.notes && (
                  <p className="text-xs text-[#6B7280] mt-1">{proc.notes}</p>
                )}
              </div>
              <div className="text-2xl font-extrabold text-[#0E3E65]">
                ${proc.price ? proc.price.toLocaleString() : "0"}
                <span className="text-sm font-medium text-slate-400 ml-1">USD</span>
              </div>
              <ul className="space-y-2 flex-1">
                <li className="flex items-start gap-2 text-sm text-slate-600">
                  <BadgeCheck className="size-4 text-[#4CA30D] shrink-0 mt-0.5" />
                  Verified Procedure Price
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-600">
                  <BadgeCheck className="size-4 text-[#4CA30D] shrink-0 mt-0.5" />
                  No Surprise Guarantee applies
                </li>
              </ul>
              <Button
                className={`w-full h-10 rounded-lg font-semibold text-sm ${highlighted
                    ? "bg-[#003366] text-white hover:bg-[#002850]"
                    : "bg-white border border-[#003366] text-[#003366] hover:bg-slate-50"
                  }`}
                variant={highlighted ? "default" : "outline"}
              >
                Book this package
              </Button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
