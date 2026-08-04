"use client";

import { useState, useCallback, useEffect } from "react";
import { TabType } from "./type";
import { ConsultationCard } from "./ConsultationCard";
import { ConsultationDetailsSidebar } from "./ConsultationDetailSidebar";
import CreateTreatmentPlanModal from "./TreatmentModal";
import { RescheduleConsultationModal } from "@/features/patient/Overview/RescheduleConsultationModal";
import CustomTabs from "../../shared/custom-tabs/custom-tabs";
import DashboardPageHeader from "../../shared/dashboard-page-header/dashboard-page-header";
import { useDentistConsultations, useUpdateConsultationStatus } from "@/hooks/consultation/useConsultation";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

const tabs = [
  { id: "Upcoming", label: "Upcoming" },
  { id: "Active", label: "Active" },
  { id: "Treatment Estimate", label: "Treatment Estimate" },
];

// Parse timezone string like "GMT+6 Time Zone (BST, GMT+6)" → offset in minutes
const parseTimezoneOffsetMinutes = (tzStr?: string | null): number => {
  if (!tzStr) return 0;
  const regex = /(?:UTC|GMT)\s*([+-])\s*(\d+)(?::(\d+))?/;
  const match = tzStr.match(regex);
  if (match) {
    const sign = match[1] === "-" ? -1 : 1;
    const hours = parseInt(match[2], 10);
    const mins = match[3] ? parseInt(match[3], 10) : 0;
    return sign * (hours * 60 + mins);
  }
  if (tzStr.includes("EST")) return -5 * 60;
  if (tzStr.includes("CST")) return -6 * 60;
  if (tzStr.includes("MST")) return -7 * 60;
  if (tzStr.includes("PST")) return -8 * 60;
  if (tzStr.includes("CET")) return 1 * 60;
  if (tzStr.includes("AEST")) return 10 * 60;
  if (tzStr.includes("BST")) return 6 * 60;
  return 0;
};

const getConsultationStartUtcMs = (scheduledDate: string | Date, scheduledTime: string, timezoneStr?: string | null): number => {
  const dObj = new Date(scheduledDate);
  const year = dObj.getUTCFullYear();
  const month = dObj.getUTCMonth();
  const day = dObj.getUTCDate();

  const timeParts = scheduledTime.split(":");
  let hours = parseInt(timeParts[0], 10);
  let minutes = timeParts[1] ? parseInt(timeParts[1], 10) : 0;

  if (scheduledTime.toUpperCase().includes("PM") && hours < 12) {
    hours += 12;
  } else if (scheduledTime.toUpperCase().includes("AM") && hours === 12) {
    hours = 0;
  }

  if (isNaN(hours)) hours = 0;
  if (isNaN(minutes)) minutes = 0;

  const localUtcMs = Date.UTC(year, month, day, hours, minutes, 0, 0);
  const offsetMinutes = parseTimezoneOffsetMinutes(timezoneStr);
  return localUtcMs - offsetMinutes * 60 * 1000;
};

// True if now is within the 5-min-early → end-of-duration join window
const isWithinMeetingWindow = (item: any): boolean => {
  if (!item?.scheduledDate || !item?.scheduledTime) return false;
  const startUtcMs = getConsultationStartUtcMs(item.scheduledDate, item.scheduledTime, item.timezone);
  const duration = (item.durationMinutes || 15) * 60 * 1000;
  const earlyMs = 5 * 60 * 1000;
  const nowUtc = Date.now();
  return nowUtc >= startUtcMs - earlyMs && nowUtc <= startUtcMs + duration;
};

const isPast = (item: any): boolean => {
  if (!item?.scheduledDate || !item?.scheduledTime) return false;
  const startUtcMs = getConsultationStartUtcMs(item.scheduledDate, item.scheduledTime, item.timezone);
  const duration = (item.durationMinutes || 15) * 60 * 1000;
  const nowUtc = Date.now();
  return nowUtc > startUtcMs + duration;
};

export default function ConsultationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: consultationsResponse, isLoading } = useDentistConsultations();
  const updateStatusMutation = useUpdateConsultationStatus();

  const [selectedConsultation, setSelectedConsultation] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTreatmentModalOpen, setIsTreatmentModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);

  const queryTab = searchParams ? searchParams.get("tab") : null;
  const [activeTab, setActiveTab] = useState<TabType>((queryTab as TabType) || "Upcoming");

  const handleTabChange = useCallback((id: string) => {
    setActiveTab(id as TabType);
  }, []);

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

    if (activeTab === "Upcoming") {
      return (
        item.requestStatus === "PENDING" ||
        item.requestStatus === "ACCEPTED" ||
        (item.requestStatus === "SCHEDULED" && !isPast(item) && !isWithinMeetingWindow(item))
      );
    }
    if (activeTab === "Active") {
      return (
        item.requestStatus === "ACTIVE" ||
        item.requestStatus === "MISSED" ||
        (item.requestStatus === "SCHEDULED" && isWithinMeetingWindow(item)) ||
        ((item.requestStatus === "SCHEDULED" || item.requestStatus === "ACTIVE") && isPast(item))
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

      <CustomTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        storageKey="dentist-consultation-active-tab"
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
              onJoinMeeting={() => {
                if (!isWithinMeetingWindow(item)) {
                  router.push(`/consultation/${item.id}?mode=details`);
                  return;
                }
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
