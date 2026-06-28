"use client";

import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DocumentUpload } from "./DocumentUpload";
import { useFieldArray } from "react-hook-form";
import { Plus, Trash, Loader2, MapPin } from "lucide-react";
import { useVerificationStore } from "@/lib/hooks/verification-store-hooks";
import useDentist, {
  useUpdateVerificationPhase,
} from "@/hooks/dentist/useDentist";
import { StepThreeI } from "@/hooks/dentist/dentist.interface";
import toast from "react-hot-toast";
import useVerificationProgress from "@/hooks/dentist/useStepProgress";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const MapPickerModal = dynamic(() => import("./MapPickerModal"), {
  ssr: false,
});

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

const clinicAddressSchema = z.object({
  address: z.string().min(1, "Clinic address is required"),
  lat: z.string().min(1, "Latitude is required"),
  lng: z.string().min(1, "Longitude is required"),
});

const phase3Schema = z.object({
  clinic_address: clinicAddressSchema,
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
  const router = useRouter()
  const { stepThreeMutation, dentistProcedureList } = useDentist();
  const dentistProcedures =
    (dentistProcedureList?.data as any)?.data || [];
  const updatePhase = useUpdateVerificationPhase();
  const { checkIdVerifyProgress } = useVerificationProgress();

  const [isMapOpen, setIsMapOpen] = useState(false);

  const progressData = checkIdVerifyProgress?.data;
  const isAlreadySubmitted = progressData?.submitted === true;

  const methods = useForm<Phase3InputValues, unknown, Phase3Values>({
    resolver: zodResolver(phase3Schema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      clinic_address: {
        address: "",
        lat: "",
        lng: "",
      },
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
    if (progressData?.data) {
      const serverData = progressData.data as any;

      let materials = [];
      try {
        materials =
          typeof serverData.materials === "string"
            ? JSON.parse(serverData.materials)
            : serverData.materials || [];
      } catch (e) {
        materials = serverData.materials || [];
      }

      let clinicAddress = { address: "", lat: "0", lng: "0" };
      if (serverData.clinic_address) {
        try {
          clinicAddress =
            typeof serverData.clinic_address === "string"
              ? JSON.parse(serverData.clinic_address)
              : serverData.clinic_address;
        } catch (e) {
          clinicAddress = {
            address: serverData.clinic_address || "",
            lat: "0",
            lng: "0",
          };
        }
      }

      methods.reset({
        clinic_address: {
          address: clinicAddress.address || "",
          lat: clinicAddress.lat || "0",
          lng: clinicAddress.lng || "0",
        },
        materials: isAlreadySubmitted
          ? materials.map((m: any) => ({
              ownProcedure: String(m.own_procedure),
              ceCertificate: m.ce_certificate
                ? new File([], "CE Certificate")
                : null,
              materialBrands: m.material_brands
                ? new File([], "Material Brands")
                : null,
              invoice: m.invoice ? new File([], "Invoice") : null,
              protocolPdf: m.protocol_pdf ? new File([], "Protocol PDF") : null,
            }))
          : [
              {
                ownProcedure: "",
                ceCertificate: null,
                materialBrands: null,
                invoice: null,
                protocolPdf: null,
              },
            ],
      });
    }
  }, [isAlreadySubmitted, progressData, methods]);

  useEffect(() => {
    dentistProcedureList.refetch();
  }, [dentistProcedureList.refetch]);

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
        own_procedure: String(m.ownProcedure),
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
              router.push("/dentist");
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
  const selectedAddress = methods.watch("clinic_address") || {
    address: "",
    lat: "",
    lng: "",
  };

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
                <div className="relative flex gap-2">
                  <input
                    type="text"
                    disabled={isAlreadySubmitted}
                    {...methods.register("clinic_address.address")}
                    className="border border-gray-200 rounded-md p-3 w-full pr-12 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                    placeholder="Enter your clinic address"
                  />
                  <button
                    type="button"
                    disabled={isAlreadySubmitted}
                    onClick={() => setIsMapOpen(true)}
                    className="p-3 border border-gray-200 rounded-md hover:bg-slate-50 transition-colors text-slate-500 hover:text-[#0E3E65] disabled:opacity-60 shrink-0"
                    title="Select on Map"
                  >
                    <MapPin className="h-5 w-5" />
                  </button>
                </div>
                {methods.formState.errors?.clinic_address?.address && (
                  <p className="text-xs text-red-500 mt-1">
                    {methods.formState.errors.clinic_address.address.message}
                  </p>
                )}

                <input
                  type="hidden"
                  {...methods.register("clinic_address.lat")}
                />
                <input
                  type="hidden"
                  {...methods.register("clinic_address.lng")}
                />
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
                      disabled={
                        isAlreadySubmitted || dentistProcedureList.isFetching
                      }
                      {...methods.register(
                        `materials.${index}.ownProcedure` as const,
                      )}
                      className="block w-full mt-2 rounded-md border border-gray-200 p-3 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                    >
                      {dentistProcedureList.isFetching ? (
                        <option disabled>Loading procedures...</option>
                      ) : (
                        <>
                          <option value="">Select procedure</option>
                           {dentistProcedures.map((proc: any) => (
                            <option
                              className=""
                              key={proc.id}
                              value={String(proc.id)}
                            >
                              {proc.globalProcedure?.name || proc.procedure_name || proc.name}
                            </option>
                          ))}
                        </>
                      )}
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
        <MapPickerModal
          isOpen={isMapOpen}
          onClose={() => setIsMapOpen(false)}
          initialLocation={selectedAddress}
          onConfirm={(location) => {
            methods.setValue("clinic_address.address", location.address, {
              shouldValidate: true,
              shouldDirty: true,
            });
            methods.setValue("clinic_address.lat", location.lat, {
              shouldValidate: true,
              shouldDirty: true,
            });
            methods.setValue("clinic_address.lng", location.lng, {
              shouldValidate: true,
              shouldDirty: true,
            });
          }}
        />
      </form>
    </FormProvider>
  );
}
