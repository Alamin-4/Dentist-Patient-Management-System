export type VerificationPhase = "LICENSE" | "OPERATIONAL" | "CLINICAL";

export interface VerificationProgressStep {
  phase?: VerificationPhase | string;
  completed?: boolean;
  status?: string | null;
  note?: string | null;
}

export interface DentistVerificationProgress {
  steps?: VerificationProgressStep[];
  is_step_one_completed?: boolean;
  is_step_two_completed?: boolean;
  is_step_three_completed?: boolean;
  step_one_status?: string | null;
  step_two_status?: string | null;
  step_three_status?: string | null;
  step_one_note?: string | null;
  step_two_note?: string | null;
  step_three_note?: string | null;
  is_verified?: boolean;
  is_docs_verified?: boolean;
  is_membership_paid?: boolean;
  is_claimed_profile?: boolean;
  show_membership_purchase?: boolean;
  dentist_directory_id?: string | null;
  directory_slug?: string | null;
  verification_phase?: string | null;
  progress_percentage?: number | null;
  score?: number | null;
}
