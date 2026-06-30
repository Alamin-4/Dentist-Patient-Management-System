// ── Rating breakdown from directory scraped + Google / Doctoralia sources ──
export type DentistRating = {
  google: number | null;
  googleReviewCount: number | null;
  doctoralia: number | null;
  doctoraliaReviewCount: number | null;
  combined: number | null; // average of available sources
};

// ── Location object returned by the API ──────────────────────────────────────
export type DentistLocation = {
  city: string | null;
  country: string;
  fullAddress: string | null;
  googleMapsUrl: string | null;
};

// ── Verification phase breakdown ─────────────────────────────────────────────
export type DentistVerificationPhase = {
  currentPhase: 'LICENSE' | 'OPERATIONS' | 'CLINIC';
  nextPhase: 'LICENSE' | 'OPERATIONS' | 'CLINIC';
  isLicenseVerified: boolean;
  isOperationsVerified: boolean;
  isClinicDepthVerified: boolean;
};

// ── Primary Dentist shape returned by GET /dentists/directory ────────────────
export type Dentist = {
  // Core DentistDirectory fields
  id: string;
  name: string;
  slug: string;
  specialty: string | null;
  clinicName: string | null;
  phone: string | null;
  status: 'UNVERIFIED' | 'CLAIMED' | 'VERIFIED';
  isClaimable: boolean;
  claimedByUserId: string | null;
  membershipPlan: string | null;
  createdAt: string;
  updatedAt: string;

  // Enriched from linked User / Dentist records
  image: string | null;
  backendId: string | null;
  country: string;
  price: number;
  rdvScore: number;
  languages: string[];
  surpriseGuarantee: boolean;
  verificationPhase: DentistVerificationPhase | null;

  // Account type clarifies HOW this dentist is on the platform:
  //   CLAIMABLE  → admin-uploaded entry, nobody has claimed it yet
  //   CLAIMED    → admin-uploaded, claimed by a dentist (via Stripe payment)
  //   REGISTERED → dentist self-registered (created their own account)
  accountType: 'CLAIMABLE' | 'CLAIMED' | 'REGISTERED';
  isClaimed: boolean;  // true when CLAIMABLE profile has been claimed
  isVerified: boolean; // true when directory status === VERIFIED

  // Structured rating
  rating: DentistRating;

  // Structured location
  location: DentistLocation;

  // Geo coords — not in API yet; mapping layer provides a default
  coords?: { lat: number; lng: number };
};

// Import centralized demo data
import { DEMO_DENTISTS } from "@/lib/storage/dentistData";

export const dentists: Dentist[] = DEMO_DENTISTS;

export const procedureOptions = [
  "All Procedures",
  "Veneers",
  "Orthodontics",
  "Aligners",
  "Crowns",
  "Implants",
  "Bone Grafting",
  "Whitening",
  "Smile Design",
  "Cleanings",
  "Fillings",
  "Gum Care",
  "Deep Cleaning",
];

export const countryOptions = ["All Countries", "Mexico"];

export const cityOptions = [
  "All Cities",
  "Mexico City",
  "Polanco",
  "Roma Norte",
  "Coyoacan",
  "Del Valle",
  "Napoles",
];
