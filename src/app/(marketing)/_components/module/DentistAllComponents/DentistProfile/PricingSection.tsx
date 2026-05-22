import { BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Initial Consultation",
    description: "Virtual or in-clinic first visit, full dental exam and X-rays",
    price: 80,
    features: [
      "Full oral health assessment",
      "X-ray analysis",
      "Personalized treatment plan",
      "Q&A session",
    ],
  },
  {
    name: "Veneer Package (6 teeth)",
    description: "Porcelain or composite veneers, smile design included",
    price: 1500,
    highlighted: true,
    features: [
      "Smile design preview",
      "Porcelain or composite material",
      "6 teeth included",
      "2 follow-up visits",
      "No Surprise Guarantee",
    ],
  },
  {
    name: "Full Implant",
    description: "Single tooth implant with crown, all-inclusive price",
    price: 900,
    features: [
      "Titanium implant post",
      "Ceramic crown",
      "Surgical guide",
      "1-year warranty",
    ],
  },
];

export default function PricingSection() {
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
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-xl border p-5 space-y-4 flex flex-col ${
              plan.highlighted
                ? "border-[#003366] bg-[#EEF8FF]"
                : "border-slate-200 bg-white"
            }`}
          >
            {plan.highlighted && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#003366] px-3 py-1 text-[11px] font-bold text-white w-fit">
                <BadgeCheck className="size-3.5" /> Most Popular
              </span>
            )}
            <div>
              <p className="text-base font-bold text-slate-900">{plan.name}</p>
              <p className="text-xs text-[#6B7280] mt-1">{plan.description}</p>
            </div>
            <div className="text-2xl font-extrabold text-[#0E3E65]">
              ${plan.price.toLocaleString()}
              <span className="text-sm font-medium text-slate-400 ml-1">USD</span>
            </div>
            <ul className="space-y-2 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                  <BadgeCheck className="size-4 text-[#4CA30D] shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              className={`w-full h-10 rounded-lg font-semibold text-sm ${
                plan.highlighted
                  ? "bg-[#003366] text-white hover:bg-[#002850]"
                  : "bg-white border border-[#003366] text-[#003366] hover:bg-slate-50"
              }`}
              variant={plan.highlighted ? "default" : "outline"}
            >
              Book this package
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
