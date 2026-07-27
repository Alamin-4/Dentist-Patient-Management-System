"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { normalizeApiError } from "@/api/error-handler";

interface AddPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddPhotoModal({ isOpen, onClose }: AddPhotoModalProps) {
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [beforePreview, setBeforePreview] = useState<string | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [afterPreview, setAfterPreview] = useState<string | null>(null);
  const [treatment, setTreatment] = useState("");
  const [doctor, setDoctor] = useState("");
  const [location, setLocation] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Validation and Error states
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "before" | "after"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === "before") {
        setBeforeFile(file);
        setBeforePreview(URL.createObjectURL(file));
        setFieldErrors((prev) => ({ ...prev, before: "" }));
      } else {
        setAfterFile(file);
        setAfterPreview(URL.createObjectURL(file));
        setFieldErrors((prev) => ({ ...prev, after: "" }));
      }
    }
  };

  const handleClose = () => {
    // Clear state and errors on close
    setBeforeFile(null);
    setBeforePreview(null);
    setAfterFile(null);
    setAfterPreview(null);
    setTreatment("");
    setDoctor("");
    setLocation("");
    setFieldErrors({});
    setGeneralError(null);
    onClose();
  };

  const handleAddPhoto = async () => {
    // Reset errors
    setFieldErrors({});
    setGeneralError(null);

    // Client-side validations
    const errors: Record<string, string> = {};
    if (!beforeFile) errors.before = "Before photo is required.";
    if (!afterFile) errors.after = "After photo is required.";
    if (!doctor.trim()) errors.doctor = "Doctor's name is required.";
    if (!location.trim()) errors.location = "Location is required.";
    if (!treatment) errors.treatment = "Treatment selection is required.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      setIsUploading(true);

      // 1. Upload before image
      const beforeUploadRes = await apiClient.files.upload(beforeFile!);
      const beforeImgUrl = beforeUploadRes.data?.secure_url;
      if (!beforeImgUrl) {
        throw new Error("Failed to upload before image");
      }

      // 2. Upload after image
      const afterUploadRes = await apiClient.files.upload(afterFile!);
      const afterImgUrl = afterUploadRes.data?.secure_url;
      if (!afterImgUrl) {
        throw new Error("Failed to upload after image");
      }

      // 3. Save patient result metadata
      await apiClient.patients.uploadResult({
        title: treatment,
        doctor,
        location,
        beforeImg: beforeImgUrl,
        afterImg: afterImgUrl,
      });
      
      // Invalidate query to refresh the list automatically
      queryClient.invalidateQueries({ queryKey: ["patient-results"] });

      handleClose();
    } catch (err: any) {
      console.error("Upload error:", err);
      const apiErr = normalizeApiError(err);
      
      if (apiErr.errors && Array.isArray(apiErr.errors)) {
        const errorsMap: Record<string, string> = {};
        (apiErr.errors as any[]).forEach((e: any) => {
          errorsMap[e.field] = e.message;
        });
        setFieldErrors(errorsMap);
      } else {
        setGeneralError(apiErr.message);
        toast.error(apiErr.message);
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden border-none rounded-3xl gap-0">
        {/* Custom Header with Title & Description */}
        <div className="flex flex-col p-6 border-b">
          <DialogTitle className="text-3xl font-bold text-[#1A1A2E]">
            Add New Photo
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500 mt-1">
            Upload before and after images, select treatment, and enter details.
          </DialogDescription>
        </div>

        <div className="p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* General API error banner */}
          {generalError && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-sm flex items-start gap-2.5 shadow-sm">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
              <div>
                <span className="font-bold">Error:</span> {generalError}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <p className="text-xl font-semibold text-[#1A1A2E]">Photos</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Before Upload */}
              <div>
                {beforePreview ? (
                  <div className={`relative border rounded-lg h-48 overflow-hidden group ${
                    fieldErrors.before ? "border-red-500" : "border-slate-200"
                  }`}>
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
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-md transition-colors z-10"
                    >
                      <X className="size-4" />
                    </button>
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-xs font-semibold">Before Image</span>
                    </div>
                  </div>
                ) : (
                  <label className={`cursor-pointer border-2 border-dashed rounded-lg h-48 flex flex-col items-center justify-center gap-3 bg-[#F8FAFC]/30 hover:bg-slate-50 transition-colors ${
                    fieldErrors.before ? "border-red-400 bg-red-50/5" : "border-slate-200"
                  }`}>
                    <Upload className="size-7 text-slate-400" />
                    <span className="text-lg font-semibold text-[#1A1A2E]">
                      Upload Before Image
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "before")}
                    />
                  </label>
                )}
                {fieldErrors.before && (
                  <p className="text-xs font-semibold text-red-500 mt-1.5">{fieldErrors.before}</p>
                )}
              </div>

              {/* After Upload */}
              <div>
                {afterPreview ? (
                  <div className={`relative border rounded-lg h-48 overflow-hidden group ${
                    fieldErrors.after ? "border-red-500" : "border-slate-200"
                  }`}>
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
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-md transition-colors z-10"
                    >
                      <X className="size-4" />
                    </button>
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-xs font-semibold">After Image</span>
                    </div>
                  </div>
                ) : (
                  <label className={`cursor-pointer border-2 border-dashed rounded-lg h-48 flex flex-col items-center justify-center gap-3 bg-[#F8FAFC]/30 hover:bg-slate-50 transition-colors ${
                    fieldErrors.after ? "border-red-400 bg-red-50/5" : "border-slate-200"
                  }`}>
                    <Upload className="size-7 text-slate-400" />
                    <span className="text-lg font-semibold text-[#1A1A2E]">
                      Upload After Image
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "after")}
                    />
                  </label>
                )}
                {fieldErrors.after && (
                  <p className="text-xs font-semibold text-red-500 mt-1.5">{fieldErrors.after}</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Doctor's Name</label>
              <input
                type="text"
                value={doctor}
                onChange={(e) => {
                  setDoctor(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, doctor: "" }));
                }}
                placeholder="Dr. John Doe"
                className={`w-full h-12 rounded-lg border px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3659]/10 ${
                  fieldErrors.doctor ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-[#0F3659]"
                }`}
              />
              {fieldErrors.doctor && (
                <p className="text-xs font-semibold text-red-500 mt-1.5">{fieldErrors.doctor}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, location: "" }));
                }}
                placeholder="Istanbul, Turkey"
                className={`w-full h-12 rounded-lg border px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3659]/10 ${
                  fieldErrors.location ? "border-red-500 focus:border-red-500" : "border-slate-200 focus:border-[#0F3659]"
                }`}
              />
              {fieldErrors.location && (
                <p className="text-xs font-semibold text-red-500 mt-1.5">{fieldErrors.location}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700">
              Select Treatment
            </p>
            <Select
              value={treatment}
              onValueChange={(val) => {
                setTreatment(val);
                setFieldErrors((prev) => ({ ...prev, treatment: "" }));
              }}
            >
              <SelectTrigger className={`h-12 rounded-lg border px-4 text-sm text-slate-700 focus:ring-[#0F3659] ${
                fieldErrors.treatment ? "border-red-500" : "border-slate-200"
              }`}>
                <SelectValue placeholder="Select a treatment" />
              </SelectTrigger>
              <SelectContent className="rounded-lg">
                <SelectItem value="Invisalign Treatment">Invisalign Treatment</SelectItem>
                <SelectItem value="Dental Veneers">Dental Veneers</SelectItem>
                <SelectItem value="Teeth Whitening">Teeth Whitening</SelectItem>
              </SelectContent>
            </Select>
            {fieldErrors.treatment && (
              <p className="text-xs font-semibold text-red-500 mt-1.5">{fieldErrors.treatment}</p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-8 pt-0 flex flex-col sm:flex-row gap-4 border-t mt-4 bg-slate-50/50">
          <Button
            variant="outline"
            onClick={handleClose}
            className="flex-1 h-16 rounded-lg border-slate-300 text-xl font-bold text-[#1A1A2E] hover:bg-slate-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddPhoto}
            disabled={isUploading}
            className="flex-1 h-16 rounded-lg bg-[#0F3659] text-xl font-bold text-white hover:bg-[#0a2640] flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <span>Add Photo</span>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
