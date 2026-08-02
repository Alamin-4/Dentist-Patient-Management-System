"use client";

import { useState, useRef } from "react";
import {
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertCircle,
  X,
  Upload,
  Loader2,
  FileCheck,
} from "lucide-react";

interface SpecialtyCsvModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
  isUploading: boolean;
}

export function SpecialtyCsvModal({
  isOpen,
  onClose,
  onUpload,
  isUploading,
}: SpecialtyCsvModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [validatedRowCount, setValidatedRowCount] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const validateAndSetFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith(".csv") && !file.type.includes("csv")) {
      setSelectedFile(file);
      setValidationError("Please select a valid .CSV spreadsheet file.");
      setValidatedRowCount(0);
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text || !text.trim()) {
        setValidationError("The selected CSV file is empty.");
        setValidatedRowCount(0);
        return;
      }

      const lines = text
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      if (lines.length === 0) {
        setValidationError("The selected file has no readable data rows.");
        setValidatedRowCount(0);
        return;
      }

      // Check header row for 'name' or 'specialty'
      const headerRow = lines[0].toLowerCase();
      const hasNameCol = headerRow.includes("name") || headerRow.includes("specialty");

      if (!hasNameCol) {
        setValidationError("Invalid CSV headers! Missing required column: 'name' or 'specialty'.");
        setValidatedRowCount(0);
        return;
      }

      const dataRows = lines.length - 1;
      if (dataRows <= 0) {
        setValidationError("CSV header found, but there are no data rows to import.");
        setValidatedRowCount(0);
        return;
      }

      setValidationError(null);
      setValidatedRowCount(dataRows);
    };

    reader.readAsText(file);
  };

  // Download ready-to-use sample CSV template for Specialties
  const handleDownloadSampleCsv = () => {
    const csvContent =
      "name,description\n" +
      "Cosmetic Dentistry,Focuses on improving dental aesthetics and smile enhancements.\n" +
      "Endodontics,Specializes in root canal treatments and dental pulp care.\n" +
      "Implantology,Focuses on permanent dental implants and tooth restorations.\n" +
      "Oral Surgery,Deals with complex extractions and surgical jaw procedures.\n" +
      "Orthodontics,Focuses on teeth alignment, braces, and clear aligner therapies.\n";

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "specialties_sample_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleSubmit = () => {
    if (selectedFile && !validationError) {
      onUpload(selectedFile);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      setSelectedFile(null);
      setValidationError(null);
      setValidatedRowCount(0);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FileSpreadsheet className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Upload Specialties CSV
              </h2>
              <p className="text-xs text-gray-500">
                Import dental & medical specialties from a CSV spreadsheet.
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="flex size-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-sm text-gray-600">
          {/* File Upload Dropzone */}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900 text-xs uppercase tracking-wide">
              1. Select or Drop Your CSV File
            </h3>

            {!selectedFile ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${isDragging
                    ? "border-blue-500 bg-blue-50/50 scale-[0.99]"
                    : "border-gray-200 bg-slate-50/60 hover:bg-slate-50 hover:border-gray-300"
                  }`}
              >
                <div className="flex size-12 items-center justify-center rounded-full bg-white shadow-xs text-blue-600 mb-3 border border-gray-100">
                  <Upload className="size-5" />
                </div>
                <p className="text-xs font-semibold text-gray-800">
                  Click to choose file or drag & drop CSV here
                </p>
                <p className="text-[11px] text-gray-400 mt-1">
                  Supports .CSV (Comma Delimited) files
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-slate-50/70 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <FileCheck className="size-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900 truncate max-w-65">
                        {selectedFile.name}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>

                  {!isUploading && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setValidationError(null);
                        setValidatedRowCount(0);
                      }}
                      className="text-xs font-semibold text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-2xs hover:bg-gray-50 transition-colors"
                    >
                      Change File
                    </button>
                  )}
                </div>

                {/* Validation Status Indicator */}
                {validationError ? (
                  <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50/80 p-3 text-rose-900 text-xs">
                    <AlertCircle className="size-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-rose-950">File Format Error</p>
                      <p className="mt-0.5">{validationError}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-emerald-900 text-xs font-medium">
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                    <span>
                      Valid CSV header structure! Ready to import <strong>{validatedRowCount}</strong> specialties.
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Required Columns Specification */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 text-xs uppercase tracking-wide">
                2. Column Headers Standard
              </h3>
              <button
                type="button"
                onClick={handleDownloadSampleCsv}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Download className="size-3.5" />
                Download Sample Template
              </button>
            </div>

            <div className="rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 text-xs font-semibold text-gray-700">
                <span>Column Header</span>
                <span>Requirement</span>
                <span>Description</span>
              </div>

              <div className="flex items-start justify-between p-2.5 gap-2">
                <div className="font-mono text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100 shrink-0">
                  name
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                  <CheckCircle2 className="size-3" /> Required
                </span>
                <span className="text-xs text-gray-600 text-right flex-1">
                  Specialty title (e.g. Orthodontics)
                </span>
              </div>

              <div className="flex items-start justify-between p-2.5 gap-2">
                <div className="font-mono text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100 shrink-0">
                  description
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full shrink-0">
                  Optional
                </span>
                <span className="text-xs text-gray-600 text-right flex-1">
                  Brief description of the specialty
                </span>
              </div>
            </div>
          </div>

          {/* Sample Structure Box */}
          <div className="space-y-1.5">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
              Sample Sheet Format:
            </p>
            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-slate-50/50 p-2 font-mono text-[11px]">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-700 font-bold bg-white">
                    <th className="p-1.5">name</th>
                    <th className="p-1.5">description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/60 text-gray-600">
                  <tr>
                    <td className="p-1.5">Cosmetic Dentistry</td>
                    <td className="p-1.5">Focuses on improving dental aesthetics</td>
                  </tr>
                  <tr>
                    <td className="p-1.5">Endodontics</td>
                    <td className="p-1.5">Specializes in root canal treatments</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end border-t border-gray-100 px-6 py-4 bg-slate-50/50 gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={isUploading}
            className="rounded-xl px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-200/60 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!selectedFile || !!validationError || isUploading}
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Uploading & Processing...
              </>
            ) : (
              <>
                <Upload className="size-4" />
                Upload CSV Sheet
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
