import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DentistProfileData } from "./profile.types";
import { Check, ShieldCheck, Verified } from "lucide-react";
import { SectionCard } from "@/components/shared/section-card";

interface ProfileHeaderProps {
  dentist?: DentistProfileData | null;
  rdvScore: number;
}

export function ProfileHeader({ dentist, rdvScore }: ProfileHeaderProps) {
  const user = dentist?.user;
  const name = user?.name || `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Dentist Profile";
  const specialtyName = dentist?.specialty?.name || "General Dentist";
  const image = user?.image;

  const initials = name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "";

  // ── Primary check: use the DentistDirectory.status set by admin ──────────
  const isDirectoryVerified = dentist?.dentistDirectory?.status === "VERIFIED";

  // ── Fallback: check individual sub-verifications ──────────────────────────
  const isLicenseVerified = dentist?.dentistLicense?.isVerified || dentist?.dentistLicense?.verificationStatus === "APPROVED";
  const isOperationsVerified = dentist?.dentistOperationsVerifications?.[0]?.isVerified || dentist?.dentistOperationsVerifications?.[0]?.isApproved || dentist?.dentistOperationsVerifications?.[0]?.verificationStatus === "APPROVED";
  const isClinicalVerified = dentist?.dentistClinicDepthVerification?.isVerified || dentist?.dentistClinicDepthVerification?.isApproved || dentist?.dentistClinicDepthVerification?.verificationStatus === "APPROVED";

  // All 3 phases approved = docs verified (same as public VERIFIED, no payment check)
  const isDocsVerified = isDirectoryVerified || (isLicenseVerified && isOperationsVerified && isClinicalVerified);
  // Payment pending = docs done but membership not yet paid (shown ONLY on this page)
  const isPaymentPending = isDocsVerified && !dentist?.dentistDirectory?.membershipPaidAt && !dentist?.dentistDirectory?.membershipPlan;

  const isFullyVerified = isDocsVerified;
  const isSearchable = isFullyVerified;

  const hasSubmittedAny = !!(dentist?.dentistLicense || (dentist?.dentistOperationsVerifications?.length ?? 0) > 0 || dentist?.dentistClinicDepthVerification);

  return (
    <SectionCard className="flex flex-col items-center justify-between p-4 sm:p-6 md:p-8 md:flex-row gap-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6 w-full md:w-auto">
        <Avatar className="h-20 w-20 bg-secondary shrink-0">
          {image && (
            <AvatarImage src={image} alt={name} className="object-cover" />
          )}
          <AvatarFallback className="bg-secondary text-2xl font-bold text-brand-medium-navy">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1 w-full">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Dr. {name}
          </h1>
          <p className="text-gray-500 font-medium text-sm">{specialtyName}</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
            {isFullyVerified && !isPaymentPending ? (
              <Badge
                variant="secondary"
                className="bg-badge/11 text-badge hover:bg-[#DEF7EC] border-none px-2.5 py-1 font-semibold text-xs rounded-md flex items-center gap-1 shrink-0"
              >
                <div className="flex h-3.5 w-3.5 items-center justify-center rounded-full">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.3084 5.22008V6.59258C15.3084 7.07258 15.0834 7.52258 14.6934 7.80008L6.44336 13.8451C5.91086 14.2351 5.18336 14.2351 4.65836 13.8376L3.57836 13.0276C3.09086 12.6601 2.69336 11.8651 2.69336 11.2576V5.22008C2.69336 4.38008 3.33836 3.45008 4.12586 3.15758L8.22836 1.62008C8.65586 1.46258 9.34586 1.46258 9.77336 1.62008L13.8759 3.15758C14.6634 3.45008 15.3084 4.38008 15.3084 5.22008Z" fill="#4CA30D" />
                    <path d="M14.1142 9.25507C14.6092 8.89507 15.3067 9.24757 15.3067 9.86257V11.2726C15.3067 11.8801 14.9092 12.6676 14.4217 13.0351L10.3192 16.1026C9.95923 16.3651 9.47923 16.5001 8.99923 16.5001C8.51923 16.5001 8.03923 16.3651 7.67923 16.0951L7.05673 15.6301C6.65173 15.3301 6.65173 14.7226 7.06423 14.4226L14.1142 9.25507Z" fill="#4CA30D" />
                  </svg>
                </div>
                Verified Profile
              </Badge>
            ) : isPaymentPending ? (
              <Badge
                variant="secondary"
                className="bg-amber-50 text-accent hover:bg-amber-50 border border-amber-200 px-2.5 py-1 font-semibold text-xs rounded-md flex items-center gap-1 shrink-0"
              >
                ⚠️ Payment Pending
              </Badge>
            ) : hasSubmittedAny ? (
              <Badge
                variant="secondary"
                className="bg-amber-50 text-accent hover:bg-amber-50 border-none px-2.5 py-1 font-semibold text-xs rounded-md shrink-0"
              >
                Pending Verification
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                className="bg-red-50 text-red-500 hover:bg-red-50 border-none px-2.5 py-1 font-semibold text-xs rounded-md shrink-0"
              >
                Unverified Profile
              </Badge>
            )}

            {isSearchable ? (
              <Badge
                variant="secondary"
                className="bg-admin-gold/10 text-admin-gold border-none px-2.5 py-1 font-semibold text-xs rounded-md shrink-0"
              >
                Live in Search
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                className="bg-gray-100 text-gray-500 hover:bg-gray-100 border-none px-2.5 py-1 font-semibold text-xs rounded-md shrink-0"
              >
                Not Live in Search
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="mt-2 md:mt-0 flex flex-col items-center justify-center shrink-0">
        <div className="relative h-28 w-28 lg:h-32 lg:w-32 flex items-center justify-center">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 100 100"
          >
            {/* Progress ring track */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#FFF2CC"
              strokeWidth="12"
              fill="transparent"
            />
            {/* Progress indicator */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#F3C043"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray="251.2"
              strokeDashoffset={251.2 - (251.2 * rdvScore) / 100}
              strokeLinecap="round"
              className="transition-all duration-500 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-lg lg:text-xl font-bold text-admin-gold">{rdvScore}%</span>
            <span className="text-[9px] uppercase text-admin-gold font-bold tracking-wider mt-0.5">
              RDV Score
            </span>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
