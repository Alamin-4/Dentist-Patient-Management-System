"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import ToggleButton from "@/app/(dashboard)/patient/_components/Module/MyBooking/ToggleButton/ToggleButton";
import {
  consultationFlowData,
  type ConsultationFlowItem,
  treatmentPlansData,
} from "./data";
import { ConsultationCard } from "@/app/(dashboard)/patient/_components/Module/Overview/ConsultationCard";
import { RescheduleConsultationModal } from "@/app/(dashboard)/patient/_components/Module/Overview/RescheduleConsultationModal";

export default function MyBooking() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("consultations");
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<ConsultationFlowItem | null>(null);

  const tabs = [
    { key: "consultations", label: "Consultations" },
    { key: "estimate-updates", label: "Estimate Updates" },
    { key: "treatment", label: "Treatment" },
  ];

  const consultationTabs = useMemo(
    () => consultationFlowData.filter((item) => item.status !== "completed"),
    [],
  );

  const treatmentCards = useMemo(
    () => treatmentPlansData.filter((plan) => plan.payment_status !== "refunded"),
    [],
  );

  const openReschedule = (consultation: ConsultationFlowItem) => {
    setSelectedConsultation(consultation);
    setRescheduleOpen(true);
  };

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-2xl lg:text-3xl text-[#1A1A2E] font-bold">
            Consultations
          </p>
          <p className="mt-1 text-[14px] text-[#6B7280]">
            Track your upcoming appointments, estimate changes, and treatment progress.
          </p>
        </div>
        <div className="rounded-full bg-[#F8FAFC] px-4 py-2 text-[12px] font-semibold text-[#113254]">
          Demo mode with seeded bookings
        </div>
      </div>

      <div className="mt-4">
        <ToggleButton value={activeTab} onChange={setActiveTab} tabs={tabs} />
      </div>

      {activeTab === "consultations" ? (
        <div className="py-5 space-y-4">
          {consultationTabs.map((consultation) => (
            <ConsultationCard
              key={consultation.id}
              consultation={consultation}
              onPrimaryAction={() => {
                if (consultation.status === "missed") {
                  openReschedule(consultation);
                  return;
                }

                router.push(`/consultation/${consultation.slug}`);
              }}
            />
          ))}
        </div>
      ) : null}

      {activeTab === "estimate-updates" ? (
        <div className="py-6">
          <div className="rounded-3xl border border-[#CEE0F4] bg-white p-6 md:p-8">
            <h3 className="text-[18px] font-bold text-[#1A1A2E]">Estimate updates</h3>
            <p className="mt-2 max-w-2xl text-[14px] leading-7 text-[#6B7280]">
              Your latest estimate is ready. Open the consultation summary to review the budget, time window, and next steps with your dentist.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {consultationFlowData.slice(0, 2).map((consultation) => (
                <ConsultationCard
                  key={consultation.id}
                  consultation={consultation}
                  onPrimaryAction={() => router.push(`/consultation/${consultation.slug}`)}
                />
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {activeTab === "treatment" ? (
        <div className="py-6 space-y-4">
          {treatmentCards.map((plan) => (
            <div key={plan.id} className="rounded-3xl border border-[#CEE0F4] bg-white p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[#9CA3AF]">
                    Treatment plan
                  </p>
                  <h3 className="mt-1 text-[18px] font-bold text-[#1A1A2E]">
                    {plan.procedure.name}
                  </h3>
                  <p className="mt-1 text-[14px] text-[#6B7280]">
                    {plan.doctor.name} · {plan.doctor.specialty}
                  </p>
                </div>

                <div className="text-left md:text-right">
                  <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[#9CA3AF]">
                    Estimate
                  </p>
                  <p className="mt-1 text-[18px] font-bold text-[#113254]">
                    ${plan.procedure.totalEstimate.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {selectedConsultation ? (
        <RescheduleConsultationModal
          open={rescheduleOpen}
          onClose={() => setRescheduleOpen(false)}
          consultation={selectedConsultation}
          onConfirmed={() => setActiveTab("consultations")}
          onAddToCalendar={() => router.push(`/consultation/${selectedConsultation.slug}`)}
        />
      ) : null}
    </div>
  );
}
