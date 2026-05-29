"use client";
import { useState } from "react";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import UploadDocumentModal from "./AddDocument";

const documents = [
  {
    id: 1,
    title: "X-Rays & Scans",
    category: "Implants Treatment",
    files: "03",
    date: "April 14, 2026",
  },
  {
    id: 2,
    title: "Ultrasound",
    category: "Pregnancy Monitoring",
    files: "04",
    date: "February 28, 2026",
  },
  {
    id: 3,
    title: "ECG Reports",
    category: "Cardiology",
    files: "06",
    date: "April 10, 2026",
  },
  {
    id: 4,
    title: "MRI Results",
    category: "Neurological Exam",
    files: "05",
    date: "May 3, 2026",
  },
  {
    id: 5,
    title: "Pathology Slides",
    category: "Biopsy Analysis",
    files: "02",
    date: "January 15, 2026",
  },
  {
    id: 6,
    title: "Blood Tests",
    category: "Routine Checkup",
    files: "07",
    date: "March 22, 2026",
  },
  {
    id: 7,
    title: "CT Scans",
    category: "Trauma Assessment",
    files: "08",
    date: "March 30, 2026",
  },
];

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState("treatment");
  const [showUploadModal, setShowUploadModal] = useState(false);

  return (
    <div className="">
      <div className="">
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
            className={`pb-4 font-medium transition-all relative ${
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
            className={`pb-4 font-medium transition-all relative ${
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
        <div className="space-y-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-white p-5 md:p-6 rounded-xl border border-gray-100 hover:border-[#113254]/20 hover:shadow-md transition-all group"
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
                  <button className="md:hidden p-2 text-[#113254]">
                    <Download className="w-6 h-6" />
                  </button>
                </div>

                {/* Desktop Download */}
                <div className="hidden md:flex justify-end md:w-[10%]">
                  <button className="p-2 text-[#113254] hover:bg-[#F3F4F6] rounded-full transition-colors">
                    <Download className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <UploadDocumentModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
      />
    </div>
  );
}
