export const VerificationStatus = {
  PENDING: "PENDING",
  SUBMITTED: "SUBMITTED",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;
export type VerificationStatusType = typeof VerificationStatus[keyof typeof VerificationStatus];

export const UserRole = {
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
  DENTIST: "DENTIST",
  PATIENT: "PATIENT",
} as const;
export type UserRoleType = typeof UserRole[keyof typeof UserRole];
