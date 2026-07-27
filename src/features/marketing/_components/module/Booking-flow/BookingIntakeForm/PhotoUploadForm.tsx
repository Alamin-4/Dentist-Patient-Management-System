"use client";

import { useEffect, useRef, useState } from "react";
import { Trash2, Upload, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import GuidelinesModal from "./GuidelinesModal";
import {
  getAllDentalPhotos,
  setDentalPhoto,
} from "@/lib/storage/bookingService";

const maxFileValidation = (requiredMessage: string) =>
  z
    .any()
    .superRefine((file, ctx) => {
      if (!(file instanceof File)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: requiredMessage,
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `File size is too large (${sizeMB} MB). Maximum allowed size is 5 MB. Please select a smaller photo.`,
        });
      }
    });

export const photoUploadSchema = z.object({
  frontSmile: maxFileValidation("Front smile photo is required"),
  wideSmile: maxFileValidation("Wide smile photo is required"),
  upperArch: maxFileValidation("Upper arch photo is required"),
  lowerArch: maxFileValidation("Lower arch photo is required"),
  leftSide: maxFileValidation("Left side photo is required"),
  rightSide: maxFileValidation("Right side photo is required"),
});

type PhotoUploadFormValues = z.infer<typeof photoUploadSchema>;

const PHOTO_FIELDS = [
  { name: "frontSmile", label: "Front Smile" },
  { name: "wideSmile", label: "Wide Smile" },
  { name: "upperArch", label: "Upper Arch" },
  { name: "lowerArch", label: "Lower Arch" },
  { name: "leftSide", label: "Left Side" },
  { name: "rightSide", label: "Right Side" },
] as const;

interface PhotoUploadFormProps {
  errors?: Record<string, string>;
  setErrors?: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export default function PhotoUploadForm({
  errors: parentErrors = {},
  setErrors,
}: PhotoUploadFormProps) {
  const [showGuidelines, setShowGuidelines] = useState(false);
  const initialPhotos = getAllDentalPhotos();

  const {
    setValue,
    watch,
    formState: { errors: formErrors },
  } = useForm<PhotoUploadFormValues>({
    resolver: zodResolver(photoUploadSchema),
    defaultValues: {
      frontSmile: initialPhotos.frontSmile || null,
      wideSmile: initialPhotos.wideSmile || null,
      upperArch: initialPhotos.upperArch || null,
      lowerArch: initialPhotos.lowerArch || null,
      leftSide: initialPhotos.leftSide || null,
      rightSide: initialPhotos.rightSide || null,
    },
    mode: "onChange",
  });

  const frontSmile = watch("frontSmile");
  const wideSmile = watch("wideSmile");
  const upperArch = watch("upperArch");
  const lowerArch = watch("lowerArch");
  const leftSide = watch("leftSide");
  const rightSide = watch("rightSide");

  useEffect(() => {
    setDentalPhoto("frontSmile", frontSmile);
    setDentalPhoto("wideSmile", wideSmile);
    setDentalPhoto("upperArch", upperArch);
    setDentalPhoto("lowerArch", lowerArch);
    setDentalPhoto("leftSide", leftSide);
    setDentalPhoto("rightSide", rightSide);
  }, [frontSmile, wideSmile, upperArch, lowerArch, leftSide, rightSide]);

  // Sync local errors to parent
  useEffect(() => {
    if (setErrors) {
      setErrors((prev) => {
        const next = { ...prev };
        PHOTO_FIELDS.forEach((field) => {
          delete next[field.name];
        });
        Object.entries(formErrors).forEach(([key, err]) => {
          if (err?.message) {
            next[key] = String(err.message);
          }
        });
        if (JSON.stringify(prev) !== JSON.stringify(next)) {
          return next;
        }
        return prev;
      });
    }
  }, [formErrors, setErrors]);

  const activeErrors = { ...formErrors, ...parentErrors };

  return (
    <div className="w-full bg-white animate-in fade-in duration-500">
      <h2 className="text-[22px] font-bold text-[#1A1A2E] mb-6">
        Upload your dental photos
      </h2>

      {/* Tip banner */}
      <div className="flex items-start justify-between gap-4 p-5 bg-[#F0F9FF] border border-[#E0F2FE] rounded-lg mb-8">
        <div>
          <p className="font-bold text-[#1A1A2E] text-[15px] mb-1">
            Tip for best results
          </p>
          <p className="text-[#6B7280] text-sm leading-relaxed">
            Stand near a window in natural light. Use your phone&apos;s front
            camera. Avoid flash — it washes out detail doctors need for an
            accurate estimate.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowGuidelines(true)}
          className="shrink-0 px-4 py-2.5 border border-[#113254] text-[#113254] font-semibold text-[13px] rounded-lg hover:bg-[#113254] hover:text-white transition-all whitespace-nowrap"
        >
          View Guidelines
        </button>
      </div>

      {/* Photos upload area */}
      <div className="mb-8">
        <p className="text-[14px] font-semibold text-[#4B5563] mb-4">
          All 6 photos are required for a precise estimate <span className="text-red-500">*</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {PHOTO_FIELDS.map((field) => (
            <div key={field.name} className="flex flex-col gap-1.5">
              <UploadCard
                label={field.label}
                value={watch(field.name)}
                onChange={(file) => {
                  setValue(field.name, file, { shouldValidate: true });
                }}
                error={activeErrors[field.name] ? String(activeErrors[field.name]?.message || activeErrors[field.name]) : undefined}
              />
              {activeErrors[field.name] && (
                <p className="flex items-center gap-1.5 text-xs text-red-500 font-semibold mt-1 animate-in fade-in slide-in-from-top-1 duration-150">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-500" />
                  {String(activeErrors[field.name]?.message || activeErrors[field.name])}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <GuidelinesModal
        isOpen={showGuidelines}
        onClose={() => setShowGuidelines(false)}
      />
    </div>
  );
}

interface UploadCardProps {
  label: string;
  value: File | null;
  onChange: (file: File | null) => void;
  error?: string;
}

function UploadCard({ label, value, onChange, error }: UploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    
    // Clear input so selecting the same file after an error works
    e.target.value = "";

    onChange(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={`relative min-h-40 rounded-lg overflow-hidden border-2 border-dashed transition-colors cursor-pointer group ${error ? "border-red-500 bg-red-50/10" : "border-[#E5E7EB] hover:border-[#113254]"
      }`}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />

      {preview ? (
        <>
          <img
            src={preview}
            alt={label}
            className="w-full h-full object-cover absolute inset-0"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
            aria-label={`Remove ${label}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-3 w-full h-full min-h-40 p-6 text-center"
        >
          <Upload className={`w-6 h-6 transition-colors ${error ? "text-red-400" : "text-[#9CA3AF] group-hover:text-[#113254]"}`} />
          <span className="text-[13px] font-semibold text-[#1A1A2E] leading-snug">
            {label}
          </span>
        </button>
      )}
    </div>
  );
}
