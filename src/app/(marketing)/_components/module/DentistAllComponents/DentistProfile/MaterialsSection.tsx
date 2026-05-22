import { ShieldCheck } from "lucide-react";

const materials = [
  {
    category: "Veneers",
    items: [
      { name: "IPS e.max® Press", supplier: "Ivoclar Vivadent", certified: true },
      { name: "VITA VM 9", supplier: "VITA Zahnfabrik", certified: true },
    ],
  },
  {
    category: "Implants",
    items: [
      { name: "Straumann® BLT", supplier: "Straumann Group", certified: true },
      { name: "Nobel Biocare CC", supplier: "Nobel Biocare", certified: true },
    ],
  },
  {
    category: "Composites & Bonding",
    items: [
      { name: "Filtek™ Supreme Ultra", supplier: "3M ESPE", certified: true },
      { name: "Tetric EvoCeram®", supplier: "Ivoclar Vivadent", certified: true },
    ],
  },
];

export default function MaterialsSection() {
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
        {materials.map((group) => (
          <div key={group.category}>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">
              {group.category}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {group.items.map((item) => (
                <div
                  key={item.name}
                  className="flex items-start gap-3 rounded-xl border border-slate-200 bg-[#F8FAFC] p-4"
                >
                  <ShieldCheck className="size-5 text-[#4CA30D] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">{item.name}</p>
                    <p className="text-xs text-[#6B7280]">{item.supplier}</p>
                    {item.certified && (
                      <span className="mt-1.5 inline-block text-[10px] font-bold text-[#4CA30D] bg-green-50 rounded-full px-2 py-0.5">
                        Supplier invoice verified
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
