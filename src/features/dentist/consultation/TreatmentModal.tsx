"use client";

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

// Shadcn UI primitives
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog";
import { useProposeTreatmentPlan } from "@/hooks/treatment-plan/useTreatmentPlan";

const formSchema = z.object({
  procedures: z.array(
    z.object({
      name: z.string().min(1, "Procedure name is required"),
      price: z.coerce.number().min(0, "Price must be 0 or greater"),
      notes: z.string().optional(),
    }),
  ).min(1, "At least one procedure is required"),
  additionalInfo: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateTreatmentPlanModal({
  isOpen,
  onClose,
  consultation,
}: {
  isOpen: boolean;
  onClose: () => void;
  consultation: any;
}) {
  const proposePlan = useProposeTreatmentPlan();

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
  });

  React.useEffect(() => {
    if (isOpen && consultation) {
      const defaultProcedures = consultation.treatmentPlan?.lineItems?.map((item: any) => ({
        name: item.globalProcedure?.name || "Procedure",
        price: Number(item.unitPrice),
        notes: item.notes || "",
      })) || [
          {
            name: "",
            price: 0,
            notes: "",
          }
        ];

      reset({
        procedures: defaultProcedures,
        additionalInfo: consultation.treatmentPlan?.notes || "",
      });
    }
  }, [isOpen, consultation, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "procedures",
  });
  const watchProcedures = watch("procedures");
  const totalCost =
    watchProcedures?.reduce(
      (acc, curr) => acc + (Number(curr.price) || 0),
      0,
    ) || 0;

  const onSubmit = (data: FormValues) => {
    if (!consultation?.id) return;
    proposePlan.mutate(
      {
        consultationId: consultation.id,
        notes: data.additionalInfo,
        procedures: data.procedures.map((p) => ({
          name: p.name,
          price: Number(p.price),
          notes: p.notes,
        })),
      },
      {
        onSuccess: () => {
          toast.success("Treatment plan sent to patient successfully!");
          onClose();
        },
        onError: (err: any) => {
          toast.error(err?.message || "Failed to create treatment plan.");
        },
      }
    );
  };

  const patientName = consultation
    ? `${consultation.intake?.firstName || ""} ${consultation.intake?.lastName || ""}`.trim()
    : "Patient";

  const initials = consultation
    ? `${consultation.intake?.firstName?.[0] || ""}${consultation.intake?.lastName?.[0] || ""}`.toUpperCase()
    : "P";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay className="bg-black/20 backdrop-blur-sm" />
        <DialogContent className="sm:max-w-275 w-[95vw] rounded-lg overflow-y-auto p-0 overflow-hidden border-none shadow-2xl bg-white focus:outline-none">
          {/* Header */}
          <div className="px-8 py-6 border-b border-slate-200">
            <DialogTitle className="text-lg lg:text-xl font-semibold text-text">
              Create Treatment Plan
            </DialogTitle>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-h-200 overflow-y-auto"
          >
            {/* Patient Header Section */}
            <section className="px-8 py-10 bg-[#F9FAFB]">
              <div className="flex flex-col gap-8 items-start">

                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 bg-[#E8EEF2]">
                    <AvatarFallback className="text-[#5B7083] font-semibold text-xl">
                      {initials || "P"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-semibold text-slate-900">
                        {patientName}
                      </h3>
                      <span className="px-3 py-1 bg-[#F0F2F5] text-sec-text text-[12px] rounded-full border border-slate-200">
                        {consultation?.treatmentPlan ? consultation.treatmentPlan.status : "Not Sent"}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[16px]">
                      {consultation?.intake?.email}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 items-center w-full">
                    <div className="space-y-1">
                      <p className="text-xs text-[#777779] font-medium">
                        Treatment Procedure
                      </p>
                      <p className="text-sm font-semibold text-[#111113]">
                        {consultation?.intake?.procedureNames?.[0] || "N/A"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-[#777779] font-medium">
                        Appox Budget
                      </p>
                      <p className="text-sm font-semibold text-[#111113]">
                        {consultation?.intake?.budget || "N/A"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-[#777779] font-medium">
                        Traveling Dates
                      </p>
                      <p className="text-sm font-semibold text-[#111113]">
                        {consultation?.intake?.travelFrom
                          ? `${new Date(consultation.intake.travelFrom).toLocaleDateString()} - ${consultation.intake.travelTo ? new Date(consultation.intake.travelTo).toLocaleDateString() : ""}`
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                  {/* Dental History Box */}
                  <div className="border border-slate-100 rounded-lg bg-white p-0 overflow-hidden">
                    <div className="p-4 border-b border-slate-100">
                      <p className="text-sm font-semibold text-[#4A4A4C]">
                        Dental History
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 divide-x divide-slate-100">
                      <div className="p-4">
                        <p className="text-[12px] text-sec-text mb-1">
                          Last Visited
                        </p>
                        <p className="text-[14px] font-bold text-slate-800">
                          {consultation?.intake?.lastVisit || "N/A"}
                        </p>
                      </div>
                      <div className="p-4">
                        <p className="text-[12px] text-sec-text mb-1">
                          Existing conditions
                        </p>
                        <p className="text-[14px] font-bold text-slate-800">
                          {consultation?.intake?.conditions?.join(", ") || "None"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Procedures Form Section */}
            <div className="px-8 space-y-6 py-4 bg-white">
              <div className="space-y-6">
                <AnimatePresence mode="popLayout">
                  {fields.map((field, index) => (
                    <motion.div
                      key={field.id}
                      className="flex flex-col md:flex-row items-start gap-4 relative"
                    >
                      <div className="w-full md:w-[50%] space-y-2">
                        <label className="text-sm font-medium text-[#414651] inline-block">
                          Procedure {index + 1}
                        </label>
                        <Input
                          {...register(`procedures.${index}.name`)}
                          className={`h-15 text-sm text-[#181D27] border-slate-200 rounded-lg bg-white focus-visible:ring-0 ${errors.procedures?.[index]?.name ? "border-red-500 focus-visible:ring-red-100" : ""
                            }`}
                        />
                        {errors.procedures?.[index]?.name && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.procedures[index]?.name?.message}
                          </p>
                        )}
                      </div>

                      <div className="w-full md:w-[50%] space-y-2">
                        <label className="text-sm font-medium text-[#414651] inline-block">
                          Pricing
                        </label>
                        <div className="relative">
                          <span className="absolute left-0 rounded-l-lg top-0 bottom-0 w-8 bg-[#FAFAFA] flex items-center justify-center text-slate-400 border border-slate-200">
                            $
                          </span>
                          <Input
                            type="number"
                            min={0}
                            onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
                            {...register(`procedures.${index}.price`)}
                            className={`h-15 pl-12 text-sm text-[#181D27] border-slate-200 overflow-hidden rounded-lg focus-visible:ring-0 ${errors.procedures?.[index]?.price ? "border-red-500 focus-visible:ring-red-100" : ""
                              }`}
                          />
                        </div>
                        {errors.procedures?.[index]?.price && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.procedures[index]?.price?.message}
                          </p>
                        )}
                      </div>

                      <div className="w-full md:grow space-y-2">
                        <label className="text-sm font-medium text-[#414651] inline-block">
                          Option Notes
                        </label>
                        <Input
                          {...register(`procedures.${index}.notes`)}
                          className="h-15 text-sm text-[#181D27] border-slate-200 rounded-lg focus-visible:ring-0"
                        />
                      </div>

                      <div className="pt-10 flex items-center h-full">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => remove(index)}
                          className="p-0 hover:bg-transparent"
                        >
                          <X className="h-7 w-7 text-slate-400" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <Button
                type="button"
                onClick={() => append({ name: "", price: 0, notes: "" })}
                className="bg-[#0A3D5B] hover:bg-[#082f46] text-white font-semibold rounded-lg px-8 h-11 text-[16px]"
              >
                Add Procedure
              </Button>

              {/* Total Cost Row */}
              <div className="p-5 rounded-lg border border-slate-200 flex justify-between items-center bg-white">
                <span className="text-sm font-semibold text-[#4A4A4C]">Total Cost</span>
                <span className=" font-semibold text-primary">
                  ${totalCost}
                </span>
              </div>

              {/* Additional Information */}
              <div className="space-y-2 pt-4">
                <label className="text-sm font-medium text-sec-text inline-block">
                  Any other information to share?
                </label>
                <Textarea
                  {...register("additionalInfo")}
                  placeholder="Care instructions, follow-up"
                  className="min-h-35 border-slate-200 rounded-lg p-4 text-[16px] resize-none focus-visible:ring-0"
                />
              </div>
            </div>

            {/* Sticky Footer */}
            <footer className="p-6 border-t border-slate-100 flex justify-end gap-4 bg-white">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="border border-slate-200 text-slate-500 h-14 px-8 rounded-lg font-semibold hover:bg-slate-50"
              >
                Skip for now
              </Button>
              <Button
                type="submit"
                disabled={proposePlan.isPending}
                className="bg-primary hover:bg-[#082f46] cursor-pointer text-white h-14 px-8 rounded-lg font-semibold disabled:opacity-50"
              >
                {proposePlan.isPending ? "Sending..." : "Create plan and send to patient"}
              </Button>
            </footer>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
