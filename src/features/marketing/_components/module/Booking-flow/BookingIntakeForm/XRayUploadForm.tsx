"use client";

import { useEffect, useState, useRef } from "react";
import { Upload, FileText, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  getBookingData,
  setXrayFile,
  updateXrayNotes,
  getXrayFile,
} from "@/lib/storage/bookingService";

export const xrayUploadSchema = z.object({
  file: z
    .any()
    .optional()
    .nullable()
    .refine(
      (file) => !file || (file instanceof File && file.size <= 5 * 1024 * 1024),
      { message: "File size exceeds 5MB limit. Please choose a smaller file." }
    )
    .refine(
      (file) =>
        !file ||
        (file instanceof File &&
          (file.type.startsWith("image/") ||
            /\.(jpg|jpeg|png|dcm|dicom)$/i.test(file.name))),
      { message: "Only JPG, PNG, and DICOM files are allowed." }
    ),
  notes: z.string().optional(),
});

type XRayUploadFormValues = z.infer<typeof xrayUploadSchema>;

interface XRayUploadFormProps {
  errors?: Record<string, string>;
  setErrors?: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export default function XRayUploadForm({
  errors: parentErrors = {},
  setErrors,
}: XRayUploadFormProps) {
  const initialData = getBookingData();
  const initialFile = getXrayFile();

  const {
    register,
    setValue,
    watch,
    formState: { errors: formErrors },
  } = useForm<XRayUploadFormValues>({
    resolver: zodResolver(xrayUploadSchema),
    mode: "onChange",
    defaultValues: {
      file: initialFile || null,
      notes: initialData.xrayNotes || "",
    },
  });

  const file = watch("file");
  const notes = watch("notes");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setXrayFile(file || null);
  }, [file]);

  useEffect(() => {
    updateXrayNotes(notes || "");
  }, [notes]);

  // Sync local errors to parent
  useEffect(() => {
    if (setErrors) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.file;
        delete next.notes;
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
      <div className="mb-8">
        <h2 className="text-[22px] font-bold text-[#1A1A2E] mb-2">
          Do you have recent dental X-rays?
        </h2>
        <p className="text-[#6B7280] text-[16px]">
          X-rays taken within the past 18 months help doctors give you a more
          precise quote.
        </p>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const droppedFile = e.dataTransfer.files[0];
          if (droppedFile) {
            setValue("file", droppedFile, { shouldValidate: true });
          }
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative flex flex-col items-center justify-center w-full py-16 border-2 border-dashed rounded-3xl cursor-pointer transition-all
          ${isDragging ? "border-[#113254] bg-[#F0F9FF]" : "border-[#E5E7EB] hover:border-[#113254] bg-white"}
          ${file ? "border-solid border-[#113254] bg-[#F8FAFC]" : ""}
          ${activeErrors.file ? "border-red-500 bg-red-50/10" : ""}
        `}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".jpg,.jpeg,.png,.dicom,.dcm,image/*"
          onChange={(e) => {
            const selectedFile = e.target.files?.[0] || null;
            setValue("file", selectedFile, { shouldValidate: true });
          }}
        />

        {file ? (
          <div className="flex flex-col items-center animate-in zoom-in duration-300">
            <div className="relative p-4 bg-white rounded-lg shadow-sm mb-4">
              <FileText className="w-10 h-10 text-[#113254]" />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setValue("file", null, { shouldValidate: true });
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <span className="text-[#1A1A2E] font-bold">{file.name}</span>
            <span className="text-[#6B7280] text-sm">Click to change file</span>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <Upload className="w-8 h-8 text-[#9CA3AF] mb-4" />
            <p className="text-[#1A1A2E] font-bold text-[18px]">
              Drop files here or Tab to upload
            </p>
            <p className="text-[#9CA3AF] text-[15px] mt-1">
              JPG, PNG, DICOM accepted
            </p>
          </div>
        )}
      </div>

      {activeErrors.file && (
        <p className="text-xs text-red-500 font-semibold mt-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
          {String(activeErrors.file.message || activeErrors.file)}
        </p>
      )}

      <div className="mt-6">
        <label className="mb-2 block text-[15px] font-medium text-[#4B5563]">
          Notes for your dentist
        </label>
        <textarea
          {...register("notes")}
          placeholder="Add any context about this file"
          className="w-full min-h-28 rounded-lg border border-[#E5E7EB] p-4 text-[#1A1A2E] outline-none transition-colors placeholder:text-[#9CA3AF] focus:border-[#113254]"
        />
      </div>

      <div className="mt-10 p-6 bg-[#FFFBEB] border border-[#FEF3C7] rounded-lg">
        <p className="text-[#1A1A2E] text-[15px] leading-relaxed font-medium">
          Without X-rays, your estimate range may be wider. Your doctors may
          also request them during your video consultation before confirming a
          final price.
        </p>
      </div>
    </div>
  );
}
