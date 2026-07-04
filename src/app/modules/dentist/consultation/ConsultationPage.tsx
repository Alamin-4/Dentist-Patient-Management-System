"use client";

import { useState } from "react";
import { TabType } from "./type";
import { ConsultationCard } from "./ConsultationCard";
import { ConsultationDetailsSidebar } from "./ConsultationDetailSidebar";
import CreateTreatmentPlanModal from "./TreatmentModal";
import CustomTabs from "../../shared/custom-tabs/custom-tabs";
import DashboardPageHeader from "../../shared/dashboard-page-header/dashboard-page-header";
import { useDentistConsultations, useUpdateConsultationStatus } from "@/hooks/consultation/useConsultation";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const tabs = [
  { id: "Upcoming", label: "Upcoming" },
  { id: "Active", label: "Active" },
  { id: "Treatment Estimate", label: "Treatment Estimate" },
];

const isToday = (dateString?: string | Date | null) => {
  if (!dateString) return false;
  const d = new Date(dateString);
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};

export default function ConsultationPage() {
  const router = useRouter();
  const { data: consultationsResponse, isLoading } = useDentistConsultations();
  const updateStatusMutation = useUpdateConsultationStatus();

  const [selectedConsultation, setSelectedConsultation] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTreatmentModalOpen, setIsTreatmentModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("Upcoming");

  const consultations = consultationsResponse?.data || [];

  const filteredConsultations = consultations.filter((item: any) => {
    if (activeTab === "Upcoming") {
      return (
        item.requestStatus === "PENDING" ||
        item.requestStatus === "ACCEPTED" ||
        (item.requestStatus === "SCHEDULED" && !isToday(item.scheduledDate))
      );
    }
    if (activeTab === "Active") {
      return (
        item.requestStatus === "ACTIVE" ||
        (item.requestStatus === "SCHEDULED" && isToday(item.scheduledDate))
      );
    }
    if (activeTab === "Treatment Estimate") {
      return item.requestStatus === "COMPLETED";
    }
    return false;
  });

  const handleMarkAsComplete = (item: any) => {
    updateStatusMutation.mutate(
      {
        id: item.id,
        payload: { requestStatus: "COMPLETED" },
      },
      {
        onSuccess: () => {
          toast.success("Consultation marked as completed.");
          // Open treatment plan modal for this consultation
          setSelectedConsultation(item);
          setIsTreatmentModalOpen(true);
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || "Failed to update consultation status.");
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        heading="Video Consultation Scheduling"
        subHeading="Review your consultation scheduling of the patients"
      />

      <CustomTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as TabType)}
        storageKey={tabs[0].id}
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#163E5C]"></div>
        </div>
      ) : filteredConsultations.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-100 rounded-lg shadow-sm">
          <p className="text-slate-500 font-medium">No consultations found in this category.</p>
        </div>
      ) : (
        /* Responsive Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
          {filteredConsultations.map((item: any) => (
            <ConsultationCard
              key={item.id}
              data={item}
              type={activeTab}
              onClick={() => {
                setSelectedConsultation(item);
                setIsSidebarOpen(true);
              }}
              onJoinMeeting={() => {
                router.push(`/consultation/${item.id}`);
              }}
              onMarkComplete={() => handleMarkAsComplete(item)}
              onAction={() => {
                setSelectedConsultation(item);
                setIsTreatmentModalOpen(true);
              }}
            />
          ))}
        </div>
      )}

      <ConsultationDetailsSidebar
        onClose={() => {
          setIsSidebarOpen(false);
          setSelectedConsultation(null);
        }}
        isOpen={isSidebarOpen}
        data={selectedConsultation}
      />

      <CreateTreatmentPlanModal
        onClose={() => {
          setIsTreatmentModalOpen(false);
          setSelectedConsultation(null);
        }}
        isOpen={isTreatmentModalOpen}
        consultation={selectedConsultation}
      />
    </div>
  );
}
