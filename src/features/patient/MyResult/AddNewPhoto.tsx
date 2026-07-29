"use client";

import React from "react";
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
import { useAddPhotoController } from "@/hooks/patient/useAddPhotoController";

interface AddPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddPhotoModal({ isOpen, onClose }: AddPhotoModalProps) {
  const {
    beforePreview,
    afterPreview,
    selectedDentistId,
    treatment,
    fieldErrors,
    generalError,
    uniqueDentists,
    uniqueProcedures,
    isUploading,
    setSelectedDentistId,
    setTreatment,
    setBeforeFile,
    setBeforePreview,
    setAfterFile,
    setAfterPreview,
    handleFileChange,
    handleClose,
    handleAddPhoto,
  } = useAddPhotoController({ onClose });

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden border-none rounded-3xl gap-0">
        <div className="flex flex-col p-6 border-b bg-white">
          <DialogTitle className="text-3xl font-bold text-text">
            Add New Photo
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500 mt-1">
            Upload before and after images, select treatment, and enter details.
          </DialogDescription>
        </div>

        <div className="p-8 space-y-6 max-h-[75vh] overflow-y-auto bg-white">
          {generalError && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-sm flex items-start gap-2.5 shadow-sm">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
              <div>
                <span className="font-bold">Error:</span> {generalError}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <p className="text-xl font-semibold text-text">Photos</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ImageUploadBox
                type="before"
                preview={beforePreview}
                error={fieldErrors.before}
                onFileChange={(file) => handleFileChange(file, "before")}
                onClear={() => {
                  setBeforeFile(null);
                  setBeforePreview(null);
                }}
              />
              <ImageUploadBox
                type="after"
                preview={afterPreview}
                error={fieldErrors.after}
                onFileChange={(file) => handleFileChange(file, "after")}
                onClear={() => {
                  setAfterFile(null);
                  setAfterPreview(null);
                }}
              />
            </div>
          </div>

          <SelectionDropdowns
            selectedDentistId={selectedDentistId}
            treatment={treatment}
            fieldErrors={fieldErrors}
            uniqueDentists={uniqueDentists}
            uniqueProcedures={uniqueProcedures}
            onDentistChange={(val) => {
              setSelectedDentistId(val);
              setTreatment("");
            }}
            onTreatmentChange={setTreatment}
          />
        </div>

        <div className="p-8 pt-0 flex flex-col sm:flex-row gap-4 border-t mt-4 bg-slate-50/50">
          <Button
            variant="outline"
            onClick={handleClose}
            className="flex-1 h-16 rounded-lg border-slate-300 text-xl font-bold text-text hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddPhoto}
            disabled={isUploading}
            className="flex-1 h-16 rounded-lg bg-[#0F3659] text-xl font-bold text-white hover:bg-[#0a2640] flex items-center justify-center gap-2 cursor-pointer"
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

interface ImageUploadBoxProps {
  type: "before" | "after";
  preview: string | null;
  error?: string;
  onFileChange: (file: File) => void;
  onClear: () => void;
}

function ImageUploadBox({
  type,
  preview,
  error,
  onFileChange,
  onClear,
}: ImageUploadBoxProps) {
  return (
    <div>
      {preview ? (
        <div className={`relative border rounded-lg h-48 overflow-hidden group ${error ? "border-red-500" : "border-slate-200"}`}>
          <Image
            src={preview}
            alt={`${type === "before" ? "Before" : "After"} Preview`}
            fill
            className="object-cover"
          />
          <button
            type="button"
            onClick={onClear}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-md transition-colors z-10"
          >
            <X className="size-4" />
          </button>
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white text-xs font-semibold capitalize">{type} Image</span>
          </div>
        </div>
      ) : (
        <label className={`cursor-pointer border-2 border-dashed rounded-lg h-48 flex flex-col items-center justify-center gap-3 bg-[#F8FAFC]/30 hover:bg-slate-50 transition-colors ${error ? "border-red-400 bg-red-50/5" : "border-slate-200"}`}>
          <Upload className="size-7 text-slate-400" />
          <span className="text-lg font-semibold text-text capitalize">
            Upload {type} Image
          </span>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onFileChange(file);
            }}
          />
        </label>
      )}
      {error && (
        <p className="text-xs font-semibold text-red-500 mt-1.5">{error}</p>
      )}
    </div>
  );
}

interface SelectionDropdownsProps {
  selectedDentistId: string;
  treatment: string;
  fieldErrors: Record<string, string>;
  uniqueDentists: Array<{ id: string; name: string; location: string }>;
  uniqueProcedures: string[];
  onDentistChange: (val: string) => void;
  onTreatmentChange: (val: string) => void;
}

function SelectionDropdowns({
  selectedDentistId,
  treatment,
  fieldErrors,
  uniqueDentists,
  uniqueProcedures,
  onDentistChange,
  onTreatmentChange,
}: SelectionDropdownsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Dentist Dropdown */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Select Dentist</label>
        <Select
          value={selectedDentistId}
          onValueChange={onDentistChange}
        >
          <SelectTrigger className={`h-12 rounded-lg border px-4 text-sm text-slate-700 focus:ring-[#0F3659] bg-white ${fieldErrors.dentist ? "border-red-500" : "border-slate-200"}`}>
            <SelectValue placeholder="Choose your dentist" />
          </SelectTrigger>
          <SelectContent className="rounded-lg bg-white">
            {uniqueDentists.map((dentist) => (
              <SelectItem key={dentist.id} value={dentist.id}>
                {dentist.name}
              </SelectItem>
            ))}
            {uniqueDentists.length === 0 && (
              <p className="p-2 text-xs text-gray-400 text-center">No dentists found from bookings</p>
            )}
          </SelectContent>
        </Select>
        {fieldErrors.dentist && (
          <p className="text-xs font-semibold text-red-500 mt-1.5">{fieldErrors.dentist}</p>
        )}
      </div>

      {/* Treatment Dropdown */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Select Treatment</label>
        <Select
          value={treatment}
          onValueChange={onTreatmentChange}
          disabled={!selectedDentistId}
        >
          <SelectTrigger className={`h-12 rounded-lg border px-4 text-sm text-slate-700 focus:ring-[#0F3659] bg-white ${fieldErrors.treatment ? "border-red-500" : "border-slate-200"}`}>
            <SelectValue placeholder={selectedDentistId ? "Choose treatment" : "Select dentist first"} />
          </SelectTrigger>
          <SelectContent className="rounded-lg bg-white">
            {uniqueProcedures.map((procName) => (
              <SelectItem key={procName} value={procName}>
                {procName}
              </SelectItem>
            ))}
            {uniqueProcedures.length === 0 && selectedDentistId && (
              <p className="p-2 text-xs text-gray-400 text-center">No treatments found for this dentist</p>
            )}
          </SelectContent>
        </Select>
        {fieldErrors.treatment && (
          <p className="text-xs font-semibold text-red-500 mt-1.5">{fieldErrors.treatment}</p>
        )}
      </div>
    </div>
  );
}
