"use client";

import { UploadCloud, FileText, X } from "lucide-react";
import { useRef } from "react";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";

interface FileUploadProps {
    name: "jciCertificate" | "videoWalkthrough";
    label: string;
    accept: string;
    disabled?: boolean;
    helperText?: string;
}

export function FileUpload({ name, label, accept, disabled, helperText }: FileUploadProps) {
    const { setValue, setError, clearErrors, watch, formState: { errors } } = useFormContext();
    const fileValue = watch(name);
    const inputRef = useRef<HTMLInputElement>(null);
    const fieldError = errors[name]?.message as string | undefined;

    const getFileName = () => {
        if (!fileValue) return "";
        if (fileValue instanceof File) return fileValue.name;
        if (typeof fileValue === "string") return fileValue.split("/").pop() || "File";
        return "File uploaded";
    };

    const getFileSize = () => {
        if (!fileValue) return "";
        if (fileValue instanceof File) return `${(fileValue.size / (1024 * 1024)).toFixed(2)} MB`;
        return "";
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 🚨 CRITICAL: Clear input immediately to prevent browser memory hang on large files
        e.target.value = "";

        // 1. STRICT Size Check FIRST (Must be before any other validation)
        if (file.size > 5 * 1024 * 1024) {
            setError(name, { type: "manual", message: "File size exceeds 5MB limit. Please choose a smaller file." });
            setValue(name, null, { shouldValidate: true });
            return;
        }

        // 2. STRICT Type Check based on field name
        if (name === "jciCertificate") {
            // JCI Certificate: ONLY PDF allowed
            const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

            if (!isPdf) {
                setError(name, {
                    type: "manual",
                    message: "Only PDF documents are allowed for JCI Certificate. Image files are not accepted."
                });
                setValue(name, null, { shouldValidate: true });
                return;
            }
        } else if (name === "videoWalkthrough") {
            // Video Walkthrough: ONLY video files allowed
            const isVideo = file.type.startsWith("video/") ||
                /\.(mp4|mov|avi|webm|mkv)$/i.test(file.name);

            if (!isVideo) {
                setError(name, {
                    type: "manual",
                    message: "Only video files (MP4, MOV, AVI, WEBM) are allowed. Images and PDFs are not accepted."
                });
                setValue(name, null, { shouldValidate: true });
                return;
            }
        }

        // 3. If all validations pass, set the file
        setValue(name, file, { shouldValidate: true });
        clearErrors(name);

        // Clear the other file's error if this one is valid (since only one is required)
        const otherField = name === "jciCertificate" ? "videoWalkthrough" : "jciCertificate";
        clearErrors(otherField);
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        setValue(name, null, { shouldValidate: true });
        if (inputRef.current) inputRef.current.value = "";
    };

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{label}</label>

            <input
                type="file"
                ref={inputRef}
                disabled={disabled}
                onChange={handleFileChange}
                accept={accept}
                className="hidden"
            />

            {!fileValue ? (
                <div
                    onClick={() => !disabled && inputRef.current?.click()}
                    className={cn(
                        "group flex cursor-pointer items-center justify-between rounded-lg border-2 border-dashed px-4 py-6 transition-all",
                        fieldError ? "border-red-500 bg-red-50/10" : "border-border hover:border-primary hover:bg-card",
                        disabled && "opacity-60 cursor-not-allowed pointer-events-none"
                    )}
                >
                    <div className="flex items-center gap-3">
                        <UploadCloud className="size-5 text-muted-foreground group-hover:text-primary" />
                        <span className="text-sm font-medium text-foreground">Click to upload or drag & drop</span>
                    </div>
                </div>
            ) : (
                <div className={cn(
                    "flex items-center justify-between rounded-lg border px-4 py-3 bg-card",
                    fieldError ? "border-red-500 bg-red-50/10" : "border-border"
                )}>
                    <div className="flex items-center gap-3 overflow-hidden">
                        <FileText className="size-5 text-primary shrink-0" />
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{getFileName()}</p>
                            <p className="text-xs text-muted-foreground">{getFileSize()}</p>
                        </div>
                    </div>
                    {!disabled && (
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="p-1.5 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        >
                            <X className="size-4" />
                        </button>
                    )}
                </div>
            )}

            {helperText && !fieldError && <p className="text-xs text-muted-foreground">{helperText}</p>}
            {fieldError && <p className="text-xs font-semibold text-destructive">{fieldError}</p>}
        </div>
    );
}