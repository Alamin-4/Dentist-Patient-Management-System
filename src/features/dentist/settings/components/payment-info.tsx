"use client";

import { useState, useEffect } from "react";
import { CreditCard, Pencil } from "lucide-react";

interface CardInfo {
  brand: string;
  last4: string;
  expiry: string;
}

interface PaymentInfoProps {
  connected?: boolean;
  card?: CardInfo | null;
}

export default function PaymentInfo({ connected = true, card = null }: PaymentInfoProps) {
  const [isConnected, setIsConnected] = useState(connected);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setIsConnected(connected);
  }, [connected]);

  return (
    <section className="rounded-lg border border-[#EEF2F7] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-[#EEF2F7] pb-4 mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-[#0E3E65]">Payment Information</h2>
          <span className="text-xs text-[#475569] bg-slate-100 px-2 py-0.5 rounded-full font-medium">Stripe Connect</span>
        </div>
        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer border ${isEditing
            ? "text-red-500 hover:bg-red-50 border-red-200"
            : "text-[#0F3659] hover:bg-slate-50 border-slate-200"
            }`}
        >
          <Pencil className="h-3.5 w-3.5" />
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      <div className="mt-4 space-y-4">
        {!isConnected ? (
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <p className="text-sm text-[#6B7280]">No payment method connected.</p>
            <button
              onClick={() => isConnected && setIsConnected(true)}
              disabled={!isEditing}
              className="ml-auto rounded-md bg-[#0F3659] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              Connect Stripe
            </button>
          </div>
        ) : (
          <div className="rounded-lg border border-slate-100 p-4 flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-14 rounded-md bg-linear-to-r from-[#FF8A65] to-[#F44336] flex items-center justify-center text-white">
                <CreditCard className="size-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-800">{card ? `${card.brand} **** ${card.last4}` : 'Mastercard **** 3800'}</div>
                <div className="text-xs text-[#6B7280] mt-1">Expiry: {card ? card.expiry : '12/12/2026'}</div>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <button
                disabled={!isEditing}
                className="rounded-md border border-slate-200 px-3 py-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Replace
              </button>
              <button
                disabled={!isEditing}
                className="rounded-md bg-[#0F3659] px-3 py-2 text-sm font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer hover:bg-[#0a2640] transition-colors"
              >
                Manage
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
