import { Trash2 } from "lucide-react";

export function PaymentMethodsView() {
  const cards = [
    {
      id: 1,
      type: "Mastercard",
      last4: "3800",
      expiry: "12/12/2026",
      isDefault: true,
    },
    {
      id: 2,
      type: "Mastercard",
      last4: "3800",
      expiry: "12/12/2026",
      isDefault: false,
    },
  ];

  return (
    <div className="space-y-10">
      <h2 className="text-[28px] font-bold text-[#1A1A2E]">Payment Methods</h2>

      <div className="space-y-4">
        {cards.map((card) => (
          <div
            key={card.id}
            className="flex items-center justify-between p-6 rounded-2xl border border-slate-100 bg-white"
          >
            <div className="flex items-center gap-6">
              <div
                className={`size-6 rounded-full border-2 flex items-center justify-center ${card.isDefault ? "border-[#0F3659]" : "border-slate-300"}`}
              >
                {card.isDefault && (
                  <div className="size-3 rounded-full bg-[#0F3659]" />
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-slate-50 rounded flex items-center justify-center font-bold text-red-500 italic text-xs">
                  {/* Substitute with SVG for Mastercard logo */}
                  MC
                </div>
                <div>
                  <h4 className="font-bold text-[#1A1A2E] text-lg">
                    {card.type} **** {card.last4}
                  </h4>
                  <p className="text-slate-400 text-sm font-medium">
                    Expiry: {card.expiry}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {card.isDefault && (
                <span className="px-4 py-1.5 rounded-full bg-[#ECFDF5] text-[#10B981] text-sm font-bold">
                  Default
                </span>
              )}
              <button className="text-red-400 hover:text-red-600 transition-colors">
                <Trash2 className="size-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-4">
        <button className="px-10 py-4 rounded-xl bg-[#0F3659] font-bold text-white text-xl hover:bg-[#0a2640]">
          Add New Card
        </button>
      </div>
    </div>
  );
}
