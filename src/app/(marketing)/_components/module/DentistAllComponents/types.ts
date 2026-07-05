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

  // Real geo coords from the API (null/undefined until the dentist's address
  // has been geocoded / captured via the clinic-depth map picker). No pin
  // should be rendered when either is missing.
  latitude?: number | null;
  longitude?: number | null;
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

export function mapApiDentist(d: any): Dentist {
  if (!d) return d;
  const google: number | null = d.googleRating ?? null;
  const doctoralia: number | null = d.doctoraliaRating ?? null;
  const combined: number | null =
    google != null && doctoralia != null
      ? (google + doctoralia) / 2
      : google ?? doctoralia ?? null;

  const accountType: Dentist['accountType'] =
    d.isClaimable === false
      ? 'REGISTERED'
      : d.status === 'CLAIMED' || d.status === 'VERIFIED'
        ? 'CLAIMED'
        : 'CLAIMABLE';

  const hasCoords = typeof d.latitude === "number" && typeof d.longitude === "number";

  return {
    ...d,
    coords: hasCoords ? { lat: d.latitude, lng: d.longitude } : undefined,
    rating: {
      google,
      googleReviewCount: d.googleReviewCount ?? null,
      doctoralia,
      doctoraliaReviewCount: d.doctoraliaReviewCount ?? null,
      combined,
    },
    location: {
      city: d.city ?? null,
      country: d.country ?? '',
      fullAddress: d.fullAddress ?? null,
      googleMapsUrl: d.googleMapsUrl ?? null,
    },
    accountType,
    isClaimed: d.status === 'CLAIMED' || d.status === 'VERIFIED',
    isVerified: d.status === 'VERIFIED',
    surpriseGuarantee: d.surpriseGuarantee ?? false,
    verificationPhase: d.verificationPhase ?? null,
  };
}
