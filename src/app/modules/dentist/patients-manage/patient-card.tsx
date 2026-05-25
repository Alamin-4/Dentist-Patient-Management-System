"use client";

import { useMemo, useState } from "react";
import { Calendar } from "lucide-react";
import PatientDetailsDrawer from "./patient-details-drawer";

/* ---------------------------------- Types --------------------------------- */

type TreatmentPlanStatus = "Awaiting response" | "Rejected" | "Not Sent";

interface MediaItem {
  id: string;
  label: string;
  imageSrc: string;
}

interface ScheduleInfo {
  date: string;
  slot: string;
}

interface DentalHistoryInfo {
  lastVisited: string;
  conditions: string;
  notes: string;
}

export interface PatientCardItem {
  id: string;
  name: string;
  email: string;
  avatarInitials: string;
  procedure: string;
  country: string;
  patientCode: string;
  appointmentDate: string;
  treatmentPlan: TreatmentPlanStatus;
  amount: string;
  travelingDates: string;
  approxBudget: string;
  schedule: ScheduleInfo;
  dentalHistory: DentalHistoryInfo;
  media: MediaItem[];
}

/* --------------------------------- Mock data ------------------------------ */

const FAKE_PATIENTS: PatientCardItem[] = [
  {
    id: "booking_demo_1",
    name: "Jacob Smith",
    email: "jacob.smith@sample.com",
    avatarInitials: "JS",
    procedure: "All-on-4 Full Arch",
    country: "United Kingdom",
    patientCode: "#RD-7429",
    appointmentDate: "June 15, 2026",
    treatmentPlan: "Awaiting response",
    amount: "$4,030",
    travelingDates: "12–24 Jan, 2024",
    approxBudget: "$1,254",
    schedule: { date: "Wed 24 Jan, 2024", slot: "09:00 PM" },
    dentalHistory: {
      lastVisited: "Wed 24 Jan, 2024",
      conditions: "Bone loss, Gum Disease",
      notes: "No notes added yet.",
    },
    media: [
      { id: "m-1", label: "Lower Arch", imageSrc: "/images/smile-1.png" },
      { id: "m-2", label: "Upper Arch", imageSrc: "/images/smile-2.png" },
      { id: "m-3", label: "Front View", imageSrc: "/images/smile-3.png" },
      { id: "m-4", label: "X-Ray", imageSrc: "/images/ai-smile-preview.png" },
    ],
  },
  {
    id: "booking_demo_2",
    name: "James Williams",
    email: "james.williams@sample.com",
    avatarInitials: "JW",
    procedure: "All-on-4 Full Arch",
    country: "United Kingdom",
    patientCode: "#RD-7430",
    appointmentDate: "June 15, 2026",
    treatmentPlan: "Awaiting response",
    amount: "$4,030",
    travelingDates: "12–24 Jan, 2024",
    approxBudget: "$1,254",
    schedule: { date: "Wed 24 Jan, 2024", slot: "09:00 PM" },
    dentalHistory: {
      lastVisited: "Wed 24 Jan, 2024",
      conditions: "Bone loss, Gum Disease",
      notes: "No notes added yet.",
    },
    media: [
      { id: "m-5", label: "Lower Arch", imageSrc: "/images/smile-1.png" },
      { id: "m-6", label: "Upper Arch", imageSrc: "/images/smile-2.png" },
      { id: "m-7", label: "Front View", imageSrc: "/images/smile-3.png" },
      { id: "m-8", label: "X-Ray", imageSrc: "/images/ai-smile-preview.png" },
    ],
  },
  {
    id: "booking_demo_3",
    name: "Emma Clarke",
    email: "emma.clarke@sample.com",
    avatarInitials: "EC",
    procedure: "All-on-4 Full Arch",
    country: "United Kingdom",
    patientCode: "#RD-7431",
    appointmentDate: "June 15, 2026",
    treatmentPlan: "Rejected",
    amount: "$4,030",
    travelingDates: "12–24 Jan, 2024",
    approxBudget: "$1,254",
    schedule: { date: "Wed 24 Jan, 2024", slot: "09:00 PM" },
    dentalHistory: {
      lastVisited: "Wed 24 Jan, 2024",
      conditions: "Bone loss, Gum Disease",
      notes: "No notes added yet.",
    },
    media: [
      { id: "m-9", label: "Lower Arch", imageSrc: "/images/smile-1.png" },
      { id: "m-10", label: "Upper Arch", imageSrc: "/images/smile-2.png" },
      { id: "m-11", label: "Front View", imageSrc: "/images/smile-3.png" },
      { id: "m-12", label: "X-Ray", imageSrc: "/images/ai-smile-preview.png" },
    ],
  },
  {
    id: "booking_demo_4",
    name: "Liam Brown",
    email: "liam.brown@sample.com",
    avatarInitials: "LB",
    procedure: "All-on-4 Full Arch",
    country: "United Kingdom",
    patientCode: "#RD-7432",
    appointmentDate: "June 15, 2026",
    treatmentPlan: "Not Sent",
    amount: "$4,030",
    travelingDates: "12–24 Jan, 2024",
    approxBudget: "$1,254",
    schedule: { date: "Wed 24 Jan, 2024", slot: "09:00 PM" },
    dentalHistory: {
      lastVisited: "Wed 24 Jan, 2024",
      conditions: "Bone loss, Gum Disease",
      notes: "No notes added yet.",
    },
    media: [
      { id: "m-13", label: "Lower Arch", imageSrc: "/images/smile-1.png" },
      { id: "m-14", label: "Upper Arch", imageSrc: "/images/smile-2.png" },
      { id: "m-15", label: "Front View", imageSrc: "/images/smile-3.png" },
      { id: "m-16", label: "X-Ray", imageSrc: "/images/ai-smile-preview.png" },
    ],
  },
];

/* -------------------------------- Helpers --------------------------------- */

function getTreatmentPlanClasses(status: TreatmentPlanStatus): string {
  if (status === "Rejected") {
    return "bg-rose-50 text-rose-600 ring-1 ring-inset ring-rose-100";
  }
  if (status === "Not Sent") {
    return "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200";
  }
  return "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-100";
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

/* ---------------------------- Patient List Card --------------------------- */

interface PatientCardProps {
  patient: PatientCardItem;
  onViewDetails: () => void;
}

function PatientCard({ patient, onViewDetails }: PatientCardProps) {
  return (
    <article className="group w-full rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all hover:border-slate-300 hover:shadow-md sm:p-5">
      <div className="flex flex-col gap-5 lg:grid lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,0.9fr)_auto] lg:items-center lg:gap-6">
        {/* Identity */}
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0F2745] to-[#163E5C] text-base font-semibold tracking-tight text-white sm:h-14 sm:w-14 sm:text-lg">
            {getInitials(patient.name)}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-semibold text-slate-900 sm:text-lg">
              {patient.name}
            </h3>
            <p className="truncate text-sm text-slate-500">
              {patient.procedure}
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-slate-500">
              <span aria-hidden="true">🇬🇧</span>
              <span className="truncate">{patient.country}</span>
              <span className="text-slate-300">·</span>
              <span className="font-mono text-slate-600">
                {patient.patientCode}
              </span>
            </p>
          </div>
        </div>

        {/* Appointment */}
        <div className="flex items-center gap-2 lg:block">
          <Calendar className="h-4 w-4 shrink-0 text-slate-400 lg:hidden" />
          <div className="min-w-0">
            <p className="text-xs font-medium tracking-wide text-slate-500 uppercase lg:normal-case lg:tracking-normal">
              Appointment
            </p>
            <p className="truncate text-sm font-medium text-slate-900 sm:text-base">
              {patient.appointmentDate}
            </p>
          </div>
        </div>

        {/* Treatment plan status */}
        <div>
          <p className="mb-1 text-xs font-medium tracking-wide text-slate-500 uppercase lg:normal-case lg:tracking-normal">
            Treatment Plan
          </p>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getTreatmentPlanClasses(
              patient.treatmentPlan,
            )}`}
          >
            {patient.treatmentPlan}
          </span>
        </div>

        {/* Amount */}
        <div className="flex items-baseline gap-2 lg:block">
          <p className="text-xs font-medium tracking-wide text-slate-500 uppercase lg:normal-case lg:tracking-normal">
            Amount
          </p>
          <p className="text-base font-semibold text-slate-900 sm:text-lg">
            {patient.amount}
          </p>
        </div>

        {/* Action */}
        <div className="lg:justify-self-end">
          <button
            type="button"
            onClick={onViewDetails}
            className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-[#0F4C81] bg-white px-5 text-sm font-medium text-[#0F4C81] transition-all hover:bg-[#0F4C81] hover:text-white focus-visible:ring-2 focus-visible:ring-[#0F4C81]/30 focus-visible:outline-none sm:w-auto"
          >
            View Details
          </button>
        </div>
      </div>
    </article>
  );
}

/* --------------------------------- Section -------------------------------- */

interface PatientCardsSectionProps {
  patients?: PatientCardItem[];
}

export default function PatientCardsSection({
  patients = FAKE_PATIENTS,
}: PatientCardsSectionProps) {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null,
  );

  const selectedPatient = useMemo(
    () => patients.find((p) => p.id === selectedPatientId) ?? null,
    [patients, selectedPatientId],
  );

  return (
    <section className="space-y-3 sm:space-y-4" aria-label="Patient bookings">
      {patients.map((patient) => (
        <PatientCard
          key={patient.id}
          patient={patient}
          onViewDetails={() => setSelectedPatientId(patient.id)}
        />
      ))}

      <PatientDetailsDrawer
        patient={selectedPatient}
        onClose={() => setSelectedPatientId(null)}
      />
    </section>
  );
}
