import { UserRole, UserRoleType } from "@/types/constants";

export type RoleOrGuest = UserRoleType | "GUEST";

export type PermissionAction =
  | "book_consultation"
  | "claim_dentist_profile"
  | "write_review"
  | "register_as_doctor"
  | "access_patient_dashboard"
  | "access_dentist_dashboard"
  | "access_admin_dashboard"
  | "manage_procedures"
  | "submit_verification";

export const PERMISSION_MATRIX: Record<PermissionAction, RoleOrGuest[]> = {
  book_consultation: ["GUEST", UserRole.PATIENT],
  claim_dentist_profile: ["GUEST"],
  write_review: [UserRole.PATIENT],
  register_as_doctor: ["GUEST"],
  access_patient_dashboard: [UserRole.PATIENT],
  access_dentist_dashboard: [UserRole.DENTIST],
  access_admin_dashboard: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
  manage_procedures: [UserRole.DENTIST, UserRole.ADMIN, UserRole.SUPER_ADMIN],
  submit_verification: [UserRole.DENTIST],
};
