import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ProfileHeaderProps {
  dentist: any;
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
    .toUpperCase() || "DP";

  const isLicenseVerified = dentist?.dentistLicense?.isVerified || dentist?.dentistLicense?.verificationStatus === "APPROVED";
  const isOperationsVerified = dentist?.dentistOperationsVerifications?.[0]?.isVerified || dentist?.dentistOperationsVerifications?.[0]?.isApproved || dentist?.dentistOperationsVerifications?.[0]?.verificationStatus === "APPROVED";
  const isClinicalVerified = dentist?.dentistClinicDepthVerification?.isVerified || dentist?.dentistClinicDepthVerification?.isApproved || dentist?.dentistClinicDepthVerification?.verificationStatus === "APPROVED";

  const isFullyVerified = isLicenseVerified && isOperationsVerified && isClinicalVerified;
  const isSearchable = isFullyVerified;

  const hasSubmittedAny = !!(dentist?.dentistLicense || dentist?.dentistOperationsVerifications?.length > 0 || dentist?.dentistClinicDepthVerification);

  let verificationBadgeLabel = "UNVERIFIED";
  let verificationBadgeClass = "bg-red-50 text-red-500 border-none px-3 py-1 font-semibold";
  let dotClass = "bg-red-500";

  if (isFullyVerified) {
    verificationBadgeLabel = "VERIFIED";
    verificationBadgeClass = "bg-green-50 text-green-600 border-none px-3 py-1 font-semibold";
    dotClass = "bg-green-500 animate-pulse";
  } else if (hasSubmittedAny) {
    verificationBadgeLabel = "PENDING VERIFICATION";
    verificationBadgeClass = "bg-amber-50 text-amber-600 border-none px-3 py-1 font-semibold";
    dotClass = "bg-amber-500 animate-pulse";
  }

  return (
    <div className="flex flex-col items-center justify-between rounded-lg border border-gray-100 bg-white p-8 md:flex-row gap-6">
      <div className="flex items-center gap-6">
        <Avatar className="h-20 w-20">
          {image && (
            <AvatarImage src={image} alt={name} className="object-cover" />
          )}
          <AvatarFallback className="bg-[#E8F1F8] text-2xl font-bold text-[#163E5C]">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">
            Dr. {name}
          </h1>
          <p className="text-gray-500">{specialtyName}</p>
          <div className="flex gap-2 pt-2">
            <Badge variant="secondary" className={verificationBadgeClass}>
              <span className={`mr-1 h-1.5 w-1.5 rounded-full ${dotClass}`} />
              {verificationBadgeLabel}
            </Badge>
            {isSearchable ? (
              <Badge
                variant="secondary"
                className="bg-green-50 text-green-600 border-none px-3 py-1 font-semibold"
              >
                Searchable
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                className="bg-gray-100 text-gray-600 border-none px-3 py-1"
              >
                Not Searchable
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-1 md:mt-0">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-[6px] border-gray-50">
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold text-[#163E5C]">{rdvScore}%</span>
            <span className="text-[10px] uppercase text-gray-400">
              RDV Score
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
