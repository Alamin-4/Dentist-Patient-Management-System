"use client";

import { useRef } from "react";
import { useFormContext } from "react-hook-form";
import { UploadCloud, FileText, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  name: string;
  error?: string;
  disabled?: boolean;
}

export function DocumentUpload({ label, name, error, disabled }: Props) {
  const { setValue, setError, clearErrors, watch } = useFormContext();
  const fileValue = watch(name);
  const inputRef = useRef<HTMLInputElement>(null);

  const getFileName = () => {
    if (!fileValue) return "";
    if (fileValue instanceof File) return fileValue.name;
    if (typeof fileValue === "string") return fileValue.split("/").pop() || "Document";
    return "Document uploaded";
  };

  const getFileSize = () => {
    if (!fileValue) return "";
    if (fileValue instanceof File) return `${(fileValue.size / (1024 * 1024)).toFixed(2)} MB`;
    return "";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Clear input immediately to prevent browser memory issues
    e.target.value = "";

    // 1. Size Validation (Max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError(name, {
        type: "manual",
        message: "File size exceeds 5MB limit. Please choose a smaller file.",
      });
      setValue(name, null, { shouldValidate: true });
      return;
    }

    // 2. Format Validation (PDF, DOC, DOCX)
    const isDoc = selectedFile.type === "application/pdf" ||
      selectedFile.type === "application/msword" ||
      selectedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      /\.(pdf|doc|docx)$/i.test(selectedFile.name);

    if (!isDoc) {
      setError(name, {
        type: "manual",
        message: "Only PDF and Word documents (.doc, .docx) are allowed.",
      });
      setValue(name, null, { shouldValidate: true });
      return;
    }

    // 3. Success: set file and clear error
    setValue(name, selectedFile, { shouldValidate: true });
    clearErrors(name);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue(name, null, { shouldValidate: true });
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[#0A2533] inline-block">{label}</label>

      <input
        type="file"
        ref={inputRef}
        disabled={disabled}
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx"
        className="hidden"
      />

      {!fileValue ? (
        <div
          onClick={() => !disabled && inputRef.current?.click()}
          className={cn(
            "group flex cursor-pointer items-center justify-between rounded-lg border-2 border-dashed px-4 py-6 transition-all",
            error ? "border-red-500 bg-red-50/10" : "border-gray-200 hover:border-[#0E3E65] hover:bg-slate-50/50",
            disabled && "opacity-60 cursor-not-allowed pointer-events-none"
          )}
        >
          <div className="flex items-center gap-3">
            <UploadCloud className={cn(
              "size-5 transition-colors",
              error ? "text-red-400" : "text-gray-400 group-hover:text-[#0E3E65]"
            )} />
            <span className={cn(
              "text-sm font-medium transition-colors",
              error ? "text-red-500" : "text-gray-600 group-hover:text-[#0E3E65]"
            )}>
              Click to upload or drag & drop (PDF, DOC, DOCX up to 5MB)
            </span>
          </div>
        </div>
      ) : (
        <div className={cn(
          "flex items-center justify-between rounded-lg border px-4 py-3 bg-white shadow-sm",
          error ? "border-red-500 bg-red-50/10" : "border-gray-100"
        )}>
          <div className="flex items-center gap-3 overflow-hidden">
            <FileText className="size-5 text-[#0E3E65] shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-[#0A2533] truncate max-w-50 sm:max-w-100">
                {getFileName()}
              </p>
              {getFileSize() && (
                <p className="text-xs text-gray-400 font-medium">{getFileSize()}</p>
              )}
            </div>
          </div>
          {!disabled && (
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs font-semibold text-red-500 flex items-center gap-1.5 mt-1">
          <AlertCircle size={12} className="shrink-0" /> {error}
        </p>
      )}
    </div>
  );
}
