"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarCheck, DollarSign, FileText, Video } from "lucide-react";
import Link from "next/link";
import { StatCard } from "@/app/(dashboard)/patient/_components/Module/Overview/StatsCard";
import { ConsultationCard } from "@/app/(dashboard)/patient/_components/Module/Overview/ConsultationCard";
import { RescheduleConsultationModal } from "@/app/(dashboard)/patient/_components/Module/Overview/RescheduleConsultationModal";
import DoctorCard from "@/app/(dashboard)/patient/_components/Module/MyBooking/Card";
import { usePatientConsultations } from "@/hooks/consultation/useConsultation";
import { usePatientTreatmentPlans } from "@/hooks/treatment-plan/useTreatmentPlan";
import { ConsultationItem, TreatmentPlanItem } from "@/types";
import { ConsultationCardSkeleton } from "@/app/(dashboard)/patient/_components/Module/Overview/ConsultationCardSkeleton";
import { DoctorCardSkeleton } from "@/app/(dashboard)/patient/_components/Module/Overview/DoctorCardSkeleton";

// ─── Types ────────────────────────────────────────────────────────────────────

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

// Parse a timezone string like "GMT+6 Time Zone (BST, GMT+6)" into offset minutes
const parseTimezoneOffsetMinutes = (tzStr?: string | null): number => {
  if (!tzStr) return 0;
  const regex = /(?:UTC|GMT)\s*([+-])\s*(\d+)(?::(\d+))?/;
  const match = tzStr.match(regex);
  if (match) {
    const sign = match[1] === "-" ? -1 : 1;
    const hours = parseInt(match[2], 10);
    const minutes = match[3] ? parseInt(match[3], 10) : 0;
    return sign * (hours * 60 + minutes);
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

// Returns true if current moment is within the meeting window:
// from 5 minutes before scheduledDate until (scheduledDate + durationMinutes)
const isWithinMeetingWindow = (consultation: ConsultationItem): boolean => {
  if (!consultation.scheduledDate) return false;
  const scheduledUtc = new Date(consultation.scheduledDate).getTime();
  const duration = (consultation.durationMinutes || 15) * 60 * 1000;
  const earlyMs = 5 * 60 * 1000;
  const nowUtc = Date.now();
  return nowUtc >= scheduledUtc - earlyMs && nowUtc <= scheduledUtc + duration;
};

// Returns true if the scheduled date (in the consultation's stored timezone) is today
const isToday = (consultation: ConsultationItem): boolean => {
  if (!consultation.scheduledDate) return false;
  const offsetMinutes = parseTimezoneOffsetMinutes(consultation.timezone);
  const scheduledUtc = new Date(consultation.scheduledDate).getTime();
  // Shift the UTC timestamp by the consultation timezone offset to get local time
  const localMs = scheduledUtc + offsetMinutes * 60 * 1000;
  const localDate = new Date(localMs);
  const scheduledLocalDateStr = `${localDate.getUTCFullYear()}-${String(localDate.getUTCMonth() + 1).padStart(2, "0")}-${String(localDate.getUTCDate()).padStart(2, "0")}`;

  // Get today in the same timezone
  const nowUtc = Date.now();
  const nowLocal = new Date(nowUtc + offsetMinutes * 60 * 1000);
  const todayStr = `${nowLocal.getUTCFullYear()}-${String(nowLocal.getUTCMonth() + 1).padStart(2, "0")}-${String(nowLocal.getUTCDate()).padStart(2, "0")}`;

  return scheduledLocalDateStr === todayStr;
};

// ─── Empty state UI ───────────────────────────────────────────────────────────

function EmptySlate({ tab }: { tab: Tab }) {
  const { title, body } = EMPTY_STATE[tab];
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="size-14 rounded-lg bg-[#113254] flex items-center justify-center mb-5">
        <Video className="size-7 text-white" />
      </div>
      <p className="text-[17px] font-bold text-[#1A1A2E] mb-2">{title}</p>
      <p className="text-[14px] text-[#6B7280] max-w-xs leading-relaxed mb-6">{body}</p>
      <Link
        href="/find-dentists"
        className="px-6 py-3 bg-[#113254] hover:bg-[#0d2844] text-white font-semibold text-[14px] rounded-lg transition-all active:scale-95 cursor-pointer"
      >
        Find a dentist
      </Link>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Overview() {
  const router = useRouter();
  const { data: consultationsResponse, isLoading: loadingConsultations } = usePatientConsultations();
  const { data: treatmentPlansResponse, isLoading: loadingPlans } = usePatientTreatmentPlans();

  const [activeTab, setActiveTab] = useState<Tab>("upcoming");
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<ConsultationItem | null>(null);

  const consultations: ConsultationItem[] = consultationsResponse?.data || [];
  const treatmentPlans: TreatmentPlanItem[] = treatmentPlansResponse?.data || [];
  const proposedTreatmentPlans = treatmentPlans.filter((plan) => plan.status === "PROPOSED");

  const consultationsToShow = consultations.filter((item) => {
    if (activeTab === "upcoming") {
      return (
        item.requestStatus === "PENDING" ||
        item.requestStatus === "ACCEPTED" ||
        // SCHEDULED and NOT today in its own timezone AND not within the live window
        (item.requestStatus === "SCHEDULED" && !isToday(item) && !isWithinMeetingWindow(item))
      );
    }
    if (activeTab === "active") {
      return (
        item.requestStatus === "ACTIVE" ||
        item.requestStatus === "MISSED" ||
        // SCHEDULED and either today in its timezone OR within the live join window
        (item.requestStatus === "SCHEDULED" && (isToday(item) || isWithinMeetingWindow(item)))
      );
    }
    return false;
  });

  const openReschedule = (consultation: ConsultationItem) => {
    setSelectedConsultation(consultation);
    setRescheduleOpen(true);
  };

  // Calculate dynamic stats
  const escrowTotal = treatmentPlans
    ?.filter((tp) => tp.status === "ACTIVE" || tp.status === "COMPLETED")
    ?.reduce((acc: number, tp) => {
      const tpTotal = tp.lineItems?.reduce((sum: number, li) => sum + Number(li.unitPrice), 0) || 0;
      return acc + tpTotal;
    }, 0) || 0;

  const bookingsCompletedCount = consultations?.filter((c) => c.requestStatus === "COMPLETED")?.length || 0;
  const documentsCount = consultations?.length + treatmentPlans?.length;

  // Stats need both to be ready; consultation list only needs consultations
  const isStatsLoading = loadingConsultations || loadingPlans;
  const isConsultationsLoading = loadingConsultations;

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1A1A2E] mb-8">Overview</h1>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

      {/* Consultation section */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100">
        <h2 className="text-xl font-bold text-[#1A1A2E] mb-4">Consultation</h2>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-gray-100 mb-6">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`pb-3 text-[15px] font-semibold transition-colors border-b-2 -mb-px cursor-pointer ${activeTab === key
                ? "text-[#113254] border-[#113254]"
                : "text-[#9CA3AF] border-transparent hover:text-[#6B7280]"
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
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
        ) : activeTab === "estimate-updates" ? (
          proposedTreatmentPlans.length ? (
            <div className="space-y-5 animate-fade-in">
              {proposedTreatmentPlans.map((plan) => (
                <DoctorCard key={plan.id} data={plan} />
              ))}
            </div>
          ) : (
            <EmptySlate tab={activeTab} />
          )
        ) : consultationsToShow.length ? (
          <div className="space-y-5 animate-fade-in">
            {consultationsToShow.map((consultation) => (
              <ConsultationCard
                key={consultation.id}
                consultation={consultation}
                onPrimaryAction={() => {
                  if (consultation.requestStatus === "MISSED" || consultation.requestStatus === "ACCEPTED") {
                    openReschedule(consultation);
                    return;
                  }

                  if (
                    (consultation.requestStatus === "SCHEDULED" || consultation.requestStatus === "ACTIVE") &&
                    !isWithinMeetingWindow(consultation)
                  ) {
                    router.push(`/consultation/${consultation.id}?mode=details`);
                    return;
                  }
                  // Within 5-min early buffer or during meeting → go to meeting page (lobby or room)
                  router.push(`/consultation/${consultation.id}`);
                }}
              />
            ))}
          </div>
        ) : (
          <EmptySlate tab={activeTab} />
        )}
      </div>

      {selectedConsultation ? (
        <RescheduleConsultationModal
          open={rescheduleOpen}
          onClose={() => setRescheduleOpen(false)}
          consultation={selectedConsultation}
          onConfirmed={() => setActiveTab("active")}
          onAddToCalendar={() => router.push(`/consultation/${selectedConsultation.id}`)}
        />
      ) : null}
    </div>
  );
}
