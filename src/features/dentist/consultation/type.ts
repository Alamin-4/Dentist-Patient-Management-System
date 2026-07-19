export type TabType = "Upcoming" | "Active" | "Treatment Estimate";

export interface Consultation {
  id: string;
  patientName: string;
  email: string;
  procedure: string;
  budget: string;
  date: string;
  timeSlot: string;
  status: TabType;
  treatmentPlanStatus?: "Not Sent" | "Awaiting response" | "Rejected";
}