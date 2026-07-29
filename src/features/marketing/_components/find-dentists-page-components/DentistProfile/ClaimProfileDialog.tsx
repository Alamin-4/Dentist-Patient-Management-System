"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, AlertCircle } from "lucide-react";
import { useMe, useOtpVerify, useResendOtp } from "@/hooks/auth/useAuth";
import { useGetMe } from "@/hooks/user/useUser";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  useClaimDentistDirectoryProfile,
  useCreateDirectoryCheckoutSession,
  useSendClaimOtp,
} from "@/hooks/dentist/useDentistDirectory";

import { ClaimStep1, ClaimStep2 } from "./ClaimSteps1To2";
import { ClaimStep3, ClaimStep4, ClaimStep5 } from "./ClaimSteps3To5";

interface ClaimProfileDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  dentist: any;
}

export default function ClaimProfileDialog({
  isOpen,
  onOpenChange,
  dentist,
}: ClaimProfileDialogProps) {
  const { user } = useMe();
  const { data: meResponse } = useGetMe({ enabled: !!user }) as any;
  const fullUser = meResponse?.data || meResponse;

  const router = useRouter();
  const queryClient = useQueryClient();

  const claimMutation = useClaimDentistDirectoryProfile();
  const checkoutMutation = useCreateDirectoryCheckoutSession();
  const sendClaimOtpMutation = useSendClaimOtp();
  const verifyOtpMutation = useOtpVerify();
  const resendOtpMutation = useResendOtp();

  const [claimStep, setClaimStep] = useState(1);
  const [claimEmail, setClaimEmail] = useState("");
  const [claimPassword, setClaimPassword] = useState("");
  const [claimOtp, setClaimOtp] = useState("");

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

  // Authentication & Role verification checks
  const isNotDentist = user && user.role !== "DENTIST";
  const alreadyClaimedDirectoryId = fullUser?.dentist?.dentistDirectoryId;
  const isProfileVerifiedAndPaid =
    fullUser?.dentist?.dentistDirectory?.status === "VERIFIED" ||
    !!fullUser?.dentist?.dentistDirectory?.membershipPaidAt ||
    dentist?.status === "VERIFIED" ||
    dentist?.verified;

  const hasAlreadyClaimedAnother = alreadyClaimedDirectoryId && alreadyClaimedDirectoryId !== dentist.id;
  const hasAlreadyClaimedThis = alreadyClaimedDirectoryId && alreadyClaimedDirectoryId === dentist.id && isProfileVerifiedAndPaid;
  const isClaimPendingPayment = alreadyClaimedDirectoryId && alreadyClaimedDirectoryId === dentist.id && !isProfileVerifiedAndPaid;

  useEffect(() => {
    if (isClaimPendingPayment && claimStep < 4) {
      setClaimStep(4);
    }
  }, [isClaimPendingPayment, claimStep]);

  // Clear messages when step changes to keep UI clean
  useEffect(() => {
    setError(null);
    setSuccessMessage(null);
  }, [claimStep]);

  useEffect(() => {
    if (user?.email && user.role === "DENTIST" && !alreadyClaimedDirectoryId) {
      setClaimEmail(user.email);
      if (claimStep < 3) {
        setClaimStep(3);
      }
    }
  }, [user, claimStep, alreadyClaimedDirectoryId]);

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
      { email: claimEmail, password: claimPassword, name: dentist.name },
      {
        onSuccess: () => {
          setSuccessMessage("OTP verification code sent. Please check your email.");
          setClaimStep(2);
        },
        onError: (err: any) => {
          const errMsg = err?.response?.data?.message || err?.message || "Failed to send OTP.";
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
        onError: (err: any) => {
          const errMsg = err?.response?.data?.message || err?.message || "Invalid OTP code.";
          setError(errMsg);
        },
      }
    );
  };

  const handleResendOtpCode = (options?: {
    onSuccess?: () => void;
    onError?: (err: any) => void;
  }) => {
    setError(null);
    setSuccessMessage(null);

    resendOtpMutation.mutate(
      { email: claimEmail },
      {
        onSuccess: () => {
          setSuccessMessage("Verification OTP resent to your email.");
          options?.onSuccess?.();
        },
        onError: (err: any) => {
          const errMsg = err?.response?.data?.message || err?.message || "Failed to resend OTP.";
          setError(errMsg);
          options?.onError?.(err);
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
          slug: dentist.slug,
          payload: {
            yearsOfExperience: Number(yearsOfExperience),
            motivation,
            internationalPatients: Number(internationalPatients),
            procedures: [dentist.specialty || "General Dentistry"],
            hasSterilizationDocs,
            hasBeforeAfterPhotos,
            hasMaterialsDocs,
            hasEducationCertificates,
            hasGuarantees,
          },
        },
        {
          onSuccess: (res: any) => {
            const directoryId = res?.data?.id;
            if (directoryId) setClaimedDirectoryId(directoryId);
            setSuccessMessage("Application saved! Please select your membership plan.");
            setClaimStep(4);
          },
          onError: (err: any) => {
            const errMsg = err?.response?.data?.message || err?.message || "Failed to save application.";
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

    const directoryId = claimedDirectoryId || dentist.id;
    if (!directoryId) {
      setError("Profile ID not found. Please try again.");
      return;
    }

    checkoutMutation.mutate(
      { dentistDirectoryId: directoryId, membershipPlan: selectedPlan },
      {
        onSuccess: (res: any) => {
          const checkoutUrl = res?.data?.url;
          if (checkoutUrl) {
            window.location.href = checkoutUrl;
          } else {
            setError("Failed to create checkout session. Please try again.");
          }
        },
        onError: (err: any) => {
          const errMsg = err?.response?.data?.message || err?.message || "Payment setup failed.";
          setError(errMsg);
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-135 max-h-[95vh] overflow-y-auto rounded-lg border-none p-8 gap-0 bg-white">
        <DialogHeader className="mb-6 text-left">
          <DialogTitle className="mb-2 text-2xl font-bold leading-tight text-text">
            Claim Dentist Profile
          </DialogTitle>
          <DialogDescription className="text-sm leading-snug text-sec-text">
            Verify your identity, select a premium plan, and start getting international patient leads.
          </DialogDescription>

          {/* Step Indicator */}
          {!isNotDentist && !hasAlreadyClaimedAnother && !hasAlreadyClaimedThis && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex items-center gap-1">
                  <div
                    className={`size-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${claimStep > s
                      ? "bg-badge text-white animate-scaleUp"
                      : claimStep === s
                        ? "bg-[#113254] text-white scale-110 ring-4 ring-[#113254]/15 font-extrabold"
                        : "bg-slate-50 border border-slate-200 text-slate-400"
                      }`}
                  >
                    {claimStep > s ? <Check className="size-3.5 stroke-3" /> : s}
                  </div>
                  {s < 4 && (
                    <div
                      className={`w-10 h-0.5 transition-colors duration-300 ${claimStep > s ? "bg-badge" : "bg-slate-200"
                        }`}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </DialogHeader>

        <div className="mt-2">
          {isNotDentist && (
            <div className="text-center py-6 space-y-4 animate-scaleUp">
              <div className="mx-auto size-14 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <AlertCircle className="size-8" />
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-slate-900">Dentist Account Required</h4>
                <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
                  You are currently logged in as a <strong>{user?.role?.toLowerCase()}</strong>. Only dental professionals can claim directory listings.
                </p>
                <p className="text-slate-400 text-xs max-w-sm mx-auto">
                  Please log out first, then click "Claim Profile" to sign up or log in with your Dentist credentials.
                </p>
              </div>
              <div className="pt-4 flex gap-3 justify-center border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="rounded-lg border border-[#E5E7EB] px-6 py-2.5 font-semibold text-slate-700 transition-colors hover:bg-slate-50 cursor-pointer text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {!isNotDentist && hasAlreadyClaimedAnother && (
            <div className="text-center py-6 space-y-4 animate-scaleUp">
              <div className="mx-auto size-14 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
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
              <div className="pt-4 flex gap-3 justify-center border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="rounded-lg border border-[#E5E7EB] px-6 py-2.5 font-semibold text-slate-700 transition-colors hover:bg-slate-50 cursor-pointer text-sm"
                >
                  Close
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
                  onClick={() => {
                    onOpenChange(false);
                    router.push("/dentist");
                  }}
                  className="rounded-lg bg-[#113254] px-6 py-2.5 font-semibold text-white transition-colors hover:bg-[#0d2844] cursor-pointer text-sm"
                >
                  Go to Dashboard →
                </button>
              </div>
            </div>
          )}

          {/* 4. Normal flow */}
          {!isNotDentist && !hasAlreadyClaimedAnother && !hasAlreadyClaimedThis && (
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
                  onOpenChange={onOpenChange}
                />
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
