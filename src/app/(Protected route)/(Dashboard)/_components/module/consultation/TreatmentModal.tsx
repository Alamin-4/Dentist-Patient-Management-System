"use client";

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

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

const formSchema = z.object({
  procedures: z.array(
    z.object({
      name: z.string().min(1, "Required"),
      price: z.coerce.number().min(0),
      notes: z.string().optional(),
    }),
  ),
  additionalInfo: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateTreatmentPlanModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      procedures: [
        {
          name: "Implant consultation",
          price: 250,
          notes: "Includes treatment plan review",
        },
        {
          name: "Implant consultation",
          price: 250,
          notes: "Includes treatment plan review",
        },
      ],
    },
  });

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay className="bg-black/20 backdrop-blur-sm" />
        <DialogContent className="sm:max-w-275 w-[95vw] max-h-200 overflow-y-auto p-0 overflow-hidden border-none shadow-2xl bg-white focus:outline-none rounded-none">
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
            <DialogTitle className="text-[26px] font-medium text-slate-800">
              Create Treatment Plan
            </DialogTitle>
          </div>

          <form
            onSubmit={handleSubmit((d) => console.log(d))}
            className="overflow-y-auto max-h-[90vh]"
          >
            {/* Patient Header Section */}
            <section className="px-8 py-10 bg-[#F9FAFB]">
              <div className="flex flex-col gap-8 items-start">
                {/* Avatar & Name */}
                <div className="flex items-center gap-4 min-w-70">
                  <Avatar className="h-16 w-16 bg-[#E8EEF2]">
                    <AvatarFallback className="text-[#5B7083] font-semibold text-xl">
                      AH
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-semibold text-slate-900">
                        Jacob Smith
                      </h3>
                      <span className="px-3 py-1 bg-[#F0F2F5] text-[#6B7280] text-[12px] rounded-full border border-slate-200">
                        Not Sent
                      </span>
                    </div>
                    <p className="text-slate-500 text-[16px]">
                      Jacob.smith@sample.com
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  {/* Treatment Details with Vertical Dividers */}
                  <div className="flex flex-wrap lg:flex-nowrap grow gap-0 pt-2 lg:pt-0">
                    <div className="px-8 space-y-1 min-w-45">
                      <p className="text-[14px] text-slate-400 font-medium">
                        Treatment Procedure
                      </p>
                      <p className="text-[18px] font-semibold text-slate-800">
                        Dental Implants
                      </p>
                    </div>
                    <div className="px-8 space-y-1 min-w-37 border-l border-slate-200">
                      <p className="text-[14px] text-slate-400 font-medium">
                        Appox Budget
                      </p>
                      <p className="text-[18px] font-semibold text-slate-800">
                        $1254
                      </p>
                    </div>
                    <div className="px-8 space-y-1 min-w-45 border-l border-slate-200">
                      <p className="text-[14px] text-slate-400 font-medium">
                        Traveling Dates
                      </p>
                      <p className="text-[18px] font-semibold text-slate-800">
                        Wed 24 Jan, 2024
                      </p>
                    </div>
                  </div>
                  {/* Dental History Box */}
                  <div className="border border-slate-200 rounded-xl bg-white p-0 min-w-85 overflow-hidden">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-[14px] font-medium text-slate-500">
                        Dental History
                      </p>
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-slate-100">
                      <div className="p-4">
                        <p className="text-[12px] text-slate-400 font-medium mb-1">
                          Last Visited
                        </p>
                        <p className="text-[14px] font-bold text-slate-800">
                          Wed 24 Jan, 2024
                        </p>
                      </div>
                      <div className="p-4">
                        <p className="text-[12px] text-slate-400 font-medium mb-1">
                          Any existing dental conditions?
                        </p>
                        <p className="text-[14px] font-bold text-slate-800">
                          Bone loss,{" "}
                          <span className="font-normal text-slate-500">
                            Gum Disease
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Procedures Form Section */}
            <div className="px-8 py-10 space-y-8 bg-white">
              <div className="space-y-6">
                <AnimatePresence mode="popLayout">
                  {fields.map((field, index) => (
                    <motion.div
                      key={field.id}
                      className="flex flex-col md:flex-row items-start gap-4 relative"
                    >
                      <div className="w-full md:w-[28%] space-y-2">
                        <label className="text-[16px] font-medium text-slate-600">
                          Procedure 1
                        </label>
                        <Input
                          {...register(`procedures.${index}.name`)}
                          className="h-15 text-[16px] border-slate-200 rounded-lg bg-white focus-visible:ring-0"
                        />
                      </div>

                      <div className="w-full md:w-[22%] space-y-2">
                        <label className="text-[16px] font-medium text-slate-600">
                          Pricing
                        </label>
                        <div className="relative">
                          <span className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center text-slate-400 border-r border-slate-200">
                            $
                          </span>
                          <Input
                            type="number"
                            {...register(`procedures.${index}.price`)}
                            className="h-15 pl-16 text-[16px] border-slate-200 rounded-lg focus-visible:ring-0"
                          />
                        </div>
                      </div>

                      <div className="w-full md:grow space-y-2">
                        <label className="text-[16px] font-medium text-slate-600">
                          Option Notes
                        </label>
                        <Input
                          {...register(`procedures.${index}.notes`)}
                          className="h-15 text-[16px] border-slate-200 rounded-lg focus-visible:ring-0"
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
              <div className="mt-12 p-5 rounded-lg border border-slate-200 flex justify-between items-center bg-white">
                <span className="text-[18px] text-slate-600">Total Cost</span>
                <span className="text-[24px] font-bold text-[#0A3D5B]">
                  ${totalCost}
                </span>
              </div>

              {/* Additional Information */}
              <div className="space-y-4 pt-4">
                <label className="text-[18px] font-medium text-slate-600">
                  Any other information to share?
                </label>
                <Textarea
                  {...register("additionalInfo")}
                  placeholder="Care instructions, follow-up"
                  className="min-h-35 border-slate-200 rounded-xl p-4 text-[16px] resize-none focus-visible:ring-0"
                />
              </div>
            </div>

            {/* Sticky Footer */}
            <footer className="p-8 border-t border-slate-100 flex justify-end bg-white">
              <Button
                type="submit"
                className="bg-[#0A3D5B] hover:bg-[#082f46] text-white h-16 px-12 rounded-xl text-[18px] font-semibold"
              >
                Create plan and send to patient
              </Button>
            </footer>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
