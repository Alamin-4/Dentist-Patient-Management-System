"use client";

import { useQueryClient } from "@tanstack/react-query";
import { FormProvider } from "react-hook-form";
import { Plus, Loader2 } from "lucide-react";
import ResultCard from "./Result-card";
import ResultCardSkeleton from "./Result-card-skeleton";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileUploadField } from "@/components/ui/file-upload-field";
import { useResultController } from "@/hooks/dentist/useResultController";
import { ErrorState } from "@/components/shared/error-state";

export default function Result() {
  const {
    results,
    isLoading,
    isError,
    refetch,
    isModalOpen,
    setIsModalOpen,
    beforePreview,
    afterPreview,
    patients,
    selectedPatientName,
    treatmentTitleOptions,
    dateOptions,
    locationOptions,
    errors,
    methods,
    isPending,
    register,
    handleSubmit,
    setValue,
    resetForm,
    onSubmit,
  } = useResultController();

  if (isError) {
    return (
      <div className="py-12">
        <ErrorState
          title="Failed to load results"
          message="We could not fetch your uploaded patient results. Please try again."
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <section className="space-y-6 lg:space-y-7">
      <ResultHeader
        onAddClick={() => {
          resetForm();
          setIsModalOpen(true);
        }}
      />

      <ResultsList
        results={results}
        isLoading={isLoading}
      />

      <Dialog open={isModalOpen} onOpenChange={(open) => !isPending && setIsModalOpen(open)}>
        <DialogContent className="sm:max-w-2xl p-0 overflow-hidden border-none rounded-3xl gap-0 bg-white">
          <div className="flex items-center justify-between p-6 border-b">
            <DialogTitle className="text-2xl font-bold text-text">
              Add New Before/After Result
            </DialogTitle>
          </div>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
              {errors.root && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-sm flex items-start gap-2.5 shadow-sm">
                  <div className="font-bold">Error:</div>
                  <div>{errors.root.message}</div>
                </div>
              )}

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-text">Images</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {beforePreview ? (
                    <div className="space-y-1.5">
                      <div className="relative border rounded-lg h-44 overflow-hidden group">
                        <img src={beforePreview} alt="Before Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setValue("beforeImage", null, { shouldValidate: true })}
                          className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80 transition-colors cursor-pointer"
                        >
                          <span className="text-xs font-bold">✕</span>
                        </button>
                      </div>
                      {errors.beforeImage && (
                        <p className="text-xs font-semibold text-red-500">{String(errors.beforeImage.message)}</p>
                      )}
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

                  {afterPreview ? (
                    <div className="space-y-1.5">
                      <div className="relative border rounded-lg h-44 overflow-hidden group">
                        <img src={afterPreview} alt="After Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setValue("afterImage", null, { shouldValidate: true })}
                          className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80 transition-colors cursor-pointer"
                        >
                          <span className="text-xs font-bold">✕</span>
                        </button>
                      </div>
                      {errors.afterImage && (
                        <p className="text-xs font-semibold text-red-500">{String(errors.afterImage.message)}</p>
                      )}
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
                  <label className="block text-sm font-semibold text-text">
                    Patient Name
                  </label>
                  <select
                    {...register("patientName")}
                    className={`w-full h-12 rounded-lg border px-4 text-sm outline-none focus:ring-1 focus:ring-[#0F3659] focus:border-[#0F3659] bg-white text-foreground ${errors.patientName ? "border-red-500" : "border-slate-200"}`}
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
                  <label className="block text-sm font-semibold text-text">
                    Treatment Title
                  </label>
                  <select
                    {...register("title")}
                    disabled={!selectedPatientName}
                    className={`w-full h-12 rounded-lg border px-4 text-sm outline-none focus:ring-1 focus:ring-[#0F3659] focus:border-[#0F3659] bg-white text-foreground disabled:opacity-60 disabled:cursor-not-allowed ${errors.title ? "border-red-500" : "border-slate-200"}`}
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
                  <label className="block text-sm font-semibold text-text">
                    Date
                  </label>
                  <select
                    {...register("date")}
                    disabled={!selectedPatientName}
                    className={`w-full h-12 rounded-lg border px-4 text-sm outline-none focus:ring-1 focus:ring-[#0F3659] focus:border-[#0F3659] bg-white text-foreground disabled:opacity-60 disabled:cursor-not-allowed ${errors.date ? "border-red-500" : "border-slate-200"}`}
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
                  <label className="block text-sm font-semibold text-text">
                    Location
                  </label>
                  <select
                    {...register("location")}
                    disabled={!selectedPatientName}
                    className={`w-full h-12 rounded-lg border px-4 text-sm outline-none focus:ring-1 focus:ring-[#0F3659] focus:border-[#0F3659] bg-white text-foreground disabled:opacity-60 disabled:cursor-not-allowed ${errors.location ? "border-red-500" : "border-slate-200"}`}
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
                  disabled={isPending}
                  onClick={() => {
                    resetForm();
                    setIsModalOpen(false);
                  }}
                  className="flex-1 h-12 rounded-xl border-slate-200 text-sm font-bold text-text hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 h-12 rounded-xl bg-[#0F3659] text-sm font-bold text-white hover:bg-[#0a2640] cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isPending ? (
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

interface ResultHeaderProps {
  onAddClick: () => void;
}

function ResultHeader({ onAddClick }: ResultHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1.5">
        <h1 className="text-[26px] font-semibold leading-tight tracking-[-0.02em] text-text sm:text-[30px]">
          Results
        </h1>
        <p className="max-w-2xl text-[14px] leading-6 text-sec-text sm:text-[15px]">
          Upload AI-verified before/after imagery for your patients.
        </p>
      </div>
      <button
        onClick={onAddClick}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F3659] px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[#0a2640] cursor-pointer shadow-sm hover:shadow"
      >
        <Plus className="size-4" />
        Add Result
      </button>
    </header>
  );
}

interface ResultsListProps {
  results: any[];
  isLoading: boolean;
}

function ResultsList({ results, isLoading }: ResultsListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <ResultCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
        <p className="text-base font-semibold text-slate-500">No results uploaded yet</p>
        <p className="mt-1 text-sm text-slate-400">Click the button above to upload before/after photos.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:gap-6">
      {results.map((result: any, index: number) => (
        <ResultCard key={`${result.title}-${index}`} {...result} />
      ))}
    </div>
  );
}
