"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import CustomTabs from "../../shared/custom-tabs/custom-tabs";
import DashboardPageHeader from "../../shared/dashboard-page-header/dashboard-page-header";
import SearchPatient from "./search-patient";
import PatientCardsSection, { PatientCardsSkeleton } from "./patient-card";
import PatientDetailsDrawer from "./patient-details-drawer";
import { splitPatientRecords, type PatientRecord } from "./patients-data";
import { useDentistPatients } from "@/hooks/dentist/useDentist";

interface PatientManageProps {
  patients?: PatientRecord[];
}

export default function PatientManage({ patients: patientsProp }: PatientManageProps) {
  const router = useRouter();
  const { data: apiResponse, isLoading, isError } = useDentistPatients();
  const patients: PatientRecord[] = patientsProp || (apiResponse?.data as PatientRecord[]) || [];

  const [activeTab, setActiveTab] = useState<"consultations" | "bookings">(
    "consultations",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProcedure, setSelectedProcedure] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(
    null,
  );

  const { consultations, bookings } = useMemo(
    () => splitPatientRecords(patients),
    [patients],
  );

  const procedureOptions = useMemo(
    () => Array.from(new Set(patients.map((patient) => patient.procedure))),
    [patients],
  );

  const statusOptions = useMemo(
    () => Array.from(new Set(patients.map((patient) => patient.status))),
    [patients],
  );

  const visiblePatients = useMemo(() => {
    const sourcePatients = activeTab === "bookings" ? bookings : consultations;
    const query = searchQuery.trim().toLowerCase();

    return sourcePatients.filter((patient) => {
      const matchesQuery =
        query.length === 0 ||
        [
          patient.name,
          patient.email,
          patient.procedure,
          patient.status,
          patient.patientCode,
        ].some((value) => value.toLowerCase().includes(query));

      const matchesProcedure =
        selectedProcedure.length === 0 ||
        patient.procedure === selectedProcedure;
      const matchesStatus =
        selectedStatus.length === 0 || patient.status === selectedStatus;

      return matchesQuery && matchesProcedure && matchesStatus;
    });
  }, [
    activeTab,
    bookings,
    consultations,
    searchQuery,
    selectedProcedure,
    selectedStatus,
  ]);

  useEffect(() => {
    setSelectedPatient(null);
  }, [activeTab]);

  const handleViewDetails = (patient: PatientRecord) => {
    if (activeTab === "bookings") {
      router.push(`/dentist/patients/${patient.id}`);
      return;
    }

    setSelectedPatient(patient);
  };

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        heading="Patients"
        subHeading="All patients with confirmed bookings, past and present."
      />

      <CustomTabs
        tabs={[
          {
            id: "consultations",
            label: "Consultations",
          },
          {
            id: "bookings",
            label: "Bookings",
          },
        ]}
        activeTab={activeTab}
        onTabChange={(tabId) =>
          setActiveTab(tabId === "bookings" ? "bookings" : "consultations")
        }
        storageKey="patients-tabs"
      />

      <SearchPatient
        searchQuery={searchQuery}
        selectedProcedure={selectedProcedure}
        selectedStatus={selectedStatus}
        procedureOptions={procedureOptions}
        statusOptions={statusOptions}
        onSearchChange={setSearchQuery}
        onProcedureSelect={setSelectedProcedure}
        onStatusSelect={setSelectedStatus}
      />

      {isLoading ? (
        <PatientCardsSkeleton />
      ) : isError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-sm text-red-600">
          Failed to load patient records. Please check your connection and try again.
        </div>
      ) : (
        <PatientCardsSection
          patients={visiblePatients}
          mode={activeTab}
          onViewDetails={handleViewDetails}
        />
      )}

      <PatientDetailsDrawer
        patient={selectedPatient}
        onClose={() => setSelectedPatient(null)}
      />
    </div>
  );
}
