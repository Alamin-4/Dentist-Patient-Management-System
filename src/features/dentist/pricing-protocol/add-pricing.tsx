"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Upload, XCircle, Loader2 } from "lucide-react";
import { useStepTwoMutation, useDentistProgress } from "@/hooks/dentist/useDentist";
import { useBulkUploadProcedures } from "@/core/hooks/procedures/useProcedures";
import { StepTwoI } from "@/hooks/dentist/dentist.interface";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

const procedureSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.string().min(1, "Price is required"),
  notes: z.string(),
});

const formSchema = z.object({
  jciCertificate: z.any().optional(),
  videoWalkthrough: z.any().optional(),
  procedures: z.array(procedureSchema).min(1, "Add at least one procedure"),
  signerFullName: z.string().min(1, "Signer name is required"),
  typedSignature: z.string().min(1, "Typed signature is required"),
  agreeToGuarantee: z.boolean().refine((v) => v === true, {
    message: "You must agree to the No Surprise Guarantee",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const sterilizationItems = [
  {
    title: "Autoclave",
    description: "Film the brand name clearly for at least 3 seconds.",
  },
  {
    title: "Sealed Pouch",
    description:
      "Show a sealed pouch with the chemical indicator clearly visible.",
  },
  {
    title: "Ultrasonic Cleaner",
    description: "Show the ultrasonic cleaner and your instrument trays.",
  },
  {
    title: "Cycle Frequency",
    description:
      'Narrate or display how often you run cycles  e.g. "twice daily"',
  },
];

export default function AddPricing() {
  const router = useRouter();
  const stepTwoMutation = useStepTwoMutation();
  const bulkUploadMutation = useBulkUploadProcedures();
  const { data: progressQueryData, isLoading: isProgressLoading, refetch } = useDentistProgress();

  const progressData = progressQueryData?.data;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setError,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      procedures: [{ name: "", price: "", notes: "" }],
      agreeToGuarantee: false,
      signerFullName: "",
      typedSignature: "",
    },
  });

  const jciCertificateFile = watch("jciCertificate");
  const videoWalkthroughFile = watch("videoWalkthrough");

  const getFileName = (fileValue: any) => {
    if (!fileValue) return "";
    if (fileValue instanceof FileList && fileValue.length > 0) {
      return fileValue[0].name;
    }
    if (fileValue instanceof File) {
      return fileValue.name;
    }
    if (typeof fileValue === "string") {
      return fileValue.substring(fileValue.lastIndexOf("/") + 1);
    }
    return "";
  };

  useEffect(() => {
    if (progressData?.dentistOperations) {
      const ops = progressData.dentistOperations;
      const proceduresList = progressData.procedures || [];

      reset({
        signerFullName: ops.signerName || "",
        typedSignature: ops.signature || "",
        agreeToGuarantee: ops.agreedToGuarantee || false,
        procedures: proceduresList.length > 0
          ? proceduresList.map((p: any) => ({
            name: p.procedureName,
            price: String(p.price),
            notes: p.notes || "",
          }))
          : [{ name: "", price: "", notes: "" }],
        jciCertificate: ops.jciCertificate || null,
        videoWalkthrough: ops.walkthroughVideo || null,
      });
    }
  }, [progressData, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "procedures",
  });

  const onSubmit = (data: FormValues) => {
    const jciFile = data.jciCertificate instanceof FileList && data.jciCertificate.length > 0
      ? data.jciCertificate[0]
      : data.jciCertificate instanceof File
        ? data.jciCertificate
        : null;

    const videoFile = data.videoWalkthrough instanceof FileList && data.videoWalkthrough.length > 0
      ? data.videoWalkthrough[0]
      : data.videoWalkthrough instanceof File
        ? data.videoWalkthrough
        : null;

    const payload: StepTwoI = {
      jciCertificate: jciFile,
      walkthroughVideo: videoFile,
      signerName: data.signerFullName,
      signature: data.typedSignature,
      agreedToGuarantee: data.agreeToGuarantee,
      procedures: data.procedures.map((p) => ({
        procedureName: p.name,
        price: Number(p.price),
        notes: p.notes || "",
      })),
    };

    stepTwoMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Pricing protocol saved successfully!");
        router.push("/dentist/pricing-protocols");
      },
      onError: (err: any) => {
        const resData = err?.response?.data;
        const newErrors: Record<string, string> = {};

        // 1. Check if there is an errorDetails.field
        const field = resData?.errorDetails?.field || resData?.field;
        const msg = resData?.message || err?.message || "Failed to save pricing protocols. Please check files and try again.";
        if (field) {
          newErrors[field] = msg;
        }

        // 2. Check if there is an errors array
        if (Array.isArray(resData?.errors)) {
          for (const errObj of resData.errors) {
            if (errObj.field) {
              newErrors[errObj.field] = errObj.message;
            }
          }
        }

        // 3. Check if there are ZodIssues
        if (Array.isArray(resData?.errorDetails)) {
          for (const issue of resData.errorDetails) {
            const fieldName = issue.path?.[issue.path.length - 1];
            if (fieldName) {
              newErrors[fieldName] = issue.message;
            }
          }
        }

        const getFileObj = (fileValue: any): File | null => {
          if (fileValue instanceof File) return fileValue;
          if (fileValue instanceof FileList && fileValue.length > 0) return fileValue[0];
          return null;
        };

        // 4. Map file size limit errors from backend if not mapped to a specific field
        if (
          Object.keys(newErrors).length === 0 &&
          (msg.toLowerCase().includes("5mb") || msg.toLowerCase().includes("file size is too large") || msg.toLowerCase().includes("multer"))
        ) {
          const jci = getFileObj(jciCertificateFile);
          const video = getFileObj(videoWalkthroughFile);
          if (jci && jci.size > 5 * 1024 * 1024) {
            newErrors["jciCertificate"] = "File size is too large. Maximum allowed size is 5MB.";
          }
          if (video && video.size > 5 * 1024 * 1024) {
            newErrors["walkthroughVideo"] = "File size is too large. Maximum allowed size is 5MB.";
          }
        }

        if (Object.keys(newErrors).length > 0) {
          Object.entries(newErrors).forEach(([fieldName, message]) => {
            // Map backend fields to frontend form names
            let mappedName: any = fieldName;
            if (fieldName === "signerName") mappedName = "signerFullName";
            if (fieldName === "signature") mappedName = "typedSignature";
            if (fieldName === "agreedToGuarantee") mappedName = "agreeToGuarantee";
            if (fieldName === "walkthroughVideo") mappedName = "videoWalkthrough";

            setError(mappedName, {
              type: "manual",
              message,
            });
          });
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          // toast.error(msg);
        }
      },
    });
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("csvFile", file);

    const toastId = toast.loading("Uploading CSV...");
    bulkUploadMutation.mutate(formData, {
      onSuccess: (res: any) => {
        toast.success(res?.message || "CSV procedures uploaded successfully!", { id: toastId });
        refetch();
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || "Failed to upload CSV.", { id: toastId });
      },
    });
  };

  const isSubmitting = stepTwoMutation.isPending;
  const today = new Date().toLocaleDateString("en-GB");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pb-24">
      {/* Hidden file input for CSV */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleCsvUpload}
        accept=".csv"
        className="hidden"
      />

      {/* Page Header */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => router.push("/dentist/pricing-protocols")}
          className="mb-2 flex cursor-pointer items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-foreground">
          Pricing Protocols
        </h1>
      </div>

      {/* Form Card */}
      <div className="rounded-lg border border-border bg-card shadow-sm">
        {/* ─── Sterilization ─── */}
        <div className="grid grid-cols-1 gap-8 p-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="text-base font-semibold text-foreground">
              Sterilization
            </h2>
          </div>

          <div className="space-y-5 lg:col-span-8">
            {/* JCI Certificate */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                Upload JCI Certificate
              </p>
              <label className={cn(
                "relative flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed px-5 py-5 transition-colors hover:bg-muted/40",
                errors.jciCertificate ? "border-red-500 bg-red-50/10" : "border-border"
              )}>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  {...register("jciCertificate", {
                    onChange: (e) => {
                      const file = e.target.files?.[0];
                      if (file && file.size > 5 * 1024 * 1024) {
                        setError("jciCertificate", {
                          type: "manual",
                          message: "File size is too large. Maximum allowed size is 5MB.",
                        });
                        setValue("jciCertificate", null);
                        e.target.value = "";
                      } else {
                        clearErrors(["jciCertificate", "videoWalkthrough"]);
                      }
                    }
                  })}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
                <Upload className="h-5 w-5 shrink-0 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  {getFileName(jciCertificateFile) ? (
                    <span className="text-[#163E5C] font-semibold">
                      Selected: {getFileName(jciCertificateFile)}
                    </span>
                  ) : (
                    "Click to upload or drag and drop"
                  )}
                </span>
              </label>
              {errors.jciCertificate && (
                <p className="text-xs font-semibold text-destructive mt-1">
                  {String(errors.jciCertificate.message)}
                </p>
              )}
            </div>

            {/* OR divider */}
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-semibold tracking-widest text-muted-foreground">
                OR
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Video Walkthrough */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                Start Video Walkthrough
              </p>
              <label className={cn(
                "relative flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed px-5 py-5 transition-colors hover:bg-muted/40",
                errors.videoWalkthrough ? "border-red-500 bg-red-50/10" : "border-border"
              )}>
                <input
                  type="file"
                  accept="video/*"
                  {...register("videoWalkthrough", {
                    onChange: (e) => {
                      const file = e.target.files?.[0];
                      if (file && file.size > 5 * 1024 * 1024) {
                        setError("videoWalkthrough", {
                          type: "manual",
                          message: "File size is too large. Maximum allowed size is 5MB.",
                        });
                        setValue("videoWalkthrough", null);
                        e.target.value = "";
                      } else {
                        clearErrors(["videoWalkthrough", "jciCertificate"]);
                      }
                    }
                  })}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
                <Upload className="h-5 w-5 shrink-0 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  {getFileName(videoWalkthroughFile) ? (
                    <span className="text-[#163E5C] font-semibold">
                      Selected: {getFileName(videoWalkthroughFile)}
                    </span>
                  ) : (
                    "Upload Video"
                  )}
                </span>
              </label>
              {errors.videoWalkthrough && (
                <p className="text-xs font-semibold text-destructive mt-1">
                  {String(errors.videoWalkthrough.message)}
                </p>
              )}
            </div>

            {/* Instruction items */}
            <div className="space-y-4 pt-1">
              {sterilizationItems.map((item) => (
                <div key={item.title}>
                  <p className="text-sm font-semibold text-foreground">
                    {item.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <hr className="border-border" />

        {/* ─── Procedure Pricing ─── */}
        <div className="grid grid-cols-1 gap-8 p-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="text-base font-semibold text-foreground">
              Procedure pricing
            </h2>
          </div>

          <div className="space-y-3 lg:col-span-8">
            {/* Column headers */}
            <div className="flex items-center gap-3">
              <div className="grid flex-1 grid-cols-12 gap-3">
                <span className="col-span-5 text-xs font-medium text-muted-foreground">
                  Name
                </span>
                <span className="col-span-3 text-xs font-medium text-muted-foreground">
                  Pricing
                </span>
                <span className="col-span-4 text-xs font-medium text-muted-foreground">
                  Option Notes
                </span>
              </div>
              <div className="w-5 shrink-0" />
            </div>

            {/* Rows */}
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-3">
                <div className="grid flex-1 grid-cols-12 gap-3">
                  {/* Name */}
                  <div className="col-span-5">
                    <input
                      type="text"
                      placeholder="Procedure name"
                      {...register(`procedures.${index}.name` as const)}
                      className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-slate-400 focus:outline-none"
                    />
                    {errors.procedures?.[index]?.name && (
                      <p className="mt-1 text-xs text-destructive">
                        {errors.procedures[index]?.name?.message}
                      </p>
                    )}
                  </div>

                  {/* Pricing */}
                  <div className="col-span-3">
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-sm text-muted-foreground">
                        $
                      </span>
                      <input
                        type="number"
                        placeholder="0"
                        min="0"
                        onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
                        {...register(`procedures.${index}.price` as const)}
                        className="h-10 w-full rounded-lg border border-border bg-card pl-7 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-slate-400 focus:outline-none"
                      />
                    </div>
                    {errors.procedures?.[index]?.price && (
                      <p className="mt-1 text-xs text-destructive">
                        {errors.procedures[index]?.price?.message}
                      </p>
                    )}
                  </div>

                  {/* Option Notes */}
                  <div className="col-span-4">
                    <input
                      type="text"
                      placeholder="Optional note"
                      {...register(`procedures.${index}.notes` as const)}
                      className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-slate-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="shrink-0 text-red-400 transition-colors hover:text-red-500"
                  aria-label="Remove procedure"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            ))}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => append({ name: "", price: "", notes: "" })}
                className="h-10 rounded-lg bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary/90 cursor-pointer"
              >
                Add Procedure
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="h-10 rounded-lg border border-primary bg-card px-5 text-sm font-semibold text-primary transition-colors hover:bg-muted/40 cursor-pointer flex items-center gap-2"
                disabled={bulkUploadMutation.isPending}
              >
                {bulkUploadMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Upload CSV price list
              </button>
            </div>
          </div>
        </div>

        <hr className="border-border" />

        {/* ─── No Surprise Guarantee ─── */}
        <div className="grid grid-cols-1 gap-8 p-8 lg:grid-cols-12">
          <div className="space-y-3 lg:col-span-4">
            <h2 className="text-base font-semibold text-foreground">
              No Surprise Guarantee
            </h2>
            <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-xs font-medium leading-relaxed text-blue-700">
              The 15% rule means patients should not receive surprise increases
              beyond the disclosed starting price unless clearly explained and
              approved before treatment.
            </div>
          </div>

          <div className="space-y-5 lg:col-span-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Signer Full Name
                </label>
                <input
                  type="text"
                  placeholder="Full name"
                  {...register("signerFullName")}
                  className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-slate-400 focus:outline-none"
                />
                {errors.signerFullName && (
                  <p className="text-xs text-destructive">
                    {errors.signerFullName.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Typed Signature
                </label>
                <input
                  type="text"
                  placeholder="Type your signature"
                  {...register("typedSignature")}
                  className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-slate-400 focus:outline-none"
                />
                {errors.typedSignature && (
                  <p className="text-xs text-destructive">
                    {errors.typedSignature.message}
                  </p>
                )}
              </div>
            </div>

            <label className="flex cursor-pointer select-none items-start gap-3 pt-1">
              <input
                type="checkbox"
                {...register("agreeToGuarantee")}
                className="mt-0.5 h-4 w-4 rounded border-border accent-sidebar"
              />
              <span className="text-sm text-foreground">
                I agree to the No Surprise Guarantee and understand today&apos;s
                date is {today}.
              </span>
            </label>
            {errors.agreeToGuarantee && (
              <p className="text-xs text-destructive">
                {errors.agreeToGuarantee.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ─── Sticky Save Bar ─── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card px-6 py-4">
        <div className="flex flex-col items-end gap-2">
          {stepTwoMutation.error && (
            <p className="text-sm font-semibold text-red-500 animate-in fade-in slide-in-from-bottom-1">
              {(stepTwoMutation.error as any)?.response?.data?.message || stepTwoMutation.error?.message || "Failed to save pricing protocols. Please try again."}
            </p>
          )}
          <div className="flex justify-end w-full">
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 rounded-lg bg-primary px-8 text-sm font-semibold text-white shadow-sm transition-colors cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
