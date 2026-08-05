"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarCheck, DollarSign, FileText, Video } from "lucide-react";
import Link from "next/link";
import { StatCard } from "@/app/modules/patient/Overview/StatsCard";
import { ConsultationCard } from "@/app/modules/patient/Overview/ConsultationCard";
import { RescheduleConsultationModal } from "@/app/modules/patient/Overview/RescheduleConsultationModal";
import DoctorCard from "@/app/modules/patient/MyBooking/Card";
import { ConsultationDetailsModal } from "@/app/modules/patient/Overview/ConsultationDetailsModal";
import { usePatientConsultations } from "@/hooks/consultation/useConsultation";
import { usePatientTreatmentPlans } from "@/hooks/treatment-plan/useTreatmentPlan";
import { ConsultationItem, TreatmentPlanItem } from "@/types";
import { ConsultationCardSkeleton } from "@/app/modules/patient/Overview/ConsultationCardSkeleton";
import { DoctorCardSkeleton } from "@/app/modules/patient/Overview/DoctorCardSkeleton";
import { PageContainer } from "@/components/shared/page-container";
import { HeadingGroup } from "@/components/shared/heading-group";
import { SectionCard } from "@/components/shared/section-card";
import {
  resolveConsultationTab,
  type ConsultationDisplayState,
} from "@/lib/consultation-state";


type Tab = "upcoming" | "active" | "estimate-updates";

const TABS: { key: Tab; label: string }[] = [
  { key: "upcoming", label: "Upcoming" },
  { key: "active", label: "Active" },
  { key: "estimate-updates", label: "Estimate Updates" },
];

const EMPTY_STATE: Record<Tab, { title: string; body: string }> = {
  upcoming: {
    title: "No Upcoming Consultations",
    body: "You don't have any upcoming consultations. Once you book a consultation, it will appear here.",
  },
  active: {
    title: "No Active Consultations",
    body: "You don't have any active consultations right now.",
  },
  "estimate-updates": {
    title: "No Estimate Updates",
    body: "You don't have any estimate updates at the moment.",
  },
};


function EmptySlate({ tab }: { tab: Tab }) {
  const { title, body } = EMPTY_STATE[tab];
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="size-14 rounded-lg bg-brand-deep-navy flex items-center justify-center mb-5">
        <Video className="size-7 text-white" />
      </div>
      <p className="text-[17px] font-bold text-text mb-2">{title}</p>
      <p className="text-[14px] text-sec-text max-w-xs leading-relaxed mb-6">{body}</p>
      <Link
        href="/find-dentists"
        className="px-6 py-3 bg-brand-deep-navy hover:bg-brand-deep-navy-hover text-white font-semibold text-[14px] rounded-lg transition-all active:scale-95 cursor-pointer"
      >
        Find a dentist
      </Link>
    </div>
  );
}

export default function Overview() {
  const router = useRouter();
  const { data: consultationsResponse, isLoading: loadingConsultations } = usePatientConsultations();
  const { data: treatmentPlansResponse, isLoading: loadingPlans } = usePatientTreatmentPlans();

  const [activeTab, setActiveTab] = useState<Tab>("upcoming");
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<ConsultationItem | null>(null);

  const consultations: ConsultationItem[] = consultationsResponse?.data || [];
  const treatmentPlans: TreatmentPlanItem[] = treatmentPlansResponse?.data || [];
  const proposedTreatmentPlans = treatmentPlans.filter((plan) => plan.status === "PROPOSED");

  const rawConsultations = consultations.filter((item) => {
    if (item.treatmentPlan?.treatmentBooking) return false;
    if (item.requestStatus?.toUpperCase() === "CANCELLED") return false;
    return resolveConsultationTab(item, Date.now()) === activeTab;
  });

  const consultationsToShow = activeTab === "estimate-updates"
    ? (() => {
        const withoutPlan = rawConsultations.filter((item) => !item.treatmentPlan);
        const seenDentists = new Set<string>();
        const sorted = [...withoutPlan].sort((a, b) => {
          const dateA = a.scheduledDate ? new Date(a.scheduledDate).getTime() : 0;
          const dateB = b.scheduledDate ? new Date(b.scheduledDate).getTime() : 0;
          return dateB - dateA;
        });
        const unique: ConsultationItem[] = [];
        for (const item of sorted) {
          const dentistKey = item.dentistId || item.directoryEntryId;
          if (dentistKey) {
            if (!seenDentists.has(dentistKey)) {
              seenDentists.add(dentistKey);
              unique.push(item);
            }
          } else {
            unique.push(item);
          }
        }
        return unique;
      })()
    : rawConsultations;

  const openReschedule = (consultation: ConsultationItem) => {
    setSelectedConsultation(consultation);
    setRescheduleOpen(true);
  };

  const escrowTotal = treatmentPlans
    ?.filter((tp) => tp.status === "ACTIVE" || tp.status === "COMPLETED")
    ?.reduce((acc: number, tp) => {
      const tpTotal = tp.lineItems?.reduce((sum: number, li) => sum + Number(li.unitPrice), 0) || 0;
      return acc + tpTotal;
    }, 0) || 0;

  const bookingsCompletedCount = consultations?.filter((c) => c.requestStatus === "COMPLETED")?.length || 0;
  const documentsCount = consultations?.length + treatmentPlans?.length;

  const isStatsLoading = loadingConsultations || loadingPlans;
  const isConsultationsLoading = loadingConsultations;

  const hasContent = activeTab === "estimate-updates"
    ? Boolean(consultationsToShow.length || proposedTreatmentPlans.length)
    : Boolean(consultationsToShow.length);

  return (
    <PageContainer className="space-y-6">
      <HeadingGroup title="Overview" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<DollarSign className="w-5 h-5" />}
          value={`$${escrowTotal.toLocaleString()}`}
          label="Amount in escrow"
          isLoading={isStatsLoading}
        />
        <StatCard
          icon={<CalendarCheck className="w-5 h-5" />}
          value={String(bookingsCompletedCount).padStart(2, "0")}
          label="Booking Completed"
          isLoading={isStatsLoading}
        />
        <StatCard
          icon={<FileText className="w-5 h-5" />}
          value={String(documentsCount).padStart(2, "0")}
          label="Documents stored"
          isLoading={isStatsLoading}
        />
      </div>

      <SectionCard className="md:p-8">
        <h2 className="text-xl font-bold text-text mb-4">Consultation</h2>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-gray-100 mb-6">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`pb-3 text-[15px] font-semibold transition-colors border-b-2 -mb-px cursor-pointer ${activeTab === key
                ? "text-brand-deep-navy border-brand-deep-navy"
                : "text-[#9CA3AF] border-transparent hover:text-sec-text"
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        {isConsultationsLoading ? (
          <div className="space-y-5">
            {activeTab === "estimate-updates" ? (
              <>
                <DoctorCardSkeleton />
                <DoctorCardSkeleton />
              </>
            ) : (
              <>
                <ConsultationCardSkeleton />
                <ConsultationCardSkeleton />
              </>
            )}
          </div>
        ) : hasContent ? (
          <div className="space-y-5 animate-fade-in">
            {consultationsToShow.map((consultation) => {
              const completedCount = consultations.filter(
                (c) =>
                  c.requestStatus === "COMPLETED" &&
                  (c.dentistId === consultation.dentistId || c.directoryEntryId === consultation.directoryEntryId)
              ).length;
              return (
                <ConsultationCard
                  key={consultation.id}
                  consultation={consultation}
                  completedCount={completedCount}
                  onPrimaryAction={(state: ConsultationDisplayState) => {
                    switch (state) {
                      case "reschedule-missed":
                      case "reschedule-expired":
                        openReschedule(consultation);
                        break;
                      case "schedule-slot":
                        openReschedule(consultation);
                        break;
                      case "view-details":
                        setSelectedConsultation(consultation);
                        setDetailsOpen(true);
                        break;
                      case "join":
                        router.push(`/consultation/${consultation.id}`);
                        break;
                      case "completed":
                        openReschedule(consultation);
                        break;
                      case "awaiting-approval":
                        break;
                    }
                  }}
                />
              );
            })}
            {activeTab === "estimate-updates" &&
              proposedTreatmentPlans.map((plan) => (
                <DoctorCard key={plan.id} data={plan} />
              ))}
          </div>
        ) : (
          <EmptySlate tab={activeTab} />
        )}
      </SectionCard>

      {selectedConsultation ? (
        <RescheduleConsultationModal
          open={rescheduleOpen}
          onClose={() => setRescheduleOpen(false)}
          consultation={selectedConsultation}
          onConfirmed={() => setActiveTab("active")}
          onAddToCalendar={() => router.push(`/consultation/${selectedConsultation.id}`)}
        />
      ) : null}

      {selectedConsultation ? (
        <ConsultationDetailsModal
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          consultation={selectedConsultation}
          onChatClick={() => {
            setDetailsOpen(false);
            router.push(`/patient/messages?chatId=${selectedConsultation.id}`);
          }}
        />
      ) : null}
    </PageContainer>
  );
}
