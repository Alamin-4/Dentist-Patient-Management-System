import CustomTabs from "../../shared/custom-tabs/custom-tabs";
import DashboardPageHeader from "../../shared/dashboard-page-header/dashboard-page-header";
import SearchPatient from "./search-patient";
import PatientCardsSection from "./patient-card";

export default function PatientManage() {
  return (
    <div className="space-y-6 pb-12">
      <DashboardPageHeader
        heading="Patients"
        subHeading="All patients with confirmed bookings, past and present."
      />
      <CustomTabs
        tabs={[
          {
            id: "patient-1",
            label: "Consultations",
          },
          {
            id: "patient-2",
            label: "Bookings",
          },
        ]}
        storageKey="patients-tabs"
      />
      <SearchPatient />
      <PatientCardsSection />
    </div>
  );
}
