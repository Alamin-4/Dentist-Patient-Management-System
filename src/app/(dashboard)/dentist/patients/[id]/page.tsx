import { notFound } from "next/navigation";
import PatientDetails from "../../../../modules/dentist/patients-manage/patient-details-page";
import { loadPatientRecordById } from "@/app/modules/dentist/patients-manage/patients-data.server";

interface PatientDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PatientDetailsPage({
  params,
}: PatientDetailsPageProps) {
  const { id } = await params;
  const patient = await loadPatientRecordById(id);

  if (!patient) {
    notFound();
  }

  return (
    <div className="pb-6">
      <PatientDetails patient={patient} />
    </div>
  );
}
