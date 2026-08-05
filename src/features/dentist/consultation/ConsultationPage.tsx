"use client";

import { useState, useCallback, useEffect } from "react";
import { TabType } from "./type";
import { ConsultationCard } from "./ConsultationCard";
import { ConsultationDetailsSidebar } from "./ConsultationDetailSidebar";
import CreateTreatmentPlanModal from "./TreatmentModal";
import { RescheduleConsultationModal } from "@/features/patient/Overview/RescheduleConsultationModal";
import { Tabs, TabItem } from "@/components/ui/tabs/Tabs";
import { useUrlTab } from "@/components/ui/tabs/useUrlTab";
import { useTabPersistence } from "@/components/ui/tabs/useTabPersistence";
import DashboardPageHeader from "../../shared/dashboard-page-header/dashboard-page-header";
import { useDentistConsultations, useUpdateConsultationStatus } from "@/hooks/consultation/useConsultation";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  resolveConsultationTab,
  resolveConsultationState,
} from "@/lib/consultation-state";
import type { ConsultationItem } from "@/types";

const tabs: TabItem<TabType>[] = [
  { id: "Upcoming", label: "Upcoming" },
  { id: "Active", label: "Active" },
  { id: "Treatment Estimate", label: "Treatment Estimate" },
];

export default function ConsultationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: consultationsResponse, isLoading } = useDentistConsultations();
  const updateStatusMutation = useUpdateConsultationStatus();

  const [selectedConsultation, setSelectedConsultation] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTreatmentModalOpen, setIsTreatmentModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);

  const [activeTab, setActiveTab, isUrlParamPresent] = useUrlTab<TabType>(
    "tab",
    "Upcoming",
    tabs.map((t) => t.id as TabType)
  );

  useTabPersistence("dentist-consultation-active-tab", activeTab, setActiveTab, {
    validTabIds: tabs.map((t) => t.id as TabType),
    isUrlParamPresent,
  });

  const consultations = consultationsResponse?.data || [];

  const createPlanFor = searchParams ? searchParams.get("createPlanFor") : null;

  useEffect(() => {
    if (createPlanFor && consultations.length > 0) {
      const target = consultations.find((c: any) => c.id === createPlanFor);
      if (target) {
        setSelectedConsultation(target);
        setIsTreatmentModalOpen(true);
        // Clean URL parameter
        const newParams = new URLSearchParams(searchParams?.toString() || "");
        newParams.delete("createPlanFor");
        const query = newParams.toString();
        router.replace(query ? `/dentist/consultations?${query}` : `/dentist/consultations`);
      }
    }
  }, [createPlanFor, consultations, searchParams, router]);

  const filteredConsultations = consultations.filter((item: any) => {
    if (item.treatmentPlan?.treatmentBooking) {
      return false;
    }
    if (item.requestStatus?.toUpperCase() === "CANCELLED") {
      return false;
    }

    const tab = resolveConsultationTab(item as ConsultationItem, Date.now());
    if (activeTab === "Upcoming") return tab === "upcoming";
    if (activeTab === "Active") return tab === "active";
    if (activeTab === "Treatment Estimate") return tab === "estimate-updates";
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
          toast.error(err?.message || "Failed to update consultation status.");
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

      <Tabs
        tabs={tabs}
        value={activeTab}
        onChange={setActiveTab}
        ariaLabel="Consultation Tabs"
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
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mt-6">
          {filteredConsultations.map((item: any) => (
            <ConsultationCard
              key={item.id}
              data={item}
              type={activeTab}
              onClick={() => {
                setSelectedConsultation(item);
                setIsSidebarOpen(true);
              }}
              isMeetingActive={
                resolveConsultationState(item as ConsultationItem, Date.now()) === "join"
              }
              onJoinMeeting={() => {
                router.push(`/consultation/${item.id}`);
              }}
              onMarkComplete={() => handleMarkAsComplete(item)}
              onAction={() => {
                setSelectedConsultation(item);
                if (item.requestStatus === "MISSED") {
                  setIsRescheduleModalOpen(true);
                } else {
                  setIsTreatmentModalOpen(true);
                }
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
        onCreateTreatmentPlan={() => {
          setIsSidebarOpen(false);
          setIsTreatmentModalOpen(true);
        }}
      />

      <CreateTreatmentPlanModal
        onClose={() => {
          setIsTreatmentModalOpen(false);
          setSelectedConsultation(null);
        }}
        isOpen={isTreatmentModalOpen}
        consultation={selectedConsultation}
      />

      {selectedConsultation && (
        <RescheduleConsultationModal
          open={isRescheduleModalOpen}
          onClose={() => {
            setIsRescheduleModalOpen(false);
            setSelectedConsultation(null);
          }}
          consultation={selectedConsultation}
        />
      )}
    </div>
  );
}
