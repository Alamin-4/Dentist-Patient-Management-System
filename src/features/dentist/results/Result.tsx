"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import toast from "react-hot-toast";
import { Plus, Upload, X, Loader2 } from "lucide-react";
import ResultCard from "./Result-card";
import ResultCardSkeleton from "./Result-card-skeleton";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Result() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [patientName, setPatientName] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [beforePreview, setBeforePreview] = useState<string | null>(null);
  
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [afterPreview, setAfterPreview] = useState<string | null>(null);

  const [isUploading, setIsUploading] = useState(false);

  const { data: results = [], isLoading } = useQuery({
    queryKey: ["dentist-results"],
    queryFn: async () => {
      try {
        const response = await apiClient.dentists.getResults();
        const apiData = response?.data || response;
        return Array.isArray(apiData) ? apiData : [];
      } catch (err) {
        // Quietly log error in development, fall back to empty state
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

  const handleBeforeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBeforeFile(file);
      setBeforePreview(URL.createObjectURL(file));
    }
  };

  const handleAfterFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAfterFile(file);
      setAfterPreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setTitle("");
    setPatientName("");
    setDate("");
    setLocation("");
    setBeforeFile(null);
    setBeforePreview(null);
    setAfterFile(null);
    setAfterPreview(null);
  };

  const handleUploadAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !patientName || !date || !location) {
      toast.error("Please fill in all textual fields");
      return;
    }
    if (!beforeFile || !afterFile) {
      toast.error("Please provide both before and after images");
      return;
    }

    setIsUploading(true);
    let beforeUrl = "";
    let afterUrl = "";

    try {
      // 1. Upload Before Image
      toast.loading("Uploading before image...", { id: "upload-progress" });
      const beforeUploadRes = await apiClient.files.upload(beforeFile);
      beforeUrl = beforeUploadRes?.data?.secure_url || beforeUploadRes?.secure_url;
      if (!beforeUrl) throw new Error("Failed to upload before image");

      // 2. Upload After Image
      toast.loading("Uploading after image...", { id: "upload-progress" });
      const afterUploadRes = await apiClient.files.upload(afterFile);
      afterUrl = afterUploadRes?.data?.secure_url || afterUploadRes?.secure_url;
      if (!afterUrl) throw new Error("Failed to upload after image");

      toast.loading("Saving result details...", { id: "upload-progress" });
      
      // 3. Submit payload
      await createResultMutation.mutateAsync({
        title,
        patientName,
        date,
        location,
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

          <form onSubmit={handleUploadAndSubmit} className="p-8 space-y-6">
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-[#1A1A2E]">Images</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Before Image Upload */}
                <div className="relative animate-in fade-in zoom-in-95 duration-200">
                  {beforePreview ? (
                    <div className="relative border rounded-lg h-44 overflow-hidden group">
                      <Image
                        src={beforePreview}
                        alt="Before Preview"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setBeforeFile(null);
                          setBeforePreview(null);
                        }}
                        className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80 transition-colors"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer border-2 border-dashed border-slate-200 rounded-lg h-44 flex flex-col items-center justify-center gap-2 bg-[#F8FAFC]/30 hover:bg-slate-50 transition-colors">
                      <Upload className="size-6 text-slate-400" />
                      <span className="text-sm font-semibold text-[#1A1A2E]">
                        Before Image
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleBeforeFileChange}
                      />
                    </label>
                  )}
                </div>

                {/* After Image Upload */}
                <div className="relative animate-in fade-in zoom-in-95 duration-200">
                  {afterPreview ? (
                    <div className="relative border rounded-lg h-44 overflow-hidden group">
                      <Image
                        src={afterPreview}
                        alt="After Preview"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setAfterFile(null);
                          setAfterPreview(null);
                        }}
                        className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80 transition-colors"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer border-2 border-dashed border-slate-200 rounded-lg h-44 flex flex-col items-center justify-center gap-2 bg-[#F8FAFC]/30 hover:bg-slate-50 transition-colors">
                      <Upload className="size-6 text-slate-400" />
                      <span className="text-sm font-semibold text-[#1A1A2E]">
                        After Image
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleAfterFileChange}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#1A1A2E]">
                  Treatment Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Invisalign Treatment"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-12 rounded-lg border border-slate-200 px-4 text-sm outline-none focus:ring-1 focus:ring-[#0F3659] focus:border-[#0F3659]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#1A1A2E]">
                  Patient Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sophia D."
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full h-12 rounded-lg border border-slate-200 px-4 text-sm outline-none focus:ring-1 focus:ring-[#0F3659] focus:border-[#0F3659]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#1A1A2E]">
                  Date
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. May 2026"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-12 rounded-lg border border-slate-200 px-4 text-sm outline-none focus:ring-1 focus:ring-[#0F3659] focus:border-[#0F3659]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#1A1A2E]">
                  Location
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Istanbul, Turkey"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full h-12 rounded-lg border border-slate-200 px-4 text-sm outline-none focus:ring-1 focus:ring-[#0F3659] focus:border-[#0F3659]"
                />
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
        </DialogContent>
      </Dialog>
    </section>
  );
}
