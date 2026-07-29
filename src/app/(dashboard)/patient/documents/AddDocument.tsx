"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, X, Loader2, FileText, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { apiClient } from "@/api/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UploadDocumentModal({
  isOpen,
  onClose,
}: UploadModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("X-Ray");
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const handleClose = () => {
    setTitle("");
    setCategory("X-Ray");
    setFile(null);
    setErrors({});
    onClose();
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;

    if (droppedFile.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, file: `File is too large (${(droppedFile.size / (1024 * 1024)).toFixed(2)} MB). Maximum allowed size is 5 MB.` }));
      return;
    }

    setFile(droppedFile);
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.file;
      return copy;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (!selectedFile) return;

    if (selectedFile.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, file: `File is too large (${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB). Maximum allowed size is 5 MB.` }));
      e.target.value = "";
      return;
    }

    setFile(selectedFile);
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.file;
      return copy;
    });
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const uploadDocMutation = useMutation({
    mutationFn: async ({
      fileToUpload,
      docTitle,
      docCategory,
    }: {
      fileToUpload: File;
      docTitle: string;
      docCategory: string;
    }) => {
      // 1. Upload file using files API
      const uploadRes = await apiClient.files.upload(fileToUpload);
      const secureUrl = uploadRes.data?.secure_url || uploadRes.secure_url;
      if (!secureUrl) throw new Error("Failed to upload file to Cloudinary.");

      // 2. Submit metadata to patients/documents
      return await apiClient.patients.uploadDocument({
        title: docTitle,
        category: docCategory,
        fileUrl: secureUrl,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient-documents"] });
      toast.success("Document uploaded successfully!");
      handleClose();
    },
    onError: (err: any) => {
      setErrors((prev) => ({
        ...prev,
        file: err?.message || "Failed to upload document.",
      }));
    },
  });

  const handleAddDocument = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Document title is required";
    if (!file) newErrors.file = "Please upload or drop a file";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    uploadDocMutation.mutate({
      fileToUpload: file!,
      docTitle: title,
      docCategory: category,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-175 w-full p-0 border-none rounded-lg overflow-hidden bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <DialogTitle className="text-[22px] font-bold text-text">
            Upload Document
          </DialogTitle>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          {/* Document Title */}
          <div className="flex flex-col gap-2.5">
            <label className="text-[15px] font-semibold text-text">
              Document Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Dental X-ray 2026, Invoice, Prescription"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.trim() && errors.title) {
                  setErrors((prev) => {
                    const copy = { ...prev };
                    delete copy.title;
                    return copy;
                  });
                }
              }}
              className={`h-14 w-full border rounded-lg px-4 font-normal placeholder-[#9EA9AA] focus:outline-none transition-colors ${errors.title ? "border-red-500 focus:border-red-500" : "border-[#E5E7EB] focus:border-[#113254]"
                }`}
            />
            {errors.title && (
              <p className="text-xs text-red-500 font-semibold animate-in fade-in slide-in-from-top-1">
                {errors.title}
              </p>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="flex flex-col gap-2.5">
            <label className="text-[15px] font-semibold text-text">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-14 w-full border border-[#E5E7EB] rounded-lg px-4 font-normal focus:border-[#113254] focus:outline-none bg-white text-text cursor-pointer"
            >
              <option value="X-Ray">X-Ray</option>
              <option value="Invoice / Receipt">Invoice / Receipt</option>
              <option value="Prescription">Prescription</option>
              <option value="Medical Report">Medical Report</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Upload Area */}
          <div className="flex flex-col gap-2.5">
            <label className="text-[15px] font-semibold text-text">
              File <span className="text-red-500">*</span>
            </label>
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative flex flex-col items-center justify-center w-full py-16 border-2 border-dashed rounded-lg cursor-pointer transition-all
                ${isDragging ? "border-[#113254] bg-[#F0F9FF]" : "border-[#D1D5DB] hover:border-[#113254] bg-white"}
                ${file ? "border-solid border-[#113254] bg-[#F8FAFC]" : ""}
                ${errors.file ? "border-red-500" : ""}
              `}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".jpg,.png,.dicom,image/*,application/pdf"
                onChange={handleFileChange}
              />

              {file ? (
                <div className="flex flex-col items-center animate-in zoom-in duration-300">
                  <div className="relative p-4 bg-white rounded-lg shadow-sm border border-slate-100 mb-3">
                    <FileText className="w-8 h-8 text-[#113254]" />
                    <button
                      onClick={handleRemoveFile}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-650 text-white rounded-full p-1 shadow transition-colors cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="text-text font-bold text-sm">{file.name}</span>
                  <span className="text-sec-text text-xs mt-1">Click or drag another to change</span>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center px-4">
                  <Upload className="w-8 h-8 text-[#9CA3AF] mb-3" />
                  <p className="text-text font-bold text-[16px]">
                    Drop files here or click to upload
                  </p>
                  <p className="text-sec-text text-[13px] mt-1 font-medium">
                    JPG, PNG, PDF, DICOM accepted (Max 5MB)
                  </p>
                </div>
              )}
            </div>
            {errors.file && (
              <p className="text-xs text-red-500 font-semibold animate-in fade-in slide-in-from-top-1">
                {errors.file}
              </p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-8 py-6 border-t border-gray-100 bg-[#F9FAFC]">
          <button
            onClick={handleClose}
            disabled={uploadDocMutation.isPending}
            className="px-10 py-3 border border-gray-200 text-slate-600 font-semibold text-[15px] rounded-lg hover:bg-gray-50 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleAddDocument}
            disabled={uploadDocMutation.isPending}
            className="inline-flex items-center gap-2 px-10 py-3 bg-[#113254] hover:bg-[#0d2844] text-white font-bold text-[15px] rounded-lg active:scale-95 transition-all shadow disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
          >
            {uploadDocMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Add Document"
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
