"use client";

import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DocumentUpload } from "./DocumentUpload";
import { useFieldArray } from "react-hook-form";
import { Plus, Trash, Loader2 } from "lucide-react";
import { useVerificationStore } from "@/lib/hooks/verification-store-hooks";
import useDentist, {
  useUpdateVerificationPhase,
} from "@/hooks/dentist/useDentist";
import { StepThreeI } from "@/hooks/dentist/dentist.interface";
import toast from "react-hot-toast";
import useVerificationProgress from "@/hooks/dentist/useStepProgress";

const PROCEDURE_OPTIONS = [
  { value: "5", label: "Implants" },
  { value: "6", label: "Veneers" },
  { value: "7", label: "Crowns" },
] as const;

const isFile = (file: unknown): file is File =>
  typeof File !== "undefined" && file instanceof File;
const fileSchema = (message: string) =>
  z
    .any()
    .refine(isFile, message)
    .transform((file) => file as File);
const getErrorMessage = (message: unknown) =>
  typeof message === "string" ? message : undefined;

const materialsSchema = z.object({
  ownProcedure: z.string().min(1, "Select a procedure"),
  ceCertificate: fileSchema("CE Certificate is required"),
  materialBrands: fileSchema("Material brands file is required"),
  invoice: fileSchema("Invoice is required"),
  protocolPdf: fileSchema("Protocol PDF is required"),
});

const phase3Schema = z.object({
  clinic_address: z.string().min(1, "Clinic address is required"),
  materials: z.array(materialsSchema).min(1, "Add at least one procedure"),
});

type Phase3Values = z.infer<typeof phase3Schema>;
type Phase3InputValues = z.input<typeof phase3Schema>;

export default function Phase3() {
  const {
    setVerificationCompletedStep,
    setVerificationStep,
    setVerificationStepReady,
  } = useVerificationStore();
  const { stepThreeMutation } = useDentist();
  const updatePhase = useUpdateVerificationPhase();
  const { checkIdVerifyProgress } = useVerificationProgress();

  const progressData = checkIdVerifyProgress?.data;
  const isAlreadySubmitted = progressData?.submitted === true;

  const methods = useForm<Phase3InputValues, unknown, Phase3Values>({
    resolver: zodResolver(phase3Schema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      clinic_address: "",
      materials: [
        {
          ownProcedure: "",
          ceCertificate: null,
          materialBrands: null,
          invoice: null,
          protocolPdf: null,
        },
      ],
    },
  });

  useEffect(() => {
    if (isAlreadySubmitted && progressData?.data) {
      const serverData = progressData.data as any;
      
      let materials = [];
      try {
        materials = typeof serverData.materials === "string"
          ? JSON.parse(serverData.materials)
          : serverData.materials || [];
      } catch (e) {
        materials = serverData.materials || [];
      }

      methods.reset({
        clinic_address: serverData.clinic_address || "",
        materials: materials.map((m: any) => ({
          ownProcedure: String(m.own_procedure),
          ceCertificate: m.ce_certificate ? new File([], "CE Certificate") : null,
          materialBrands: m.material_brands ? new File([], "Material Brands") : null,
          invoice: m.invoice ? new File([], "Invoice") : null,
          protocolPdf: m.protocol_pdf ? new File([], "Protocol PDF") : null,
        })),
      });
    }
  }, [isAlreadySubmitted, progressData, methods]);

  const { control } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "materials",
  });

  const onSubmit = (payload: Phase3Values) => {
    if (isAlreadySubmitted) {
      toast.error("Phase 3 details are already submitted.");
      return;
    }

    const formattedPayload: StepThreeI = {
      clinic_address: payload.clinic_address,
      materials: payload.materials.map((m) => ({
        own_procedure: Number(m.ownProcedure),
        ce_certificate: m.ceCertificate,
        material_brands: m.materialBrands,
        invoice: m.invoice,
        protocol_pdf: m.protocolPdf,
      })),
    };

    stepThreeMutation.mutate(formattedPayload, {
      onSuccess: () => {
        updatePhase.mutate(
          { verification_phase: "COMPLETE" },
          {
            onSuccess: () => {
              setVerificationCompletedStep(3);
              setVerificationStep(3);
              setVerificationStepReady(3, true);
            },
            onError: (error: unknown) => {
              const errMsg =
                typeof error === "object" && error !== null
                  ? (error as { response?: { data?: { message?: string } } })
                      .response?.data?.message ||
                    "Verification submitted but phase completion update failed."
                  : "Verification submitted but phase completion update failed.";
              toast.error(errMsg);
            },
          },
        );
      },

      onError: (error: unknown) => {
        const errMsg =
          typeof error === "object" && error !== null
            ? (error as { response?: { data?: { message?: string } } }).response
                ?.data?.message ||
              "Clinical depth submission failed. Please try again."
            : "Clinical depth submission failed. Please try again.";
        toast.error(errMsg);
      },
    });
  };

  useEffect(() => {
    if (isAlreadySubmitted) {
      setVerificationStepReady(3, true);
      return;
    }
    const timeoutId = window.setTimeout(() => {
      setVerificationStepReady(3, methods.formState.isValid);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [methods.formState.isValid, isAlreadySubmitted, setVerificationStepReady]);

  const isPending = stepThreeMutation.isPending || updatePhase.isPending;

  return (
    <FormProvider {...methods}>
      <form
        id="phase-3-verification-form"
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8 p-6">
            <div className="space-y-2">
              <p className="text-xl text-[#0A2533]">Clinic Location</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-[#0A2533] inline-block mb-2">
                  Clinic Address
                </label>
                <input
                  type="text"
                  disabled={isAlreadySubmitted}
                  {...methods.register("clinic_address")}
                  className="border border-gray-200 rounded-md p-3 w-full disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="Enter your clinic address"
                />
                {methods.formState.errors?.clinic_address && (
                  <p className="text-xs text-red-500 mt-1">
                    {methods.formState.errors.clinic_address.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="border-b w-full"></div>
          {fields.map((field, index) => (
            <div key={field.id} className="divide-y divide-gray-100">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8 p-6 lg:p-8">
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#163E5C]">
                    STEP {index + 1}
                  </p>
                  <p className="text-xl text-[#0A2533]">Consultation Docs</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-[#0A2533] inline-block">
                      Procedure
                    </label>
                    <select
                      disabled={isAlreadySubmitted}
                      {...methods.register(
                        `materials.${index}.ownProcedure` as const,
                      )}
                      className="block w-full mt-2 rounded-md border border-gray-200 p-3 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <option value="">Select procedure</option>
                      {PROCEDURE_OPTIONS.map((procedure) => (
                        <option key={procedure.value} value={procedure.value}>
                          {procedure.label}
                        </option>
                      ))}
                    </select>
                    {methods.formState.errors?.materials?.[index]
                      ?.ownProcedure && (
                      <p className="text-xs text-red-500 mt-1">
                        {
                          methods.formState.errors.materials[index]
                            ?.ownProcedure?.message
                        }
                      </p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <DocumentUpload
                      label="Upload CE certificate"
                      name={`materials.${index}.ceCertificate`}
                      disabled={isAlreadySubmitted}
                      error={getErrorMessage(
                        methods.formState.errors.materials?.[index]
                          ?.ceCertificate?.message,
                      )}
                    />
                    <DocumentUpload
                      label="Upload Material brands"
                      name={`materials.${index}.materialBrands`}
                      disabled={isAlreadySubmitted}
                      error={getErrorMessage(
                        methods.formState.errors.materials?.[index]
                          ?.materialBrands?.message,
                      )}
                    />
                    <DocumentUpload
                      label="Upload Invoice"
                      name={`materials.${index}.invoice`}
                      disabled={isAlreadySubmitted}
                      error={getErrorMessage(
                        methods.formState.errors.materials?.[index]?.invoice
                          ?.message,
                      )}
                    />
                    <DocumentUpload
                      label="Upload protocol PDF"
                      name={`materials.${index}.protocolPdf`}
                      disabled={isAlreadySubmitted}
                      error={getErrorMessage(
                        methods.formState.errors.materials?.[index]?.protocolPdf
                          ?.message,
                      )}
                    />
                  </div>
                </div>
              </div>

              {!isAlreadySubmitted && (
                <div className="p-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="inline-flex items-center gap-2 text-sm text-red-600 hover:underline"
                  >
                    <Trash className="w-4 h-4" /> Remove procedure
                  </button>
                </div>
              )}
            </div>
          ))}

          {!isAlreadySubmitted && (
            <div className="p-6">
              <button
                type="button"
                onClick={() =>
                  append({
                    ownProcedure: "",
                    ceCertificate: null,
                    materialBrands: null,
                    invoice: null,
                    protocolPdf: null,
                  })
                }
                className="w-full rounded-xl border-2 border-dashed border-gray-200 p-5 flex items-center justify-center gap-3 text-sm text-gray-600 hover:bg-white"
              >
                <Plus className="w-4 h-4 text-gray-500" /> Add Procedure
              </button>
            </div>
          )}
        </div>
        {isPending && (
          <div className="flex justify-center items-center py-6 border-t bg-card">
            <Loader2 className="animate-spin h-6 w-6 text-[#0E3E65]" />
            <span className="ml-2 text-sm text-muted-foreground">
              Submitting Phase 3...
            </span>
          </div>
        )}
      </form>
    </FormProvider>
  );
}
