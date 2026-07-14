import { DentistDirectoryItem } from "./user";

export interface UserItem {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  name: string | null;
  image: string | null;
}

export interface SpecialtyItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface DentistVerificationProgressItem {
  id: string;
  dentistId: string;
  currentPhase: string;
  nextPhase: string;
  rvdScore: number | null;
  isLicenseVerified: boolean;
  isOperationsVerified: boolean;
  isClinicDepthVerified: boolean;
}

export interface DentistItem {
  id: string;
  userId: string;
  slug: string;
  phoneNumber: string;
  country: string | null;
  specialtyId: string | null;
  specialty: SpecialtyItem | null;
  user: UserItem;
  dentistVerificationProgress?: DentistVerificationProgressItem | null;
  dentistDirectory?: DentistDirectoryItem | null;
}

export interface ConsultationIntakeItem {
  id: string;
  patientId: string | null;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string | null;
  country: string | null;
  procedureIds: string[];
  procedureNames: string[];
  budget: string | null;
  travelFrom: string | null;
  travelTo: string | null;
  lastVisit: string | null;
  conditions: string[];
  additionalInfo: string | null;
  photos: string[];
  xrayUrl: string | null;
  xrayNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ConsultationItem {
  id: string;
  intakeId: string;
  intake: ConsultationIntakeItem;
  patientId: string | null;
  dentistId: string | null;
  directoryEntryId: string | null;
  requestStatus: string;
  scheduledDate: string | null;
  scheduledTime: string | null;
  timezone: string | null;
  durationMinutes: number;
  roomId: string | null;
  meetingLink: string | null;
  socketSessionId: string | null;
  dentistResponseNote: string | null;
  respondedAt: string | null;
  cancelledBy: string | null;
  cancellationReason: string | null;
  cancelledAt: string | null;
  rescheduledBy: string | null;
  rescheduledAt: string | null;
  createdAt: string;
  updatedAt: string;
  dentist: DentistItem | null;
  directoryEntry?: DentistDirectoryItem | null;
}

export interface GlobalProcedureItem {
  id: string;
  name: string;
  slug: string;
  specialtyId: string | null;
  isApproved: boolean;
  isActive: boolean;
}

export interface TreatmentLineItem {
  id: string;
  treatmentPlanId: string;
  globalProcedureId: string;
  globalProcedure: GlobalProcedureItem;
  quantity: number;
  unitPrice: string | number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TreatmentPlanItem {
  id: string;
  dentistId: string;
  patientId: string;
  status: string;
  notes: string | null;
  consultationId: string | null;
  createdAt: string;
  updatedAt: string;
  lineItems?: TreatmentLineItem[];
  dentist?: DentistItem;
  consultation?: ConsultationItem;
  treatmentBooking?: any;
}
