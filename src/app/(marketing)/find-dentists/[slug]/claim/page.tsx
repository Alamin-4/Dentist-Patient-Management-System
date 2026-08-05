"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Check, AlertCircle, ArrowLeft } from "lucide-react";
import { useLogout, useMe, useOtpVerify, useResendOtp } from "@/hooks/auth/useAuth";
import { useGetMe } from "@/hooks/user/useUser";
import { useQueryClient } from "@tanstack/react-query";
import { useDentistDirectoryDetail } from "@/hooks/dentist/useDentistDirectory";
import ProfilePageSkeleton from "@/features/marketing/find-dentists-page-components/DentistProfile/profile-page-skeleton";

import {
  useClaimDentistDirectoryProfile,
  useCreateDirectoryCheckoutSession,
  useSendClaimOtp,
} from "@/hooks/dentist/useDentistDirectory";

import { ClaimStep1, ClaimStep2 } from "@/features/marketing/find-dentists-page-components/DentistProfile/ClaimSteps1To2";
import { ClaimStep3, ClaimStep4, ClaimStep5 } from "@/features/marketing/find-dentists-page-components/DentistProfile/ClaimSteps3To5";

export default function ClaimProfilePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params?.slug as string;
  const queryClient = useQueryClient();

  const { data: directoryDetailResponse, isLoading, isError } = useDentistDirectoryDetail(slug, true);

  const dentist = useMemo(() => {
    if (!directoryDetailResponse?.data) return null;
    const d = directoryDetailResponse.data;
    const googleRating: number | null = d.googleRating ?? null;
    const doctoraliaRating: number | null = d.doctoraliaRating ?? null;
    const combinedRating: number | null =
      googleRating != null && doctoraliaRating != null
        ? (googleRating + doctoraliaRating) / 2
        : googleRating ?? doctoraliaRating ?? null;
    const reviewCount = d.googleReviewCount ?? d.doctoraliaReviewCount ?? 0;

    return {
      id: d.id,
      name: d.name,
      slug: d.slug,
      specialty: d.specialty || "",
      rating: combinedRating ?? 0,
      reviewCount,
      image: d.image || "",
      location: d.fullAddress || d.city || "",
      city: d.city || "",
      country: d.country || "",
      latitude: d.latitude ?? null,
      longitude: d.longitude ?? null,
      price: d.price || 0,
      rdvScore: d.rdvScore || 0,
      verified: d.status === "VERIFIED",
      status: d.status,
      isClaimable: d.isClaimable,
      profileType: d.profileType || "CLAIMABLE",
      procedures: d.procedures || [],
      languages: d.languages || [],
      bio: d.description || d.bio || "",
      googleRating: googleRating ?? combinedRating ?? 0,
      googleReviewCount: reviewCount,
      dentistLicense: d.dentistLicense,
      dentistOperations: d.dentistOperations,
      materials: d.materials || [],
      backendId: d.backendId,
      claimedByUserId: d.claimedByUserId,
      userId: d.userId,
      membershipPaidAt: d.membershipPaidAt,
      membershipPlan: d.membershipPlan,
    };
  }, [directoryDetailResponse]);

  const { user } = useMe();
  const { data: meResponse } = useGetMe({ enabled: !!user });
  const meData = meResponse as { data?: unknown } | undefined;
  const fullUser = (meData?.data || meResponse) as Record<string, unknown> | undefined;

  const claimMutation = useClaimDentistDirectoryProfile();
  const checkoutMutation = useCreateDirectoryCheckoutSession();
  const sendClaimOtpMutation = useSendClaimOtp();
  const verifyOtpMutation = useOtpVerify();
  const resendOtpMutation = useResendOtp();

  const [claimEmail, setClaimEmail] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`claim_session_${slug}`);
      if (saved) {
        try {
          return JSON.parse(saved).email || "";
        } catch { }
      }
    }
    return "";
  });
  const [claimPassword, setClaimPassword] = useState("");
  const [claimOtp, setClaimOtp] = useState("");

  const [claimStep, setClaimStep] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`claim_session_${slug}`);
      if (saved) {
        try {
          return JSON.parse(saved).step || 1;
        } catch { }
      }
    }
    return 1;
  });

  const [yearsOfExperience, setYearsOfExperience] = useState(5);
  const [motivation, setMotivation] = useState("");
  const [internationalPatients, setInternationalPatients] = useState(10);
  const [selectedPlan, setSelectedPlan] = useState("6_MONTH");
  const [claimedDirectoryId, setClaimedDirectoryId] = useState("");

  const [hasSterilizationDocs, setHasSterilizationDocs] = useState(false);
  const [hasBeforeAfterPhotos, setHasBeforeAfterPhotos] = useState(false);
  const [hasMaterialsDocs, setHasMaterialsDocs] = useState(false);
  const [hasEducationCertificates, setHasEducationCertificates] = useState(false);
  const [hasGuarantees, setHasGuarantees] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { mutate: handleLogout, isPending: isLogoutPending } = useLogout({
    redirectTo: slug ? `/find-dentists/${slug}/claim` : "/",
  });

  const isNotDentist = useMemo(() => {
    if (!user) return false;
    if (user.role === "DENTIST") return false;

    const savedSession = typeof window !== "undefined" ? localStorage.getItem(`claim_session_${slug}`) : null;
    let savedEmail = "";
    if (savedSession) {
      try {
        savedEmail = JSON.parse(savedSession).email || "";
      } catch { }
    }
    const currentClaimingEmail = claimEmail || savedEmail;
    if (user.role === "PATIENT" && currentClaimingEmail && user.email?.toLowerCase() === currentClaimingEmail.toLowerCase()) {
      return false;
    }

    return true;
  }, [user, claimEmail, slug]);

  const alreadyClaimedDirectoryId = fullUser?.dentist?.dentistDirectoryId;
  const isProfilePaid =
    !!fullUser?.dentist?.dentistDirectory?.membershipPaidAt ||
    !!dentist?.membershipPaidAt;

  const hasAlreadyClaimedAnother = alreadyClaimedDirectoryId && alreadyClaimedDirectoryId !== dentist?.id;
  const hasAlreadyClaimedThis = alreadyClaimedDirectoryId && alreadyClaimedDirectoryId === dentist?.id && isProfilePaid;
  const isClaimPendingPayment = alreadyClaimedDirectoryId && alreadyClaimedDirectoryId === dentist?.id && !isProfilePaid;

  const isProfileAlreadyClaimedBySomeoneElse =
    (!!dentist?.claimedByUserId || !dentist?.isClaimable) &&
    !hasAlreadyClaimedThis &&
    !isClaimPendingPayment;

  useEffect(() => {
    if (isClaimPendingPayment && claimStep < 4) {
      setClaimStep(4);
    }
  }, [isClaimPendingPayment, claimStep]);

  useEffect(() => {
    setError(null);
    setSuccessMessage(null);
  }, [claimStep]);

  useEffect(() => {
    if (user?.email && (!alreadyClaimedDirectoryId || isClaimPendingPayment)) {
      const savedSession = typeof window !== "undefined" ? localStorage.getItem(`claim_session_${slug}`) : null;
      let savedEmail = "";
      if (savedSession) {
        try {
          savedEmail = JSON.parse(savedSession).email || "";
        } catch { }
      }
      const currentClaimingEmail = claimEmail || savedEmail;
      const isAllowedPatient = user.role === "PATIENT" && currentClaimingEmail && user.email.toLowerCase() === currentClaimingEmail.toLowerCase();

      if (user.role === "DENTIST" || isAllowedPatient) {
        setClaimEmail(user.email);
        if (claimStep < 3) {
          setClaimStep(isClaimPendingPayment ? 4 : 3);
        }
      }
    }
  }, [user, claimStep, alreadyClaimedDirectoryId, isClaimPendingPayment, claimEmail, slug]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (claimStep === 5) {
        localStorage.removeItem(`claim_session_${slug}`);
      } else if (claimEmail || claimStep > 1) {
        localStorage.setItem(
          `claim_session_${slug}`,
          JSON.stringify({ email: claimEmail, step: claimStep })
        );
      }
    }
  }, [claimEmail, claimStep, slug]);

  useEffect(() => {
    if (searchParams?.get("cancelled") === "true") {
      setError("Stripe checkout was cancelled. You can select a plan and try again.");
      setClaimStep(4);
    }
  }, [searchParams]);

  const handleSendOtp = () => {
    setError(null);
    setSuccessMessage(null);

    if (!claimEmail || !claimPassword) {
      setError("Please provide email and password to create your account.");
      return;
    }
    if (yearsOfExperience < 0) {
      setError("Experience must be a positive number.");
      return;
    }

    sendClaimOtpMutation.mutate(
      { email: claimEmail, password: claimPassword, name: dentist?.name },
      {
        onSuccess: () => {
          setSuccessMessage("OTP verification code sent. Please check your email.");
          setClaimStep(2);
        },
        onError: (err: unknown) => {
          const apiErr = err as { message?: string };
          const errMsg = apiErr?.message || "Failed to send OTP.";
          setError(errMsg);
        },
      }
    );
  };

  const handleVerifyOtp = () => {
    setError(null);
    setSuccessMessage(null);

    if (!claimOtp || claimOtp.length < 4) {
      setError("Please enter a valid OTP code.");
      return;
    }

    verifyOtpMutation.mutate(
      { email: claimEmail, otp: claimOtp },
      {
        onSuccess: () => {
          setSuccessMessage("Email verified and logged in successfully!");
          setClaimStep(3);
        },
        onError: (err: unknown) => {
          const apiErr = err as { message?: string };
          const errMsg = apiErr?.message || "Invalid OTP code.";
          setError(errMsg);
        },
      }
    );
  };

  const handleResendOtpCode = () => {
    setError(null);
    setSuccessMessage(null);

    resendOtpMutation.mutate(
      { email: claimEmail },
      {
        onSuccess: () => {
          setSuccessMessage("Verification OTP resent to your email.");
        },
        onError: (err: unknown) => {
          const apiErr = err as { message?: string };
          const errMsg = apiErr?.message || "Failed to resend OTP.";
          setError(errMsg);
        },
      }
    );
  };

  const handleNextStep = () => {
    setError(null);
    setSuccessMessage(null);

    if (claimStep === 3) {
      if (!hasSterilizationDocs || !hasBeforeAfterPhotos || !hasMaterialsDocs || !hasEducationCertificates || !hasGuarantees) {
        setError("You must fulfill and agree to all quality standards to claim this profile.");
        return;
      }

      if (claimedDirectoryId) {
        setClaimStep(4);
        return;
      }

      claimMutation.mutate(
        {
          slug: dentist?.slug,
          payload: {
            yearsOfExperience: Number(yearsOfExperience),
            motivation,
            internationalPatients: Number(internationalPatients),
            procedures: [dentist?.specialty || "General Dentistry"],
            hasSterilizationDocs,
            hasBeforeAfterPhotos,
            hasMaterialsDocs,
            hasEducationCertificates,
            hasGuarantees,
          },
        },
        {
          onSuccess: (res: { data?: { id?: string } }) => {
            const directoryId = res?.data?.id;
            if (directoryId) setClaimedDirectoryId(directoryId);
            setSuccessMessage("Application saved! Please select your membership plan.");
            setClaimStep(4);
          },
          onError: (err: unknown) => {
            const apiErr = err as { message?: string };
            const errMsg = apiErr?.message || "Failed to save application.";
            if (errMsg.toLowerCase().includes("already") || errMsg.toLowerCase().includes("claimed")) {
              setClaimStep(4);
              return;
            }
            setError(errMsg);
          },
        }
      );
    }
  };

  const handleProceedToPayment = () => {
    setError(null);
    setSuccessMessage(null);

    const directoryId = claimedDirectoryId || dentist?.id;
    if (!directoryId) {
      setError("Profile ID not found. Please try again.");
      return;
    }

    checkoutMutation.mutate(
      { dentistDirectoryId: directoryId, membershipPlan: selectedPlan },
      {
        onSuccess: (res: { data?: { url?: string } }) => {
          const checkoutUrl = res?.data?.url;
          if (checkoutUrl) {
            window.location.href = checkoutUrl;
          } else {
            setError("Failed to create checkout session. Please try again.");
          }
        },
        onError: (err: unknown) => {
          const apiErr = err as { message?: string };
          const errMsg = apiErr?.message || "Payment setup failed.";
          setError(errMsg);
        },
      }
    );
  };

  if (isLoading) {
    return <ProfilePageSkeleton />;
  }

  if (isError || !dentist) {
    return (
      <div className="flex h-dvh items-center justify-center bg-white">
        <h1 className="text-2xl font-bold text-[#003366]">Dentist Not Found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">

        {/* Navigation & Header */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => router.push(`/find-dentists`)}
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
            Back to Dentists Directory
          </button>

          <div className="text-xs text-slate-400 font-medium">
            Applying as: <span className="text-slate-600 font-semibold">{dentist.name}</span>
          </div>
        </div>

        {/* Application Card */}
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden p-8 sm:p-10">

          <div className="mb-6 text-left pb-6 border-b border-slate-100">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
              Claim Professional Profile
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Verify your identity, select a premium plan, and start getting international patient leads.
            </p>

            {/* Step Indicator */}
            {!isNotDentist && !hasAlreadyClaimedAnother && !hasAlreadyClaimedThis && !isProfileAlreadyClaimedBySomeoneElse && (
              <div className="flex items-center gap-2 mt-5">
                {[1, 2, 3, 4].map((s) => (
                  <div key={s} className="flex items-center gap-1">
                    <div
                      className={`size-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${claimStep > s
                        ? "bg-badge text-white animate-scaleUp"
                        : claimStep === s
                          ? "bg-primary text-white scale-110 ring-4 ring-primary/15 font-extrabold"
                          : "bg-slate-50 border border-slate-200 text-slate-400"
                        }`}
                    >
                      {claimStep > s ? <Check className="size-3.5 stroke-3" /> : s}
                    </div>
                    {s < 4 && (
                      <div
                        className={`w-10 sm:w-16 h-0.5 transition-colors duration-300 ${claimStep > s ? "bg-badge" : "bg-slate-200"
                          }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4">
            {/* 1. Account type validation block */}
            {isNotDentist && (
              <div className="text-center py-6 space-y-4 animate-scaleUp">
                <div className="mx-auto size-14 rounded-full bg-accent/5 border border-amber-200 flex items-center justify-center text-accent">
                  <AlertCircle className="size-8" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-slate-900">Dentist Account Required</h4>
                  <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
                    You are currently logged in as a <strong>{user?.role?.toLowerCase()}</strong>. Only dental professionals can claim directory listings.
                  </p>
                  <p className="text-slate-400 text-xs max-w-sm mx-auto">
                    Please log out first, then click &ldquo;Claim Profile&rdquo; to sign up or log in with your Dentist credentials.
                  </p>
                </div>
                <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center border-t border-slate-100 mt-6">
                  <button
                    type="button"
                    disabled={isLogoutPending}
                    onClick={() => handleLogout()}
                    className="rounded-lg bg-[#113254] px-6 py-2.5 font-semibold text-white transition-all hover:bg-[#0d2844] active:scale-[0.98] disabled:opacity-70 cursor-pointer text-sm"
                  >
                    {isLogoutPending ? "Logging out..." : "Log Out & Continue as Dentist"}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push("/find-dentists")}
                    className="rounded-lg border border-[#E5E7EB] px-6 py-2.5 font-semibold text-slate-700 transition-colors hover:bg-slate-50 cursor-pointer text-sm"
                  >
                    Back to Dentists Directory
                  </button>
                </div>
              </div>
            )}

            {/* 2. Dentist owns another profile validation block */}
            {!isNotDentist && hasAlreadyClaimedAnother && (
              <div className="text-center py-6 space-y-4 animate-scaleUp">
                <div className="mx-auto size-14 rounded-full bg-accent/5 border border-amber-200 flex items-center justify-center text-accent">
                  <AlertCircle className="size-8" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-slate-900">Limit: One Profile Per Account</h4>
                  <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
                    Your dentist account is already linked to the directory listing for <span className="font-semibold text-slate-800">{fullUser?.dentist?.dentistDirectory?.name || "another profile"}</span>.
                  </p>
                  <p className="text-slate-400 text-xs max-w-sm mx-auto leading-relaxed">
                    Each professional dentist account is restricted to claiming exactly one directory profile. If you need to manage multiple profiles, please contact support.
                  </p>
                </div>
                <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center border-t border-slate-100 mt-6">
                  <button
                    type="button"
                    disabled={isLogoutPending}
                    onClick={() => handleLogout()}
                    className="rounded-lg bg-[#113254] px-6 py-2.5 font-semibold text-white transition-all hover:bg-[#0d2844] active:scale-[0.98] disabled:opacity-70 cursor-pointer text-sm"
                  >
                    {isLogoutPending ? "Logging out..." : "Log Out & Continue as Dentist"}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push("/find-dentists")}
                    className="rounded-lg border border-[#E5E7EB] px-6 py-2.5 font-semibold text-slate-700 transition-colors hover:bg-slate-50 cursor-pointer text-sm"
                  >
                    Back to Dentists Directory
                  </button>
                </div>
              </div>
            )}

            {/* 3. Dentist owns THIS profile block */}
            {!isNotDentist && hasAlreadyClaimedThis && (
              <div className="text-center py-6 space-y-4 animate-scaleUp">
                <div className="mx-auto size-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <Check className="size-8" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-slate-900">You Own This Profile</h4>
                  <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
                    You have already claimed this profile! You can manage your clinics, pricing, verification status, and consultation requests directly from your dashboard.
                  </p>
                </div>
                <div className="pt-4 flex gap-3 justify-center border-t border-slate-100 mt-6">
                  <button
                    type="button"
                    onClick={() => router.push("/dentist")}
                    className="rounded-lg bg-primary px-6 py-2.5 font-semibold text-white transition-colors hover:bg-[#002850] cursor-pointer text-sm"
                  >
                    Go to Dashboard →
                  </button>
                </div>
              </div>
            )}

            {/* 3.5 Profile already claimed by someone else block */}
            {!isNotDentist && !hasAlreadyClaimedAnother && !hasAlreadyClaimedThis && isProfileAlreadyClaimedBySomeoneElse && (
              <div className="text-center py-6 space-y-4 animate-scaleUp">
                <div className="mx-auto size-14 rounded-full bg-accent/5 border border-amber-200 flex items-center justify-center text-accent">
                  <AlertCircle className="size-8" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-slate-900">Profile Already Claimed</h4>
                  <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
                    This directory listing for <span className="font-semibold text-slate-800">{dentist?.name}</span> has already been claimed and verified. It is no longer available to be claimed.
                  </p>
                </div>
                <div className="pt-4 flex gap-3 justify-center border-t border-slate-100 mt-6">
                  <button
                    type="button"
                    onClick={() => router.push("/find-dentists")}
                    className="rounded-lg bg-primary px-6 py-2.5 font-semibold text-white transition-colors hover:bg-[#002850] cursor-pointer text-sm"
                  >
                    Back to Dentists Directory
                  </button>
                </div>
              </div>
            )}

            {/* 4. Normal onboarding flow */}
            {!isNotDentist && !hasAlreadyClaimedAnother && !hasAlreadyClaimedThis && !isProfileAlreadyClaimedBySomeoneElse && (
              <>
                {/* Inline Error Notice */}
                {error && (
                  <div className="mb-4 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5 animate-fadeIn">
                    <AlertCircle className="size-4 shrink-0 mt-0.5 text-red-600" />
                    <div className="space-y-0.5">
                      <p className="font-semibold">Action Failed</p>
                      <p className="text-red-700">{error}</p>
                    </div>
                  </div>
                )}

                {/* Inline Success Notice */}
                {successMessage && (
                  <div className="mb-4 p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-fadeIn">
                    <Check className="size-4 shrink-0 mt-0.5 text-emerald-600 stroke-3" />
                    <div className="space-y-0.5">
                      <p className="font-semibold">Success</p>
                      <p className="text-emerald-700">{successMessage}</p>
                    </div>
                  </div>
                )}

                {claimStep === 1 && (
                  <ClaimStep1
                    dentist={dentist}
                    user={user}
                    claimEmail={claimEmail}
                    setClaimEmail={setClaimEmail}
                    claimPassword={claimPassword}
                    setClaimPassword={setClaimPassword}
                    yearsOfExperience={yearsOfExperience}
                    setYearsOfExperience={setYearsOfExperience}
                    internationalPatients={internationalPatients}
                    setInternationalPatients={setInternationalPatients}
                    motivation={motivation}
                    setMotivation={setMotivation}
                    sendClaimOtpMutation={sendClaimOtpMutation}
                    handleSendOtp={handleSendOtp}
                  />
                )}

                {claimStep === 2 && (
                  <ClaimStep2
                    claimEmail={claimEmail}
                    claimOtp={claimOtp}
                    setClaimOtp={setClaimOtp}
                    handleVerifyOtp={handleVerifyOtp}
                    verifyOtpMutation={verifyOtpMutation}
                    handleResendOtpCode={handleResendOtpCode}
                    resendOtpMutation={resendOtpMutation}
                    setClaimStep={setClaimStep}
                  />
                )}

                {claimStep === 3 && (
                  <ClaimStep3
                    hasSterilizationDocs={hasSterilizationDocs}
                    setHasSterilizationDocs={setHasSterilizationDocs}
                    hasBeforeAfterPhotos={hasBeforeAfterPhotos}
                    setHasBeforeAfterPhotos={setHasBeforeAfterPhotos}
                    hasMaterialsDocs={hasMaterialsDocs}
                    setHasMaterialsDocs={setHasMaterialsDocs}
                    hasEducationCertificates={hasEducationCertificates}
                    setHasEducationCertificates={setHasEducationCertificates}
                    hasGuarantees={hasGuarantees}
                    setHasGuarantees={setHasGuarantees}
                    handleNextStep={handleNextStep}
                    user={user}
                    setClaimStep={setClaimStep}
                    claimMutation={claimMutation}
                  />
                )}

                {claimStep === 4 && (
                  <ClaimStep4
                    selectedPlan={selectedPlan}
                    setSelectedPlan={setSelectedPlan}
                    checkoutMutation={checkoutMutation}
                    handleProceedToPayment={handleProceedToPayment}
                    setClaimStep={setClaimStep}
                  />
                )}

                {claimStep === 5 && (
                  <ClaimStep5
                    dentist={dentist}
                    queryClient={queryClient}
                    router={router}
                    onOpenChange={() => { }}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
