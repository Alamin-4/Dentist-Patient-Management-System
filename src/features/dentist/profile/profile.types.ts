export interface DentistProfileUser {
  id: string;
  email: string;
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  image?: string | null;
}

export interface DentistGlobalProcedure {
  id: string;
  name: string;
}

export interface DentistProcedure {
  id: string;
  price: number;
  notes?: string | null;
  isVerified: boolean;
  globalProcedure?: DentistGlobalProcedure | null;
}

export interface DentistLicense {
  isVerified: boolean;
  verificationStatus: string;
}

export interface DentistOperationVerification {
  isVerified: boolean;
  isApproved: boolean;
  verificationStatus: string;
}

export interface DentistClinicDepthVerification {
  isVerified: boolean;
  isApproved: boolean;
  verificationStatus: string;
}

export interface DentistProfessionalData {
  city?: string | null;
  yearsOfExperience?: string | number | null;
}

export interface DentistSpecialty {
  name: string;
}

export interface DentistDirectory {
  status: string; // "VERIFIED" | "CLAIMED" | "UNVERIFIED"
  membershipPaidAt?: string | null;
  membershipPlan?: string | null;
}

export interface DentistProfileData {
  id: string;
  slug?: string | null;
  country?: string | null;
  phoneNumber?: string | null;
  user?: DentistProfileUser | null;
  specialty?: DentistSpecialty | null;
  dentistProfessionalData?: DentistProfessionalData | null;
  dentistLicense?: DentistLicense | null;
  dentistOperationsVerifications?: DentistOperationVerification[] | null;
  dentistClinicDepthVerification?: DentistClinicDepthVerification | null;
  dentistProcedures?: DentistProcedure[] | null;
  dentistDirectory?: DentistDirectory | null;
}
