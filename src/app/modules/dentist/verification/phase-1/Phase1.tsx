"use client";

import { useEffect, useMemo, useState } from "react";
import LicenceForm from "./licence-form";
import { HeadshotUpload } from "./headshot-upload";
import { cn } from "@/lib/utils";
import PhaseStep from "../PhaseStep";
import useDentist from "@/hooks/dentist/useDentist";
import toast from "react-hot-toast";
import useVerificationProgress from "@/hooks/dentist/useStepProgress";
import { useVerificationStore } from "@/lib/hooks/verification-store-hooks";
import { VerificationResult } from "./match-found";
import z from "zod";

export const SubmittedLicenceSchema = z.object({
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  authority: z.string().min(1, "Registration authority is required"),
  regNo: z.string().min(1, "Registration number is required"),
});

export type SubmittedLicence = z.infer<typeof SubmittedLicenceSchema>;

export interface LicenseProgressData {
  country: string;
  city: string;
  registration_authority?: string | number;
  registrationAuthority?: string;
  registration_no?: string;
  registrationNumber?: string;
  professional_headshot?: string;
  licenseDocument?: string;
}

export default function Phase1() {
  const {
    setVerificationStepReady,
    setVerificationCompletedStep,
    setVerificationStep,
  } = useVerificationStore();

  const [submittedLicence, setSubmittedLicence] =
    useState<SubmittedLicence | null>(null);

  const { checkLicenseVerifyProgress } = useVerificationProgress();
  const [headshotFile, setHeadshotFile] = useState<File | null>(null);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);

  const [verificationStatus, setVerificationStatus] = useState<
    "IDLE" | "VERIFYING" | "SUCCESS" | "FAILED"
  >("IDLE");

  const { stepOneMutation } = useDentist();

  const progressData = checkLicenseVerifyProgress?.data;
  const isAlreadySubmitted = progressData?.submitted === true;

  const serverSubmittedLicence = useMemo<SubmittedLicence | null>(() => {
    if (progressData?.submitted !== true || !progressData.data) {
      return null;
    }

    const serverData = progressData.data as unknown as LicenseProgressData;
    return {
      country: serverData.country,
      city: serverData.city,
      authority: serverData.registrationAuthority || String(serverData.registration_authority || ""),
      regNo: serverData.registrationNumber || serverData.registration_no || "",
    };
  }, [progressData]);

  const handleVerify = (data: SubmittedLicence) => {
    setVerificationStatus("VERIFYING");
    setTimeout(() => {
      setSubmittedLicence(data);
      if (data.regNo === "12345") {
        setVerificationStatus("SUCCESS");
        toast.success("License matched and verified successfully via registry!");
      } else {
        setVerificationStatus("FAILED");
        toast.error("License not found in official registry. Please upload manual copy.");
      }
    }, 1500);
  };

  const hasHeadshot = Boolean(
    headshotFile ||
    (progressData?.data as LicenseProgressData | undefined)
      ?.professional_headshot,
  );

  const isStepReady = useMemo(() => {
    if (isAlreadySubmitted) return true;

    // Must have registry verified OR manual copy uploaded, plus headshot
    const hasLicenseVerified =
      verificationStatus === "SUCCESS" ||
      (verificationStatus === "FAILED" && licenseFile !== null);

    return Boolean(submittedLicence && hasLicenseVerified && hasHeadshot);
  }, [isAlreadySubmitted, verificationStatus, licenseFile, submittedLicence, hasHeadshot]);

  useEffect(() => {
    setVerificationStepReady(1, isStepReady);
  }, [isStepReady, setVerificationStepReady]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isAlreadySubmitted) {
      setVerificationStep(2);
      setVerificationCompletedStep(1);
      return;
    }

    if (!isStepReady || !submittedLicence || !headshotFile) {
      toast.error("Please complete all verification steps first.");
      return;
    }

    // If verified automatically, generate dummy license PDF; otherwise, use manual file
    const fileToUpload =
      licenseFile ||
      new File(["verified match"], "license.pdf", {
        type: "application/pdf",
      });

    stepOneMutation.mutate(
      {
        country: submittedLicence.country,
        city: submittedLicence.city,
        registrationAuthority: submittedLicence.authority,
        registrationNumber: submittedLicence.regNo,
        profilePicture: headshotFile,
        licenseDocument: fileToUpload,
      },
      {
        onSuccess: () => {
          toast.success("License verification details submitted!");
          setVerificationCompletedStep(1);
          setVerificationStep(2);
        },
        onError: (error: unknown) => {
          const backendError =
            typeof error === "object" && error !== null
              ? ((
                error as {
                  response?: { data?: { detail?: { error?: string } } };
                  message?: string;
                }
              ).response?.data?.detail?.error ??
                (error as { message?: string }).message)
              : undefined;
          toast.error(
            backendError || "Something went wrong. Please try again.",
          );
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="grid gap-8 px-5 py-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)] lg:px-8 lg:py-8">
          <PhaseStep step={1} title="Verify your dental licence" />

          <div className="space-y-5">
            <LicenceForm
              onVerify={handleVerify}
              defaultValues={
                isAlreadySubmitted
                  ? (serverSubmittedLicence ?? submittedLicence)
                  : undefined
              }
              isAlreadySubmitted={isAlreadySubmitted}
              isVerifying={verificationStatus === "VERIFYING"}
            />

            {verificationStatus === "SUCCESS" && submittedLicence && (
              <VerificationResult
                status="match"
                doctorName="Dr. Alex Carter"
                specialty="General Dentist"
                licenceInfo={{
                  country: submittedLicence.country,
                  city: submittedLicence.city,
                  authority: 1, // mock number
                  regNo: submittedLicence.regNo,
                }}
                onConfirm={() => toast.success("Confirmed!")}
                onReject={() => setVerificationStatus("FAILED")}
              />
            )}

            {verificationStatus === "FAILED" && (
              <VerificationResult
                status="no-match"
                onFileSelect={(file) => setLicenseFile(file)}
                existingFileUrl={
                  (progressData?.data as LicenseProgressData | undefined)
                    ?.licenseDocument
                }
              />
            )}
          </div>
        </div>

        <div className="border-t border-border">
          <div className="grid gap-8 px-5 py-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)] lg:px-8 lg:py-8">
            <PhaseStep step={2} title="Upload your professional headshot" />

            <div className="space-y-4">
              <p className="text-sm font-semibold text-foreground">
                Professional headshot
              </p>
              <HeadshotUpload
                disabled={isAlreadySubmitted}
                onChange={(file) => {
                  setHeadshotFile(file);
                }}
                existingImageUrl={
                  (progressData?.data as LicenseProgressData | undefined)
                    ?.professional_headshot
                }
              />
              <p
                className={cn(
                  "text-xs",
                  isStepReady ? "text-green-600" : "text-muted-foreground",
                )}
              >
                {isAlreadySubmitted
                  ? "This phase has been successfully submitted and is under review."
                  : isStepReady
                    ? "Phase 1 is ready to complete."
                    : "Complete the verification or upload flow and add your headshot to continue."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <form
        id="phase-1-verification-form"
        onSubmit={onSubmit}
        className="hidden"
      />
    </div>
  );
}
