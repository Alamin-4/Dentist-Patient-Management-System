"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { FileText, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import UploadDocumentModal from "./AddDocument";

export interface PatientDocument {
  id: string | number;
  title: string;
  category: string;
  files: string | number;
  date: string;
  fileUrl?: string;
}

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState("treatment");
  const [showUploadModal, setShowUploadModal] = useState(false);

  const { data: documents = [], isLoading } = useQuery<PatientDocument[]>({
    queryKey: ["patient-documents"],
    queryFn: async () => {
      try {
        const response = await apiClient.patients.getDocuments();
        const apiData = response?.data || response;
        return Array.isArray(apiData) ? apiData : [];
      } catch (err) {
        console.warn("Patient Documents API route not found or ready:", err);
        return [];
      }
    },
  });

  const filteredDocuments = documents.filter((doc) => {
    // Both treatment documents and custom documents will render dynamically
    return true;
  });

  return (
    <div className="animate-in fade-in duration-300">
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#1A1A2E] mb-8">
            Document Vault
          </h1>
          {activeTab === "my-docs" && (
            <Button
              className="px-6 h-12 bg-[#113254] text-white cursor-pointer"
              onClick={() => setShowUploadModal(true)}
            >
              Add Document
            </Button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-12 border-b border-gray-200 mb-8 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("treatment")}
            className={`pb-4 font-medium transition-all relative cursor-pointer ${
              activeTab === "treatment" ? "text-[#113254]" : "text-[#9CA3AF]"
            }`}
          >
            Treatment Document
            {activeTab === "treatment" && (
              <div className="absolute bottom-0 left-0 w-full h-0.75 bg-[#113254] rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("my-docs")}
            className={`pb-4 font-medium transition-all relative cursor-pointer ${
              activeTab === "my-docs" ? "text-[#113254]" : "text-[#9CA3AF]"
            }`}
          >
            My Documents
            {activeTab === "my-docs" && (
              <div className="absolute bottom-0 left-0 w-full h-0.75 bg-[#113254] rounded-t-full" />
            )}
          </button>
        </div>

        {/* Document List */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#113254] animate-spin" />
            <p className="text-sm text-slate-500 mt-2">Loading documents...</p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-slate-200 rounded-2xl bg-white p-12">
            <FileText className="w-12 h-12 text-slate-300 mb-3" />
            <p className="text-base font-semibold text-slate-500">No documents found</p>
            <p className="text-xs text-slate-400 mt-1">
              {activeTab === "my-docs" 
                ? "Click 'Add Document' to upload your records." 
                : "No treatment documents have been shared by your dentist yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="bg-white p-5 md:p-6 rounded-lg border border-gray-100 hover:border-[#113254]/20 hover:shadow-md transition-all group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Info Section */}
                  <div className="flex items-center gap-5 md:w-1/3">
                    <div className="w-12 h-12 bg-[#F3F4F6] rounded-full flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-[#6B7280]" />
                    </div>
                    <div>
                      <h3 className="text-[17px] font-bold text-[#1A1A2E]">
                        {doc.title}
                      </h3>
                      <p className="text-sm font-medium text-[#9CA3AF] mt-0.5">
                        {doc.category}
                      </p>
                    </div>
                  </div>

                  {/* File Count - Desktop Middle */}
                  <div className="hidden md:flex flex-col items-center md:w-1/4">
                    <span className="text-[17px] font-bold text-[#1A1A2E]">
                      {doc.files}
                    </span>
                    <span className="text-xs font-medium text-[#9CA3AF]">
                      Files
                    </span>
                  </div>

                  {/* Date Section */}
                  <div className="flex flex-row md:flex-col justify-between md:items-center md:w-1/4">
                    <div className="flex flex-col md:items-center">
                      <span className="text-[15px] font-bold text-[#1A1A2E]">
                        {doc.date}
                      </span>
                      <span className="text-xs font-medium text-[#9CA3AF] mt-0.5">
                        Last updates
                      </span>
                    </div>
                    {/* Mobile-only Download */}
                    {doc.fileUrl && (
                      <a href={doc.fileUrl} download className="md:hidden p-2 text-[#113254]">
                        <Download className="w-6 h-6" />
                      </a>
                    )}
                  </div>

                  {/* Desktop Download */}
                  <div className="hidden md:flex justify-end md:w-[10%]">
                    {doc.fileUrl ? (
                      <a href={doc.fileUrl} download className="p-2 text-[#113254] hover:bg-[#F3F4F6] rounded-full transition-colors">
                        <Download className="w-6 h-6" />
                      </a>
                    ) : (
                      <button className="p-2 text-slate-300 cursor-not-allowed">
                        <Download className="w-6 h-6" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <UploadDocumentModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
      />
    </div>
  );
}
