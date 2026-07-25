"use client";

import { UploadCloud } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface HeadshotUploadProps {
  onChange?: (file: File | null) => void;
  existingImageUrl?: string;
  disabled?: boolean;
  error?: string;
}

export function HeadshotUpload({ onChange, existingImageUrl, disabled, error }: HeadshotUploadProps) {
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (uploadedPreview && uploadedPreview.startsWith("blob:")) {
        URL.revokeObjectURL(uploadedPreview);
      }
    };
  }, [uploadedPreview]);

  const existingPreview = useMemo(() => {
    if (!existingImageUrl) return null;
    if (existingImageUrl.startsWith("http")) return existingImageUrl;
    return `http://3.99.158.129:8004${existingImageUrl}`;
  }, [existingImageUrl]);

  const preview = uploadedPreview || existingPreview;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const file = e.target.files?.[0];
    if (!file) return;

    // 🚨 CRITICAL: Immediately clear the input value to drop the browser's reference 
    // to the file. This prevents the browser from holding it in memory.
    e.target.value = "";

    // 1. STRICT Size Check (Synchronous, no React state updates yet)
    if (file.size > MAX_FILE_SIZE) {
      setLocalError("File size is too large. Maximum allowed size is 5MB.");
      onChange?.(null);
      return; // Exit immediately
    }

    // 2. STRICT Type Check
    const isValidType = file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg";
    const isValidExtension = /\.(jpg|jpeg|png)$/i.test(file.name);

    if (!isValidType && !isValidExtension) {
      setLocalError("Only image files (JPG, PNG) are allowed. PDF documents are not accepted here.");
      onChange?.(null);
      return; // Exit immediately
    }

    // 3. Safe Preview Generation (Only reached if file is valid)
    if (uploadedPreview && uploadedPreview.startsWith("blob:")) {
      URL.revokeObjectURL(uploadedPreview);
    }

    const newPreview = URL.createObjectURL(file);
    setUploadedPreview(newPreview);
    onChange?.(file);
  };

  const handleRemove = () => {
    if (uploadedPreview && uploadedPreview.startsWith("blob:")) {
      URL.revokeObjectURL(uploadedPreview);
    }
    setUploadedPreview(null);
    setLocalError(null);
    onChange?.(null);
  };

  if (preview) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-6 py-4">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Headshot" className="w-full h-full object-cover" />
          </div>

          {!disabled && (
            <button
              type="button"
              onClick={handleRemove}
              className="rounded-lg border border-primary px-6 py-2 font-semibold text-primary transition-all hover:bg-background cursor-pointer"
            >
              Re-Upload
            </button>
          )}
        </div>
        {(localError || error) && (
          <p className="text-xs font-semibold text-destructive mt-1">
            {localError || error}
          </p>
        )}
      </div>
    );
  }

  const activeError = localError || error;

  return (
    <div className="flex flex-col gap-2 w-full">
      <div
        className={`group relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-background p-10 transition-all ${activeError ? "border-red-500 bg-red-50/10" : "border-border"
          } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:border-primary hover:bg-card"}`}
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-card shadow-sm transition-transform group-hover:scale-110">
          <UploadCloud className="h-6 w-6 text-primary" />
        </div>
        <p className="text-sm font-semibold text-foreground">Click to upload or drag and drop</p>
        <p className="mt-1 text-xs font-medium text-muted-foreground">High-resolution JPG or PNG, minimal background (Max 5MB)</p>
        <input
          type="file"
          disabled={disabled}
          className={`absolute inset-0 opacity-0 ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
          onChange={handleFile}
          accept="image/png, image/jpeg, image/jpg"
        />
      </div>
      {activeError && (
        <p className="text-xs font-semibold text-destructive mt-1">
          {activeError}
        </p>
      )}
    </div>
  );
}