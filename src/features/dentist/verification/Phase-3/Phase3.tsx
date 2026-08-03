"use client";

import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DocumentUpload } from "./DocumentUpload";
import { useFieldArray } from "react-hook-form";
import { Plus, Trash, Loader2, MapPin } from "lucide-react";
import { useVerificationStore } from "@/lib/hooks/verification-store-hooks";
import {
  useStepThreeMutation,
  useDentistProceduresList,
} from "@/hooks/dentist/useDentist";
import { StepThreeI } from "@/hooks/dentist/dentist.interface";
import toast from "react-hot-toast";
import useVerificationProgress from "@/hooks/dentist/useStepProgress";
import { VerificationStatusScreen } from "../VerificationStatusScreen";
import { SectionHeader } from "@/components/shared/section-header";
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
  lat: z.string().min(1, "Location coordinates (latitude) are required. Please select your clinic on the map."),
  lng: z.string().min(1, "Location coordinates (longitude) are required. Please select your clinic on the map."),
});

const phase3Schema = z.object({
  clinic_address: clinicAddressSchema,
  materials: z.array(materialsSchema).min(1, "Add at least one procedure"),
});

type Phase3Values = z.infer<typeof phase3Schema>;
type Phase3InputValues = z.input<typeof phase3Schema>;

export default function Phase3() {
  const { setVerificationStepReady } = useVerificationStore();
  const router = useRouter()
  const stepThreeMutation = useStepThreeMutation();
  const dentistProcedureList = useDentistProceduresList();
  const dentistProcedures =
    (dentistProcedureList?.data as any)?.data || [];

  const { checkIdVerifyProgress, step3Status, step3Note } = useVerificationProgress();

  const [isMapOpen, setIsMapOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const progressData = checkIdVerifyProgress?.data;
  // Form is locked only when APPROVED; REJECTED allows resubmission
  const isFormLocked = step3Status === "APPROVED";

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
        materials: isFormLocked
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
  }, [isFormLocked, progressData, methods]);

  useEffect(() => {
    dentistProcedureList.refetch();
  }, []);

  const { control } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "materials",
  });

  const onSubmit = (payload: Phase3Values) => {
    setSubmitError(null);

    for (const [idx, mat] of payload.materials.entries()) {
      const docFields: Array<[keyof typeof mat, string]> = [
        ["ceCertificate", "CE Certificate"],
        ["materialBrands", "Material Brands"],
        ["invoice", "Invoice"],
        ["protocolPdf", "Protocol PDF"],
      ];
      for (const [fieldKey, label] of docFields) {
        const file = mat[fieldKey];
        if (file instanceof File && file.size > 5 * 1024 * 1024) {
          const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
          const msg = `Procedure #${idx + 1} ${label} file size (${sizeMB} MB) exceeds the 5MB limit. Please upload a smaller file.`;
          setSubmitError(msg);
          return;
        }
      }
    }

    const formattedPayload: StepThreeI = {
      clinic_address: {
        address: payload.clinic_address.address,
        lat: payload.clinic_address.lat || "",
        lng: payload.clinic_address.lng || "",
      },
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
        toast.success("Clinical depth verification documents submitted successfully!");
        router.push("/dentist");
      },

      onError: (error: any) => {
        if (error && typeof error === "object" && "field" in error && "index" in error) {
          const { field, index, message } = error;
          methods.setError(`materials.${index}.${field}` as any, {
            type: "server",
            message: message || "Upload failed",
          });
        } else {
          const errMsg = error?.message || "Clinical depth submission failed. Please try again.";
          setSubmitError(errMsg);
        }
      },
    });
  };

  useEffect(() => {
    if (isFormLocked) {
      setVerificationStepReady(3, true);
      return;
    }
    const timeoutId = window.setTimeout(() => {
      setVerificationStepReady(3, methods.formState.isValid);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [methods.formState.isValid, isFormLocked, setVerificationStepReady]);

  const isPending = stepThreeMutation.isPending;
  const selectedAddress = methods.watch("clinic_address") || {
    address: "",
    lat: "",
    lng: "",
  };

  if (step3Status === "SUBMITTED") {
    return (
      <VerificationStatusScreen
        status="SUBMITTED"
        phaseName="Clinical Excellence"
      />
    );
  }

  return (
    <div className="space-y-6">
      {step3Status === "REJECTED" && (
        <VerificationStatusScreen
          status="REJECTED"
          phaseName="Clinical Excellence"
          rejectionNote={step3Note || undefined}
        />
      )}
      <FormProvider {...methods}>
        <form
          id="phase-3-verification-form"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-750 p-4 rounded-xl text-sm font-semibold mx-6 my-2">
              {submitError}
            </div>
          )}
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8 p-6">
              <SectionHeader
                title="Clinic Location"
                size="lg"
                className="mb-0"
              />

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-text inline-block mb-2">
                    Clinic Address &amp; Map Location <span className="text-red-500">*</span>
                  </label>
                  <div
                    onClick={() => !isFormLocked && setIsMapOpen(true)}
                    className="relative flex gap-2 cursor-pointer"
                  >
                    <input
                      type="text"
                      readOnly
                      disabled={isFormLocked}
                      {...methods.register("clinic_address.address")}
                      className="border border-gray-200 rounded-md p-3 w-full pr-12 disabled:opacity-60 cursor-pointer bg-white text-sm focus:outline-none"
                      placeholder="Click 'Select on Map' to set your clinic location..."
                    />
                    <button
                      type="button"
                      disabled={isFormLocked}
                      onClick={() => setIsMapOpen(true)}
                      className="p-3 bg-brand-medium-navy text-white rounded-md hover:bg-brand-medium-navy-hover transition-colors disabled:opacity-60 shrink-0 flex items-center gap-1.5 font-semibold text-sm cursor-pointer"
                      title="Select on Map"
                    >
                      <MapPin className="h-5 w-5" />
                      <span>{selectedAddress.lat && selectedAddress.lng ? "Change Location" : "Select on Map"}</span>
                    </button>
                  </div>

                  {/* Status Indicator */}
                  {selectedAddress.lat && selectedAddress.lng ? (
                    <p className="text-xs text-emerald-600 font-semibold mt-1.5 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Map coordinates saved (Lat: {Number(selectedAddress.lat).toFixed(4)}, Lng: {Number(selectedAddress.lng).toFixed(4)})
                    </p>
                  ) : (
                    <p className="text-xs text-accent font-semibold mt-1.5 flex items-center gap-1">
                      ⚠️ Map pin location required. Click &quot;Select on Map&quot; to pick location &amp; get coordinates.
                    </p>
                  )}

                  {methods.formState.errors?.clinic_address?.address && (
                    <p className="text-xs text-red-500 mt-1">
                      {methods.formState.errors.clinic_address.address.message}
                    </p>
                  )}
                  {methods.formState.errors?.clinic_address?.lat && (
                    <p className="text-xs text-red-500 mt-1">
                      {methods.formState.errors.clinic_address.lat.message}
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
                  <SectionHeader
                    title="Consultation Docs"
                    description={`STEP ${index + 1}`}
                    size="lg"
                    className="mb-0 [&_p]:text-[10px] [&_p]:font-bold [&_p]:uppercase [&_p]:tracking-widest [&_p]:text-brand-medium-navy"
                  />

                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium text-text inline-block">
                        Procedure
                      </label>
                      <select
                        disabled={
                          isFormLocked || dentistProcedureList.isFetching
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
                        disabled={isFormLocked}
                        error={getErrorMessage(
                          methods.formState.errors.materials?.[index]
                            ?.ceCertificate?.message,
                        )}
                      />
                      <DocumentUpload
                        label="Upload Material brands"
                        name={`materials.${index}.materialBrands`}
                        disabled={isFormLocked}
                        error={getErrorMessage(
                          methods.formState.errors.materials?.[index]
                            ?.materialBrands?.message,
                        )}
                      />
                      <DocumentUpload
                        label="Upload Invoice"
                        name={`materials.${index}.invoice`}
                        disabled={isFormLocked}
                        error={getErrorMessage(
                          methods.formState.errors.materials?.[index]?.invoice
                            ?.message,
                        )}
                      />
                      <DocumentUpload
                        label="Upload protocol PDF"
                        name={`materials.${index}.protocolPdf`}
                        disabled={isFormLocked}
                        error={getErrorMessage(
                          methods.formState.errors.materials?.[index]?.protocolPdf
                            ?.message,
                        )}
                      />
                    </div>
                  </div>
                </div>

                {!isFormLocked && (
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

            {!isFormLocked && (
              <div className="p-6">
                {methods.formState.errors?.materials && !Array.isArray(methods.formState.errors.materials) && (
                  <p className="text-xs font-semibold text-red-500 mb-3">
                    {String((methods.formState.errors.materials as any).message || "Add at least one procedure")}
                  </p>
                )}
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
                  className="w-full rounded-lg border-2 border-dashed border-gray-200 p-5 flex items-center justify-center gap-3 text-sm text-gray-600 hover:bg-white"
                >
                  <Plus className="w-4 h-4 text-gray-500" /> Add Procedure
                </button>
              </div>
            )}
          </div>

          <MapPickerModal
            isOpen={isMapOpen}
            onClose={() => setIsMapOpen(false)}
            initialLocation={{
              address: selectedAddress.address,
              lat: selectedAddress.lat || "",
              lng: selectedAddress.lng || "",
            }}
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
    </div>
  );
}
