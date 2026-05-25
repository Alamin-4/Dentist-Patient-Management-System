"use client";

import { useState } from "react";
import { dummyData, TabType } from "./type";
import { ConsultationCard } from "./ConsultationCard";
import { ConsultationDetailsSidebar } from "./ConsultationDetailSidebar";
import CreateTreatmentPlanModal from "./TreatmentModal";
import CustomTabs from "../../shared/custom-tabs/custom-tabs";
import { useStateContext } from "@/providers/StateProvider";
import DashboardPageHeader from "../../shared/dashboard-page-header/dashboard-page-header";

const tabs = [
  { id: "Upcoming", label: "Upcoming" },
  { id: "Active", label: "Active" },
  { id: "Treatment Estimate", label: "Treatment Estimate" },
];

export default function ConsultationPage() {
  const [selectedConsultation, setSelectedConsultation] = useState<
    string | null
  >(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTreatmentModalOpen, setIsTreatmentModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("Upcoming");

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        heading="Video Consultation Scheduling"
        subHeading="Review your consultation scheduling of the patinets"
      />

      <CustomTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as TabType)}
      />

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
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
