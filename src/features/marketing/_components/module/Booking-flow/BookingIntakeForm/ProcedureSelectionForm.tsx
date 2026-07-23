"use client";
import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import {
  getBookingData,
  updateTreatmentDetails,
} from "@/lib/storage/bookingService";
import { useGlobalProcedures } from "@/hooks/procedures/useProcedures";


type ProcedureOption = {
  id: string;
  name: string;
  slug: string;
};


export default function ProcedureSelectionForm({
  errors,
  setErrors,
}: {
  errors?: Record<string, string>;
  setErrors?: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}) {

  const [selectedIds, setSelectedIds] = useState<string[]>(
    () => getBookingData().procedureIds,
  );

  const { data: procedureOptions = [], isLoading } = useGlobalProcedures();

  const handleSelectProcedure = (id: string) => {
    const nextIds = selectedIds.includes(id)
      ? selectedIds.filter((item) => item !== id)
      : [...selectedIds, id];

    setSelectedIds(nextIds);
    const selectedTitles = procedureOptions
      .filter((procedure: ProcedureOption) => nextIds.includes(procedure.id))
      .map((procedure: ProcedureOption) => procedure.name);

    updateTreatmentDetails({
      procedure: selectedTitles.join(", "),
      procedureIds: nextIds,
    });

    if (nextIds.length > 0 && setErrors) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.procedures;
        return next;
      });
    }
  };

  return (
    <div className="w-full bg-white">
      <h2 className="text-[22px] font-bold text-[#1A1A2E] mb-6">
        What procedure are you interested in?
      </h2>

      {errors?.procedures && (
        <p className="p-3 mb-4 rounded-lg bg-red-50 border border-red-200 text-xs font-semibold text-destructive animate-in fade-in slide-in-from-top-1">
          {errors.procedures}
        </p>
      )}

      {isLoading && (
        <div className="mb-4 flex items-center gap-2 text-sm font-medium text-[#6B7280]">
          <Loader2 className="size-4 animate-spin" />
          Loading procedures...
        </div>
      )}

      <div className="space-y-4 max-h-100 overflow-y-scroll">
        {procedureOptions.map((item: any) => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <div
              key={item.slug}
              onClick={() => handleSelectProcedure(item.id)}
              className={`
                group cursor-pointer relative flex items-center justify-between 
                p-5 rounded-lg border-2 transition-all duration-200
                ${isSelected
                  ? "border-[#113254] bg-[#F8FAFC]"
                  : "border-[#F3F4F6] hover:border-[#E5E7EB] bg-white"
                }
              `}
            >
              <div className="flex flex-col gap-1">
                <span
                  className={`text-[17px] font-bold ${isSelected ? "text-[#113254]" : "text-[#1A1A2E]"}`}
                >
                  {item.name}
                </span>

              </div>

              <div className="shrink-0">
                {isSelected ? (
                  <CheckCircle2 className="w-6 h-6 text-[#113254] fill-[#113254]" />
                ) : (
                  <Circle className="w-6 h-6 text-[#D1D5DB]" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
