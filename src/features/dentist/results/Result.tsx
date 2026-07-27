"use client";

import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { apiClient } from "@/api/client";
import toast from "react-hot-toast";
import { Plus, Loader2 } from "lucide-react";
import ResultCard from "./Result-card";
import ResultCardSkeleton from "./Result-card-skeleton";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileUploadField } from "@/components/ui/file-upload-field";
import { useDentistPatients, useDentistProceduresList } from "@/core/hooks/dentist/useDentist";

const resultSchema = z.object({
  title: z.string().min(1, "Treatment title is required"),
  patientName: z.string().min(1, "Patient name is required"),
  date: z.string().min(1, "Date is required"),
  location: z.string().min(1, "Location is required"),
  beforeImage: z.any().refine((val) => val instanceof File || typeof val === "string", "Before image is required"),
  afterImage: z.any().refine((val) => val instanceof File || typeof val === "string", "After image is required"),
});

type ResultFormValues = z.infer<typeof resultSchema>;

export default function Result() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [beforePreview, setBeforePreview] = useState<string | null>(null);
  const [afterPreview, setAfterPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Queries for DB Dropdowns
  const { data: patientsData } = useDentistPatients();
  const { data: proceduresData } = useDentistProceduresList();

  const patients = useMemo(() => patientsData?.data || [], [patientsData]);
  const procedures = useMemo(() => proceduresData?.data || [], [proceduresData]);

  const methods = useForm<ResultFormValues>({
    resolver: zodResolver(resultSchema),
    defaultValues: {
      title: "",
      patientName: "",
      date: "",
      location: "",
      beforeImage: null,
      afterImage: null,
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = methods;

  const selectedPatientName = watch("patientName");

  const selectedPatient = useMemo(() => {
    return patients.find((p: any) => p.name === selectedPatientName);
  }, [selectedPatientName, patients]);

  // Derive unique Dates, Locations & Treatment Titles for the selected patient
  const dateOptions = useMemo(() => {
    if (!selectedPatient) return [];
    const opts = new Set<string>();
    if (selectedPatient.appointmentDate) opts.add(selectedPatient.appointmentDate);
    if (selectedPatient.schedule?.date && selectedPatient.schedule.date !== "Not Scheduled") {
      opts.add(selectedPatient.schedule.date);
    }
    if (selectedPatient.travelingDates && selectedPatient.travelingDates !== "TBD") {
      opts.add(selectedPatient.travelingDates);
    }
    return Array.from(opts);
  }, [selectedPatient]);

  const locationOptions = useMemo(() => {
    if (!selectedPatient) return [];
    const opts = new Set<string>();
    if (selectedPatient.country) opts.add(selectedPatient.country);
    return Array.from(opts);
  }, [selectedPatient]);

  const treatmentTitleOptions = useMemo(() => {
    if (!selectedPatient) return [];
    const opts = new Set<string>();
    if (selectedPatient.procedure) {
      selectedPatient.procedure.split(",").forEach((p: string) => {
        const trimmed = p.trim();
        if (trimmed) opts.add(trimmed);
      });
    }
    if (Array.isArray(selectedPatient.estimateBreakdown)) {
      selectedPatient.estimateBreakdown.forEach((item: any) => {
        if (item.label) opts.add(item.label.trim());
      });
    }
    if (opts.size === 0) {
      opts.add("Dental Treatment");
    }
    return Array.from(opts);
  }, [selectedPatient]);

  // Automatically update the Date, Location and Treatment selections when the patient is selected
  useEffect(() => {
    if (selectedPatient) {
      if (dateOptions.length > 0) {
        setValue("date", dateOptions[0], { shouldValidate: true });
      } else {
        setValue("date", "");
      }
      if (locationOptions.length > 0) {
        setValue("location", locationOptions[0], { shouldValidate: true });
      } else {
        setValue("location", "");
      }
      if (treatmentTitleOptions.length > 0) {
        setValue("title", treatmentTitleOptions[0], { shouldValidate: true });
      } else {
        setValue("title", "");
      }
    } else {
      setValue("date", "");
      setValue("location", "");
      setValue("title", "");
    }
  }, [selectedPatient, dateOptions, locationOptions, treatmentTitleOptions, setValue]);

  const { data: results = [], isLoading } = useQuery({
    queryKey: ["dentist-results"],
    queryFn: async () => {
      try {
        const response = await apiClient.dentists.getResults();
        const apiData = response?.data || response;
        return Array.isArray(apiData) ? apiData : [];
      } catch (err) {
        console.warn("Results API route not ready or found:", err);
        return [];
      }
    },
  });

  const createResultMutation = useMutation({
    mutationFn: async (payload: {
      title: string;
      patientName: string;
      date: string;
      location: string;
      beforeImage: string;
      afterImage: string;
    }) => {
      return await apiClient.dentists.createResult(payload);
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Result added successfully");
      queryClient.invalidateQueries({ queryKey: ["dentist-results"] });
      resetForm();
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message || "Failed to add result");
    },
  });

  // Sync file previews whenever the form value changes (set by FileUploadField)
  const beforeImageValue = watch("beforeImage");
  const afterImageValue = watch("afterImage");

  useEffect(() => {
    if (beforeImageValue instanceof File) {
      const url = URL.createObjectURL(beforeImageValue);
      setBeforePreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (!beforeImageValue) {
      setBeforePreview(null);
    }
  }, [beforeImageValue]);

  useEffect(() => {
    if (afterImageValue instanceof File) {
      const url = URL.createObjectURL(afterImageValue);
      setAfterPreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (!afterImageValue) {
      setAfterPreview(null);
    }
  }, [afterImageValue]);

  const resetForm = () => {
    reset({
      title: "",
      patientName: "",
      date: "",
      location: "",
      beforeImage: null,
      afterImage: null,
    });
    setBeforePreview(null);
    setAfterPreview(null);
  };

  const onSubmit = async (data: ResultFormValues) => {
    setIsUploading(true);
    let beforeUrl = "";
    let afterUrl = "";

    try {
      toast.loading("Uploading before image...", { id: "upload-progress" });
      const beforeUploadRes = await apiClient.files.upload(data.beforeImage);
      beforeUrl = beforeUploadRes?.data?.secure_url || beforeUploadRes?.secure_url;
      if (!beforeUrl) throw new Error("Failed to upload before image");

      toast.loading("Uploading after image...", { id: "upload-progress" });
      const afterUploadRes = await apiClient.files.upload(data.afterImage);
      afterUrl = afterUploadRes?.data?.secure_url || afterUploadRes?.secure_url;
      if (!afterUrl) throw new Error("Failed to upload after image");

      toast.loading("Saving result details...", { id: "upload-progress" });

      await createResultMutation.mutateAsync({
        title: data.title,
        patientName: data.patientName,
        date: data.date,
        location: data.location,
        beforeImage: beforeUrl,
        afterImage: afterUrl,
      });

    } catch (err: any) {
      toast.error(err?.message || "Failed during result creation process");
    } finally {
      toast.dismiss("upload-progress");
      setIsUploading(false);
    }
  };

  return (
    <section className="space-y-6 lg:space-y-7">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <h1 className="text-[26px] font-semibold leading-tight tracking-[-0.02em] text-[#1A1A2E] sm:text-[30px]">
            Results
          </h1>
          <p className="max-w-2xl text-[14px] leading-6 text-[#6B7280] sm:text-[15px]">
            Upload AI-verified before/after imagery for your patients.
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F3659] px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[#0a2640] cursor-pointer shadow-sm hover:shadow"
        >
          <Plus className="size-4" />
          Add Result
        </button>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <ResultCardSkeleton key={index} />
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <p className="text-base font-semibold text-slate-500">No results uploaded yet</p>
          <p className="mt-1 text-sm text-slate-400">Click the button above to upload before/after photos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:gap-6">
          {results.map((result: any, index: number) => (
            <ResultCard key={`${result.title}-${index}`} {...result} />
          ))}
        </div>
      )}

      {/* Add Result Dialog */}
      <Dialog open={isModalOpen} onOpenChange={(open) => !isUploading && setIsModalOpen(open)}>
        <DialogContent className="sm:max-w-2xl p-0 overflow-hidden border-none rounded-3xl gap-0 bg-white">
          <div className="flex items-center justify-between p-6 border-b">
            <DialogTitle className="text-2xl font-bold text-[#1A1A2E]">
              Add New Before/After Result
            </DialogTitle>
          </div>

          <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-[#1A1A2E]">Images</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Before Image */}
                {beforePreview ? (
                  <div className="relative border rounded-lg h-44 overflow-hidden group">
                    <img src={beforePreview} alt="Before Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setValue("beforeImage", null, { shouldValidate: true })}
                      className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80 transition-colors"
                    >
                      <span className="text-xs font-bold">✕</span>
                    </button>
                  </div>
                ) : (
                  <FileUploadField
                    name="beforeImage"
                    label="Before Image"
                    accept="image/*"
                    maxSizeMB={5}
                    allowedMimeTypes={["image/"]}
                    allowedTypesLabel="JPG, PNG, WEBP"
                  />
                )}

                {/* After Image */}
                {afterPreview ? (
                  <div className="relative border rounded-lg h-44 overflow-hidden group">
                    <img src={afterPreview} alt="After Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setValue("afterImage", null, { shouldValidate: true })}
                      className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80 transition-colors"
                    >
                      <span className="text-xs font-bold">✕</span>
                    </button>
                  </div>
                ) : (
                  <FileUploadField
                    name="afterImage"
                    label="After Image"
                    accept="image/*"
                    maxSizeMB={5}
                    allowedMimeTypes={["image/"]}
                    allowedTypesLabel="JPG, PNG, WEBP"
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#1A1A2E]">
                  Patient Name
                </label>
                <select
                  {...register("patientName")}
                  className={`w-full h-12 rounded-lg border px-4 text-sm outline-none focus:ring-1 focus:ring-[#0F3659] focus:border-[#0F3659] bg-white text-foreground ${
                    errors.patientName ? "border-red-500" : "border-slate-200"
                  }`}
                >
                  <option value="">Select Patient</option>
                  {patients.map((pat: any) => (
                    <option key={pat.id} value={pat.name}>
                      {pat.name} ({pat.patientCode})
                    </option>
                  ))}
                </select>
                {errors.patientName && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.patientName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#1A1A2E]">
                  Treatment Title
                </label>
                <select
                  {...register("title")}
                  disabled={!selectedPatientName}
                  className={`w-full h-12 rounded-lg border px-4 text-sm outline-none focus:ring-1 focus:ring-[#0F3659] focus:border-[#0F3659] bg-white text-foreground disabled:opacity-60 disabled:cursor-not-allowed ${
                    errors.title ? "border-red-500" : "border-slate-200"
                  }`}
                >
                  {!selectedPatientName ? (
                    <option value="">Select patient first</option>
                  ) : (
                    <>
                      <option value="">Select Treatment Title</option>
                      {treatmentTitleOptions.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </>
                  )}
                </select>
                {errors.title && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#1A1A2E]">
                  Date
                </label>
                <select
                  {...register("date")}
                  disabled={!selectedPatientName}
                  className={`w-full h-12 rounded-lg border px-4 text-sm outline-none focus:ring-1 focus:ring-[#0F3659] focus:border-[#0F3659] bg-white text-foreground disabled:opacity-60 disabled:cursor-not-allowed ${
                    errors.date ? "border-red-500" : "border-slate-200"
                  }`}
                >
                  {!selectedPatientName ? (
                    <option value="">Select patient first</option>
                  ) : (
                    <>
                      <option value="">Select Date</option>
                      {dateOptions.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </>
                  )}
                </select>
                {errors.date && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.date.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#1A1A2E]">
                  Location
                </label>
                <select
                  {...register("location")}
                  disabled={!selectedPatientName}
                  className={`w-full h-12 rounded-lg border px-4 text-sm outline-none focus:ring-1 focus:ring-[#0F3659] focus:border-[#0F3659] bg-white text-foreground disabled:opacity-60 disabled:cursor-not-allowed ${
                    errors.location ? "border-red-500" : "border-slate-200"
                  }`}
                >
                  {!selectedPatientName ? (
                    <option value="">Select patient first</option>
                  ) : (
                    <>
                      <option value="">Select Location</option>
                      {locationOptions.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </>
                  )}
                </select>
                {errors.location && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.location.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                disabled={isUploading}
                onClick={() => {
                  resetForm();
                  setIsModalOpen(false);
                }}
                className="flex-1 h-12 rounded-xl border-slate-200 text-sm font-bold text-[#1A1A2E] hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUploading || createResultMutation.isPending}
                className="flex-1 h-12 rounded-xl bg-[#0F3659] text-sm font-bold text-white hover:bg-[#0a2640] cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Add Result"
                )}
              </Button>
            </div>
          </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </section>
  );
}
