"use client";

import { UploadCloud, FileText, FileVideo, FileImage, X, AlertCircle } from "lucide-react";
import { useRef } from "react";
import { useController, useFormContext, type Control, type FieldValues, type Path } from "react-hook-form";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FileUploadFieldProps<TFieldValues extends FieldValues = FieldValues> {
  /** react-hook-form field name — must match a key in your form schema */
  name: Path<TFieldValues>;
  /** Optional control from useForm(). If omitted the component uses useFormContext(). */
  control?: Control<TFieldValues>;
  /** Visible label shown above the drop-zone */
  label: string;
  /** Native HTML accept string (e.g. ".pdf", "image/*", "video/mp4,video/webm") */
  accept?: string;
  /**
   * Maximum allowed file size in **megabytes**.
   * @default 5
   */
  maxSizeMB?: number;
  /**
   * Optional whitelist of allowed MIME type prefixes or exact types.
   * Examples: ["application/pdf"], ["image/"], ["video/"]
   * If omitted, only the `accept` attribute filters in the OS picker — no extra JS check.
   */
  allowedMimeTypes?: string[];
  /** Human-readable list of allowed types shown in the error. e.g. "PDF only" */
  allowedTypesLabel?: string;
  /** Small helper text shown below the drop-zone when there is no error */
  helperText?: string;
  /** Disables the entire field */
  disabled?: boolean;
  /** Extra className for the outer wrapper */
  className?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getFileIcon(file: File | string | null | undefined) {
  if (!file || typeof file === "string") return FileText;
  if (file instanceof File) {
    if (file.type.startsWith("image/")) return FileImage;
    if (file.type.startsWith("video/")) return FileVideo;
  }
  return FileText;
}

function getDisplayName(fileValue: File | string | null | undefined): string {
  if (!fileValue) return "";
  if (fileValue instanceof File) return fileValue.name;
  if (typeof fileValue === "string") return fileValue.split("/").pop() || "Uploaded file";
  return "Uploaded file";
}

function getDisplaySize(fileValue: File | string | null | undefined): string {
  if (fileValue instanceof File) return formatBytes(fileValue.size);
  return "";
}

// ─── Component ────────────────────────────────────────────────────────────────

export function FileUploadField<TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  label,
  accept,
  maxSizeMB = 5,
  allowedMimeTypes,
  allowedTypesLabel,
  helperText,
  disabled = false,
  className,
}: FileUploadFieldProps<TFieldValues>) {
  // Support both controlled (control prop) and context-driven usage
  const ctx = useFormContext<TFieldValues>();
  const resolvedControl = control ?? ctx?.control;

  const {
    field,
    fieldState: { error },
  } = useController<TFieldValues>({ name, control: resolvedControl });

  const inputRef = useRef<HTMLInputElement>(null);
  const fileValue = field.value as File | string | null | undefined;
  const hasFile = !!fileValue;
  const hasError = !!error;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clear the native input immediately so the same file can be re-selected after removal
    e.target.value = "";

    // ── 1. Size check ─────────────────────────────────────────────────────────
    if (file.size > maxSizeBytes) {
      field.onChange(null);
      // We need the parent form's setError — use ctx when available
      ctx?.setError(name as any, {
        type: "manual",
        message: `File size is too large (${formatBytes(file.size)}). Maximum allowed size is ${maxSizeMB} MB. Please select a smaller file.`,
      });
      return;
    }

    // ── 2. MIME type check ────────────────────────────────────────────────────
    if (allowedMimeTypes && allowedMimeTypes.length > 0) {
      const isAllowed = allowedMimeTypes.some((m) =>
        m.endsWith("/") ? file.type.startsWith(m) : file.type === m
      );

      if (!isAllowed) {
        field.onChange(null);
        ctx?.setError(name as any, {
          type: "manual",
          message: `Invalid file type (${file.type || "unknown"}). ${allowedTypesLabel ? `Allowed: ${allowedTypesLabel}.` : ""}`,
        });
        return;
      }
    }

    // ── 3. All good — set value and clear any previous error ──────────────────
    field.onChange(file);
    ctx?.clearErrors(name as any);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    field.onChange(null);
    ctx?.clearErrors(name as any);
    if (inputRef.current) inputRef.current.value = "";
  };

  const Icon = getFileIcon(fileValue);

  return (
    <div className={cn("space-y-2", className)}>
      {/* Label */}
      <label className="text-sm font-medium text-foreground">{label}</label>

      {/* Hidden native input */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        disabled={disabled}
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
      />

      {/* Drop-zone / File preview */}
      {!hasFile ? (
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-label={`Upload ${label}`}
          onClick={() => !disabled && inputRef.current?.click()}
          onKeyDown={(e) => {
            if (!disabled && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          className={cn(
            "group flex cursor-pointer select-none items-center justify-between rounded-lg border-2 border-dashed px-4 py-6 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            hasError
              ? "border-destructive bg-destructive/5"
              : "border-border hover:border-primary hover:bg-card",
            disabled && "cursor-not-allowed opacity-60 pointer-events-none"
          )}
        >
          <div className="flex items-center gap-3">
            <UploadCloud
              className={cn(
                "size-5 transition-colors",
                hasError ? "text-destructive" : "text-muted-foreground group-hover:text-primary"
              )}
            />
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-foreground">
                Click to upload or drag & drop
              </p>
              {(accept || maxSizeMB) && (
                <p className="text-xs text-muted-foreground">
                  {[allowedTypesLabel, `Max ${maxSizeMB} MB`].filter(Boolean).join(" · ")}
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "flex items-center justify-between rounded-lg border px-4 py-3 bg-card",
            hasError ? "border-destructive bg-destructive/5" : "border-border"
          )}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <Icon className="size-5 text-primary shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{getDisplayName(fileValue)}</p>
              <p className="text-xs text-muted-foreground">{getDisplaySize(fileValue)}</p>
            </div>
          </div>
          {!disabled && (
            <button
              type="button"
              onClick={handleRemove}
              aria-label="Remove file"
              className="ml-2 p-1.5 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors shrink-0"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      )}

      {/* Error message — shown with priority over helperText */}
      {hasError ? (
        <p className="flex items-start gap-1.5 text-xs font-semibold text-destructive" role="alert">
          <AlertCircle className="size-3.5 mt-0.5 shrink-0" />
          {error.message}
        </p>
      ) : helperText ? (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  );
}
