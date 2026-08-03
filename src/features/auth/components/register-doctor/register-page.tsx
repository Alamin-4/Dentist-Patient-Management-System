"use client";

import { ArrowLeft } from "lucide-react";
import { RegisterPageSkeleton } from "@/components/skeletons/RegisterPageSkeleton";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

import { CreateAccountForm } from "./create-account";
import { VerifyOtpForm } from "./verify-otp-form";
import { ProfessionalDetailsForm } from "./professional-details-form";
import { ProfileSuccessState } from "./ProfileSuccessRate";
import { useMe } from "@/hooks/auth/useAuth";
import { useDentistProfileQuery } from "@/hooks/dentist/useDentist";

import CustomSectionHeading from "@/features/shared/custom-section-heading";
import CustomDesText from "@/features/shared/custom-des-text";

export default function RegisterPageComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const dentistParam = searchParams.get("dentist");

  const { user, isFetched: isSessionFetched } = useMe();
  const { data: dentistProfileResponse, isFetched: isProfileFetched } = useDentistProfileQuery({
    enabled: !!user && user.role === "DENTIST",
  });

  const dentistProfile =
    dentistProfileResponse?.data?.dentist ||
    dentistProfileResponse?.data ||
    dentistProfileResponse;

  const [step, setStep] = useState<"create-account" | "verify-email" | "professional-info" | "success">(() => {
    if (dentistParam === "success") return "success";
    if (dentistParam === "professional-info") return "professional-info";
    if (dentistParam === "verify-email") return "verify-email";
    return "create-account";
  });

  const registerEmail =
    user?.email ||
    (typeof window !== "undefined" ? localStorage.getItem("registerEmail") : null) ||
    "";

  const handleStepChange = (
    nextStep: "create-account" | "verify-email" | "professional-info" | "success"
  ) => {
    setStep(nextStep);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `${pathname}?dentist=${nextStep}`);
    }
  };

  useEffect(() => {
    if (isSessionFetched && user) {
      if (user.role === "PATIENT") {
        router.replace("/patient");
      } else if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
        router.replace("/admin");
      } else if (user.role === "DENTIST" && isProfileFetched) {
        const hasCompletedProfessionalDetails = !!(
          dentistProfile?.specialtyId ||
          dentistProfile?.specialty ||
          dentistProfile?.dentistProfessionalData
        );

        if (hasCompletedProfessionalDetails) {
          router.replace("/dentist");
        } else if (user.emailVerified && step === "create-account") {
          handleStepChange("professional-info");
        }
      }
    }
  }, [user, isSessionFetched, isProfileFetched, dentistProfile, router]);

  const isInitialLoading = !isSessionFetched || (!!user && user.role === "DENTIST" && !isProfileFetched);

  if (isInitialLoading) {
    return <RegisterPageSkeleton />;
  }

  const getFormMaxWidth = () => {
    switch (step) {
      case "create-account":
      case "professional-info":
        return "max-w-xl";
      case "verify-email":
      case "success":
      default:
        return "max-w-sm";
    }
  };

  return (
    <main className="flex min-h-dvh w-full flex-col lg:flex-row bg-white">
      <section className="relative hidden w-full flex-col bg-primary p-6 xl:p-10 text-white lg:flex lg:w-3/5">
        <div className="flex items-center gap-2">
          <div>
            <Image
              src={"/logos/whitelogo.png"}
              alt="Website logo"
              height={200}
              width={400}
              className="w-43 h-auto object-contain"
            />
          </div>
        </div>

        <div className="flex flex-1 items-center">
          <h1 className="max-w-xl w-full text-2xl md:text-3xl lg:text-[40px] font-semibold leading-[1.3] tracking-tight">
            Sign in to manage your community activities and stay connected with
            members.
          </h1>
        </div>
      </section>

      <section className="flex flex-col items-center justify-center w-full min-h-dvh px-4 py-4 md:px-6 md:py-6 lg:w-2/5 mx-auto">
        <div className={`w-full ${getFormMaxWidth()} transition-all duration-300 mx-auto`}>
          {step !== "success" && (
            <div className="flex flex-col items-start gap-3 md:gap-4 mb-5 w-full">
              <button
                type="button"
                onClick={() => {
                  if (step === "verify-email") {
                    handleStepChange("create-account");
                  } else if (step === "professional-info") {
                    handleStepChange("verify-email");
                  } else {
                    router.back();
                  }
                }}
                className="flex items-center gap-2 text-xs md:text-sm font-medium text-sec-text hover:text-text transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>

              {step === "create-account" && (
                <CustomSectionHeading value="Create an Account" />
              )}

              {step === "professional-info" && (
                <CustomSectionHeading value="Enter your Professional Details" />
              )}
            </div>
          )}

          <div className="w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="w-full"
              >
                {step === "verify-email" && (
                  <div className="space-y-2 mb-5 text-center w-full">
                    <CustomSectionHeading value="Check your inbox!" center_align={true} />
                    <CustomDesText value={`We've sent you a temporary 6-digit verification code to ${registerEmail || ""}.`} center_align={true} />
                  </div>
                )}

                {step === "create-account" && <CreateAccountForm setStep={handleStepChange} />}
                {step === "verify-email" && <VerifyOtpForm setStep={handleStepChange} />}
                {step === "professional-info" && <ProfessionalDetailsForm setStep={handleStepChange} />}
                {step === "success" && <ProfileSuccessState />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
    </main>
  );
}
