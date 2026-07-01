import { Lock, DollarSign, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PricingPlaceholderProps {
  dentist: any;
}

export function PricingPlaceholder({ dentist }: PricingPlaceholderProps) {
  const procedures = dentist?.dentistProcedures || [];

  if (procedures.length === 0) {
    return (
      <div className="rounded-lg border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-gray-50 px-6 py-4">
          <h3 className="text-lg font-bold text-gray-900">Pricings</h3>
        </div>
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F1F8] text-[#163E5C]">
            <Lock className="h-6 w-6" />
          </div>
          <h4 className="mb-2 text-base font-bold text-gray-900">
            Procedure pricing
          </h4>
          <p className="max-w-[340px] text-sm leading-relaxed text-gray-400">
            Complete Phase 1 and Phase 2 verification to start adding your procedure prices.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-100 bg-white shadow-sm overflow-hidden transition-all duration-300">
      <div className="border-b border-gray-50 px-6 py-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Procedure Pricings</h3>
        <Badge variant="secondary" className="bg-[#E8F1F8] text-[#163E5C] border-none px-3 py-1 font-semibold">
          {procedures.length} {procedures.length === 1 ? 'Procedure' : 'Procedures'}
        </Badge>
      </div>

      <div className="divide-y divide-gray-100">
        {procedures.map((proc: any, index: number) => {
          const name = proc.globalProcedure?.name || proc.notes || "Procedure";
          const notes = proc.globalProcedure?.name ? proc.notes : "";
          const isVerified = proc.isVerified;

          return (
            <div
              key={proc.id || index}
              className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
            >
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-900">{name}</p>
                {notes && (
                  <p className="text-xs text-gray-400 flex items-center gap-1.5">
                    <Info className="h-3 w-3 inline text-gray-300" />
                    {notes}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4">
                <span className="text-lg font-bold text-[#163E5C] flex items-center">
                  <DollarSign className="h-4.5 w-4.5 text-[#163E5C]" />
                  {proc.price}
                </span>
                {isVerified ? (
                  <Badge className="bg-green-50 text-green-600 border-none font-semibold hover:bg-green-100 transition-colors">
                    Verified
                  </Badge>
                ) : (
                  <Badge className="bg-amber-50 text-amber-600 border-none font-semibold hover:bg-amber-100 transition-colors">
                    Pending
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
