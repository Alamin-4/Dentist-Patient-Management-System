/**
 * Directory Domain Types & Enums
 */

/**
 * Strict Verification Status for Dentist Directory Profiles
 */
export const enum ProfileVerificationStatus {
  VERIFIED = 'VERIFIED',
  UNVERIFIED = 'UNVERIFIED',
}

/**
 * Strict Claim Button States
 */
export const enum ClaimButtonState {
  CLAIM_PROFILE = 'CLAIM_PROFILE',
  CLAIMED = 'CLAIMED',
  HIDDEN = 'HIDDEN',
}

/**
 * Rating structure for directory listings
 */
export interface DentistRatingDetails {
  google: number | null;
  doctoralia: number | null;
  combined: number | null;
  reviewCount: number;
}

/**
 * Location details for directory listings
 */
export interface DentistLocationDetails {
  city: string | null;
  country: string | null;
}

/**
 * Standardized Dentist Directory Card Data Contract
 */
export interface DentistDirectoryCardData {
  id: string;
  slug: string;
  name: string;
  image: string | null;
  specialty: string | null;
  rating: DentistRatingDetails;
  location: DentistLocationDetails;
  rdvScore: number;
  price: number;
  status: ProfileVerificationStatus;
  isClaimable: boolean;
  isClaimed: boolean;
  languages?: string[];
  surpriseGuarantee?: boolean;
  backendId?: string | null;
}

/**
 * Pure Utility Function: Determines profile verification status.
 * Profile is VERIFIED ONLY when all document phases are approved AND active subscription exists.
 */
export function determineVerificationStatus(
  phasesApproved: boolean,
  hasActiveSubscription: boolean
): ProfileVerificationStatus {
  return phasesApproved && hasActiveSubscription
    ? ProfileVerificationStatus.VERIFIED
    : ProfileVerificationStatus.UNVERIFIED;
}

/**
 * Pure Utility Function: Determines claim button state.
 * - Claimable & not claimed -> CLAIM_PROFILE
 * - Claimable & already claimed -> CLAIMED
 * - Self-registered profile (not claimable) -> HIDDEN
 */
export function getClaimButtonState(
  isClaimable: boolean,
  isClaimed: boolean
): ClaimButtonState {
  if (!isClaimable) {
    return ClaimButtonState.HIDDEN;
  }
  return isClaimed ? ClaimButtonState.CLAIMED : ClaimButtonState.CLAIM_PROFILE;
}
