"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { FileText, Download, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import UploadDocumentModal from "./AddDocument";

export interface PatientDocument {
  id: string | number;
  title: string;
  category: string;
  files: string | number;
  date: string;
  fileUrl?: string;
  procedures?: Array<{ name: string; price: number; quantity: number }>;
  totalAmount?: number;
  dentistName?: string;
}

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState("treatment");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewPlan, setPreviewPlan] = useState<PatientDocument | null>(null);

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
    if (activeTab === "treatment") {
      return doc.category?.toLowerCase() === "treatment";
    }
    return doc.category?.toLowerCase() !== "treatment";
  });

  return (
    <div className="animate-in fade-in duration-300">
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-text mb-8">
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
            className={`pb-4 font-medium transition-all relative cursor-pointer ${activeTab === "treatment" ? "text-[#113254]" : "text-[#9CA3AF]"
              }`}
          >
            Treatment Document
            {activeTab === "treatment" && (
              <div className="absolute bottom-0 left-0 w-full h-0.75 bg-[#113254] rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("my-docs")}
            className={`pb-4 font-medium transition-all relative cursor-pointer ${activeTab === "my-docs" ? "text-[#113254]" : "text-[#9CA3AF]"
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
                      <FileText className="w-5 h-5 text-sec-text" />
                    </div>
                    <div>
                      <h3 className="text-[17px] font-bold text-text">
                        {doc.title}
                      </h3>
                      <p className="text-sm font-medium text-[#9CA3AF] mt-0.5">
                        {doc.category}
                      </p>
                    </div>
                  </div>

                  {/* File Count - Desktop Middle */}
                  <div className="hidden md:flex flex-col items-center md:w-1/4">
                    <span className="text-[17px] font-bold text-text">
                      {doc.files}
                    </span>
                    <span className="text-xs font-medium text-[#9CA3AF]">
                      Files
                    </span>
                  </div>

                  {/* Date Section */}
                  <div className="flex flex-row md:flex-col justify-between md:items-center md:w-1/4">
                    <div className="flex flex-col md:items-center">
                      <span className="text-[15px] font-bold text-text">
                        {doc.date}
                      </span>
                      <span className="text-xs font-medium text-[#9CA3AF] mt-0.5">
                        Last updates
                      </span>
                    </div>
                    {/* Mobile-only Download or View */}
                    {doc.fileUrl && (
                      doc.procedures ? (
                        <button onClick={() => setPreviewPlan(doc)} className="md:hidden p-2 text-[#113254] cursor-pointer">
                          <Eye className="w-6 h-6" />
                        </button>
                      ) : (
                        <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="md:hidden p-2 text-[#113254]">
                          <Eye className="w-6 h-6" />
                        </a>
                      )
                    )}
                  </div>

                  {/* Desktop Download or View */}
                  <div className="hidden md:flex justify-end md:w-[15%] items-center gap-2">
                    {doc.fileUrl ? (
                      doc.procedures ? (
                        <button onClick={() => setPreviewPlan(doc)} className="p-2 text-[#113254] hover:bg-[#F3F4F6] rounded-full transition-colors cursor-pointer" title="View Treatment Plan">
                          <Eye className="w-6 h-6" />
                        </button>
                      ) : (
                        <>
                          <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-[#113254] hover:bg-[#F3F4F6] rounded-full transition-colors" title="View Document">
                            <Eye className="w-6 h-6" />
                          </a>
                          <a href={doc.fileUrl} download className="p-2 text-[#113254] hover:bg-[#F3F4F6] rounded-full transition-colors" title="Download Document">
                            <Download className="w-6 h-6" />
                          </a>
                        </>
                      )
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

      {/* Treatment Plan Preview Modal */}
      {previewPlan && (
        <Dialog open={!!previewPlan} onOpenChange={() => setPreviewPlan(null)}>
          <DialogContent className="sm:max-w-xl p-0 overflow-hidden border-none gap-0 rounded-3xl bg-white">
            <DialogHeader className="p-6 border-b border-slate-100 flex flex-row items-center justify-between space-y-0">
              <DialogTitle className="text-2xl font-bold text-text">
                Treatment Plan Preview
              </DialogTitle>
            </DialogHeader>
            <div className="p-6 space-y-6">
              <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Document Name</span>
                  <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Date</span>
                </div>
                <div className="flex justify-between items-center gap-4">
                  <span className="text-base font-bold text-text">{previewPlan.title}</span>
                  <span className="text-sm font-semibold text-slate-700 whitespace-nowrap">{previewPlan.date}</span>
                </div>
                {previewPlan.dentistName && (
                  <div className="pt-2 border-t border-slate-200/60 text-sm font-medium text-slate-600">
                    Shared by: <span className="font-bold text-[#113254]">{previewPlan.dentistName}</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h4 className="text-base font-bold text-text">Procedures Breakdown</h4>
                <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-4 py-3 text-xs font-semibold text-slate-500">Name</th>
                        <th className="px-4 py-3 text-xs font-semibold text-slate-500 text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewPlan.procedures?.map((proc, index) => (
                        <tr key={index} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-3.5 text-sm font-semibold text-slate-700">{proc.name}</td>
                          <td className="px-4 py-3.5 text-sm font-semibold text-slate-900 text-right">
                            ${proc.price.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="bg-slate-50 px-4 py-4 flex justify-between items-center border-t border-slate-100">
                    <span className="text-sm font-bold text-[#113254]">Total Amount</span>
                    <span className="text-lg font-black text-[#113254]">
                      ${previewPlan.totalAmount?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex gap-4">
              <Button
                onClick={() => setPreviewPlan(null)}
                className="flex-1 h-12 rounded-xl bg-[#113254] text-white hover:bg-[#0a2036] font-semibold cursor-pointer"
              >
                Close Preview
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
