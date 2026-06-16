export type VerificationPhase = "LICENSE" | "OPERATIONAL" | "CLINICAL";

export interface VerificationProgressStep {
  phase?: VerificationPhase | string;
  completed?: boolean;
  status?: string | null;
}

export interface DentistVerificationProgress {
  steps?: VerificationProgressStep[];
  is_step_one_completed?: boolean;
  is_step_two_completed?: boolean;
  is_step_three_completed?: boolean;
  step_one_status?: string | null;
  step_two_status?: string | null;
  step_three_status?: string | null;
  is_verified?: boolean;
  verification_phase?: string | null;
  progress_percentage?: number | null;
  score?: number | null;
}
