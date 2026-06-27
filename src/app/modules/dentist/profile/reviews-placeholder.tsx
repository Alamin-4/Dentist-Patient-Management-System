interface ReviewsPlaceholderProps {
  dentist: any;
}

export function ReviewsPlaceholder({ dentist }: ReviewsPlaceholderProps) {
  const isLicenseVerified = dentist?.dentistLicense?.isVerified || dentist?.dentistLicense?.verificationStatus === "APPROVED";
  const isOperationsVerified = dentist?.dentistOperationsVerifications?.[0]?.isVerified || dentist?.dentistOperationsVerifications?.[0]?.isApproved || dentist?.dentistOperationsVerifications?.[0]?.verificationStatus === "APPROVED";
  const isClinicalVerified = dentist?.dentistClinicDepthVerification?.isVerified || dentist?.dentistClinicDepthVerification?.isApproved || dentist?.dentistClinicDepthVerification?.verificationStatus === "APPROVED";

  const isFullyVerified = isLicenseVerified && isOperationsVerified && isClinicalVerified;

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <div className="border-b border-gray-50 px-6 py-4">
        <h3 className="text-lg font-bold text-gray-900">Reviews</h3>
      </div>
      <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
        <h4 className="mb-2 text-base font-bold text-gray-900">
          {isFullyVerified ? "No reviews yet" : "Reviews will appear after consultations"}
        </h4>
        <p className="max-w-85 text-sm leading-relaxed text-gray-400">
          {isFullyVerified
            ? "Reviews will be displayed here once patients book and complete consultations with you."
            : "Currently your profile is not visible to the public, so patients cannot review or book consultations yet."}
        </p>
      </div>
    </div>
  );
}
