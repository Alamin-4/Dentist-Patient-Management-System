"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import PhaseStep from "../PhaseStep";
import { useState } from "react";
import { useGlobalProcedureList } from "@/hooks/dentist/useDentist";
import { Plus, Trash2 } from "lucide-react";

interface GlobalProcedure { id: number; name: string; }

export const ProcedurePricingSection = ({ disabled }: { disabled?: boolean }) => {
  const { control, register, setValue, watch, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: "procedures" });
  const { data: globalProcedureListData } = useGlobalProcedureList();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const proceduresList: GlobalProcedure[] = Array.isArray(globalProcedureListData?.data)
    ? globalProcedureListData.data
    : (Array.isArray(globalProcedureListData) ? globalProcedureListData : []);

  const watchProcedures = watch("procedures") || [];

  return (
    <section className="grid grid-cols-1 gap-8 border-t border-border px-5 py-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)] lg:px-8 lg:py-8">
      <PhaseStep step={2} title="Procedure Pricing" />

      <div className="space-y-4">
        {fields.map((field, index) => {
          const typedName = watchProcedures[index]?.name || "";
          const suggestions = proceduresList.filter((p) => p.name.toLowerCase().includes(typedName.toLowerCase()));
          const itemErrors = (errors.procedures as any)?.[index];

          return (
            <div key={field.id} className="grid grid-cols-1 gap-3 md:grid-cols-[1.5fr_1fr_2fr_auto] items-start">
              <div className="space-y-1.5 relative">
                <label className="text-xs font-medium text-muted-foreground">Name *</label>
                <input
                  {...register(`procedures.${index}.name`)}
                  disabled={disabled}
                  placeholder="e.g., Implant consultation"
                  onFocus={() => !disabled && setOpenIndex(index)}
                  onBlur={() => setTimeout(() => setOpenIndex(null), 200)}
                  className="h-11 w-full rounded-lg border border-border bg-card px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 disabled:opacity-60"
                />
                {!disabled && openIndex === index && suggestions.length > 0 && (
                  <ul className="absolute left-0 right-0 z-50 mt-1 max-h-48 overflow-y-auto rounded-lg border border-border bg-card py-1 shadow-lg">
                    {suggestions.map((s) => (
                      <li
                        key={s.id}
                        onMouseDown={() => {
                          setValue(`procedures.${index}.name`, s.name, { shouldValidate: true });
                          setValue(`procedures.${index}.id`, s.id);
                          setOpenIndex(null);
                        }}
                        className="cursor-pointer px-4 py-2 text-sm hover:bg-muted"
                      >
                        {s.name}
                      </li>
                    ))}
                  </ul>
                )}
                {itemErrors?.name && <p className="text-xs font-semibold text-destructive">{String(itemErrors.name.message)}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Price ($) *</label>
                <input
                  type="number"
                  min={0}
                  onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
                  disabled={disabled}
                  {...register(`procedures.${index}.price`, { valueAsNumber: true })}
                  className="h-11 w-full rounded-lg border border-border bg-card px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 disabled:opacity-60"
                />
                {itemErrors?.price && <p className="text-xs font-semibold text-destructive">{String(itemErrors.price.message)}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Option Notes</label>
                <input
                  disabled={disabled}
                  {...register(`procedures.${index}.notes`)}
                  placeholder="Includes treatment plan review"
                  className="h-11 w-full rounded-lg border border-border bg-card px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 disabled:opacity-60"
                />
              </div>

              <button
                type="button"
                disabled={disabled || fields.length === 1}
                onClick={() => remove(index)}
                className="flex h-11 w-11 mt-6 items-center justify-center rounded-lg border border-destructive/20 text-destructive transition hover:bg-destructive/10 disabled:opacity-40 disabled:cursor-not-allowed"
                title="Remove procedure"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          );
        })}

        {errors.procedures && !Array.isArray(errors.procedures) && (
          <p className="text-xs font-semibold text-destructive">{String((errors.procedures as any).message)}</p>
        )}

        {!disabled && (
          <Button type="button" variant="outline" onClick={() => append({ name: "", price: 0, notes: "" })} className="h-11 gap-2">
            <Plus className="size-4" /> Add Procedure
          </Button>
        )}
      </div>
    </section>
  );
};