"use client";

import { useState, useRef } from "react";
import { Upload, X, FileText, Download, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (
    file: File,
    options?: { onSuccess?: (response: any) => void; onError?: (err: any) => void }
  ) => void;
  isPending: boolean;
}

export function ImportModal({ isOpen, onClose, onUpload, isPending }: ImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [validation, setValidation] = useState<{
    status: "idle" | "success" | "error";
    message: string;
    detectedHeaders?: string[];
    missingFields?: string[];
  }>({ status: "idle", message: "" });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    setFile(null);
    setIsSuccess(false);
    setValidation({ status: "idle", message: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClose = () => {
    if (isPending) return;
    resetState();
    onClose();
  };

  const downloadTemplate = () => {
    const headers = [
      "fullName",
      "specialty",
      "city",
      "clinicName",
      "phoneNumber",
      "googleRating",
      "googleReviewCount",
      "clinicAddress",
      "profileUrl",
    ];
    const sampleRow = [
      "Dr. Jane Smith",
      "Orthodontics",
      "New York",
      "Metro Dental",
      "+15550199",
      "4.8",
      "42",
      "123 Broadway, New York, NY",
      "https://metrodental.example.com",
    ];
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), sampleRow.join(",")].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "dentist_import_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const validateFileHeaders = (selectedFile: File) => {
    const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase();
    
    if (fileExtension !== "csv") {
      setValidation({
        status: "success",
        message: "Excel file format detected. Headings will be verified on the server side.",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const firstLine = text.split("\n")[0];
        if (!firstLine) {
          setValidation({
            status: "error",
            message: "The uploaded file is empty.",
          });
          return;
        }

        const headers = firstLine
          .split(",")
          .map(h => h.replace(/["'\r]/g, "").trim());

        const normalizedHeaders = headers.map(h => 
          h.toLowerCase().replace(/[_\s-]+/g, "")
        );

        const nameKeywords = ["fullname", "name", "dentistname", "doctorname"];
        const hasName = normalizedHeaders.some(h => nameKeywords.includes(h));

        const recommendedFields = [
          { key: "specialty", names: ["specialty", "specialization", "speciality", "field"] },
          { key: "city", names: ["city", "town", "location", "region"] },
          { key: "phoneNumber", names: ["phonenumber", "phone", "contactnumber", "mobile", "telephone"] }
        ];

        const missingRecommended: string[] = [];
        recommendedFields.forEach(field => {
          const hasField = normalizedHeaders.some(h => field.names.includes(h));
          if (!hasField) missingRecommended.push(field.key);
        });

        if (!hasName) {
          setValidation({
            status: "error",
            message: "Missing Required Header: A column for 'Name' or 'FullName' is required so the practitioners can be registered.",
            detectedHeaders: headers,
          });
        } else if (missingRecommended.length > 0) {
          setValidation({
            status: "success",
            message: `Headers validated successfully. Warning: Recommended columns are missing: [${missingRecommended.join(", ")}]. It is recommended to include them for better search filters.`,
            detectedHeaders: headers,
            missingFields: missingRecommended
          });
        } else {
          setValidation({
            status: "success",
            message: "All required and recommended headers detected successfully!",
            detectedHeaders: headers,
          });
        }
      } catch (err) {
        setValidation({
          status: "success",
          message: "Pre-validation completed. Content schema validation will be performed on the server.",
        });
      }
    };
    reader.readAsText(selectedFile.slice(0, 5000));
  };

  const handleFileSelect = (selectedFile: File) => {
    const ext = selectedFile.name.split(".").pop()?.toLowerCase();
    if (ext !== "csv") {
      const errorMsg = "Invalid file type. Only JPG, PNG, WEBP, PDF, MP4, WEBM, MOV, and CSV files are allowed.";
      setValidation({
        status: "error",
        message: errorMsg,
      });
      setFile(null);
      return;
    }

    setFile(selectedFile);
    validateFileHeaders(selectedFile);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleImportSubmit = () => {
    if (!file) return;
    onUpload(file, {
      onSuccess: (response: any) => {
        setIsSuccess(true);
        setValidation({
          status: "success",
          message: response?.message || "Dentist directory imported successfully.",
        });
        setFile(null);
      },
      onError: (err: any) => {
        const errMsg = err?.response?.data?.message || err?.message || "Failed to import dentist directory.";
        setValidation({
          status: "error",
          message: errMsg,
        });
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg p-6 bg-white rounded-xl shadow-lg border border-slate-100">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="p-3 bg-emerald-100 rounded-full text-emerald-600 animate-bounce">
              <CheckCircle className="h-10 w-10" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Import Completed!</h3>
            <p className="text-sm text-slate-600 max-w-sm">
              {validation.message}
            </p>
            <DialogFooter className="w-full mt-4 pt-4 border-t border-slate-100 flex justify-center sm:justify-center">
              <button
                type="button"
                onClick={handleClose}
                className="w-full bg-primary hover:bg-[#0D3658] text-white px-4 py-2 text-xs font-bold rounded-lg transition-all shadow-sm cursor-pointer"
              >
                Close Window
              </button>
            </DialogFooter>
          </div>
        ) : (
          <>
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-xl font-bold text-slate-800">
                Import Dentists Directory
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-500">
                Upload a spreadsheet to bulk-add or update dentist profiles in the public directories.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 my-2">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-slate-500" />
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-700">Need a template spreadsheet?</p>
                    <p className="text-[11px] text-slate-500">Download our formatted CSV template to match keys.</p>
                  </div>
                </div>
                <button
                  onClick={downloadTemplate}
                  type="button"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-primary hover:text-[#0D3658] hover:bg-slate-100 rounded-lg transition-colors border border-primary/20 cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  Template.csv
                </button>
              </div>

              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer ${
                  dragActive
                    ? "border-primary bg-primary/5"
                    : file
                    ? "border-slate-200 bg-slate-50/50 hover:bg-slate-50"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  accept=".csv"
                  className="hidden"
                />

                <div className="p-3 bg-slate-100 rounded-full text-slate-500">
                  <Upload className="h-6 w-6" />
                </div>

                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-700">
                    {file ? file.name : "Drag & drop your file here, or browse"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Supports CSV (max 5MB)
                  </p>
                </div>

                {file && (
                  <span className="text-[11px] font-medium bg-slate-200 text-slate-600 px-2.5 py-0.5 rounded-full">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                )}
              </div>

              {validation.status !== "idle" && (
                <div
                  className={`p-3.5 rounded-xl border flex gap-3 text-left ${
                    validation.status === "error"
                      ? "bg-red-50 border-red-100 text-red-700"
                      : "bg-emerald-50 border-emerald-100 text-emerald-700"
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {validation.status === "error" ? (
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider">
                      {validation.status === "error" ? "Validation Error" : "Validation Alert"}
                    </p>
                    <p className="text-xs leading-relaxed font-medium">
                      {validation.message}
                    </p>
                    {validation.detectedHeaders && (
                      <div className="mt-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                          Detected Columns:
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1 max-h-16 overflow-y-auto">
                          {validation.detectedHeaders.map((header, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-2 py-0.5 bg-white border border-slate-200 text-slate-600 rounded font-medium"
                            >
                              {header}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="mt-4 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleClose}
                disabled={isPending}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-all cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImportSubmit}
                disabled={!file || validation.status === "error" || isPending}
                className="flex items-center gap-1.5 bg-primary hover:bg-[#0D3658] text-white px-4 py-2 text-xs font-bold rounded-lg transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Start Import"
                )}
              </button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
