"use client";

import { useState } from "react";
import { dummyData, TabType } from "./type";
import { ConsultationCard } from "./ConsultationCard";
import { ConsultationDetailsSidebar } from "./ConsultationDetailSidebar";
import CreateTreatmentPlanModal from "./TreatmentModal";

const tabs: TabType[] = ["Requested", "Upcoming", "Completed"];

export default function ConsultationPage() {
  const [activeTab, setActiveTab] = useState<TabType>("Requested");
  const [selectedConsultation, setSelectedConsultation] = useState<
    string | null
  >(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTreatmentModalOpen, setIsTreatmentModalOpen] = useState(false);

  return (
    <div className="">
      {/* Page Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[#0A2533] mb-2">
          Video Consultation Scheduling
        </h1>
        <p className="text-slate-500 font-medium">
          Review your consultation scheduling of the patients
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-10 border-b border-slate-100 mb-10">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-base font-bold transition-all relative ${
              activeTab === tab
                ? "text-[#163E5C]"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-0.75 bg-[#163E5C] rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Render filtered data here */}
        {dummyData
          .filter((item) => item.status === activeTab)
          .map((item) => (
            <ConsultationCard
              key={item.id}
              data={item}
              type={activeTab}
              onClick={() => {
                setSelectedConsultation(item.id);
                setIsSidebarOpen(true);
              }}
              CreateTreatmentModalOpen={setIsTreatmentModalOpen}
              isTreatmentModalOpen={isTreatmentModalOpen}
            />
          ))}
      </div>

      <ConsultationDetailsSidebar
        onClose={() => {
          setIsSidebarOpen(false);
          setSelectedConsultation(null);
        }}
        isOpen={isSidebarOpen}
        data={
          selectedConsultation
            ? dummyData.find((item) => item.id === selectedConsultation)
            : null
        }
      />

      <CreateTreatmentPlanModal
        onClose={() => setIsTreatmentModalOpen(false)}
        isOpen={isTreatmentModalOpen}
      />
    </div>
  );
}
