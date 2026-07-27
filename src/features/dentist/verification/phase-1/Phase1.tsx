"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import LicenceForm from "./licence-form";
import { HeadshotUpload } from "./headshot-upload";
import { cn } from "@/lib/utils";
import PhaseStep from "../PhaseStep";
import { useStepOneMutation } from "@/hooks/dentist/useDentist";
import toast from "react-hot-toast";
import useVerificationProgress from "@/hooks/dentist/useStepProgress";
import { useVerificationStore } from "@/lib/hooks/verification-store-hooks";
import { VerificationResult } from "./match-found";
import { VerificationStatusScreen } from "../VerificationStatusScreen";
import { apiClient } from "@/api/client";
import z from "zod";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const [submittedLicence, setSubmittedLicence] =
    useState<SubmittedLicence | null>(null);

  const { checkLicenseVerifyProgress, step1Status, step1Note } = useVerificationProgress();
  const [headshotFile, setHeadshotFile] = useState<File | null>(null);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [submissionAttempted, setSubmissionAttempted] = useState(false);
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});

  const [verificationStatus, setVerificationStatus] = useState<
    "IDLE" | "VERIFYING" | "SUCCESS" | "FAILED"
  >("IDLE");

  const stepOneMutation = useStepOneMutation();

  const progressData = checkLicenseVerifyProgress?.data;

  // Form is re-enabled for PENDING and REJECTED (dentist can resubmit on rejection)
  const isFormLocked = step1Status === "SUBMITTED" || step1Status === "APPROVED";

  const serverSubmittedLicence = useMemo<SubmittedLicence | null>(() => {
    if (!progressData?.data) return null;
    const serverData = progressData.data as unknown as LicenseProgressData;
    if (!serverData.country) return null;
    return {
      country: serverData.country,
      city: serverData.city,
      authority: serverData.registrationAuthority || String(serverData.registration_authority || ""),
      regNo: serverData.registrationNumber || serverData.registration_no || "",
    };
  }, [progressData]);

  const handleVerify = useCallback(async (data: SubmittedLicence) => {
    setVerificationStatus("VERIFYING");
    setSubmittedLicence(data);
    try {
      await apiClient.dentists.verifyLicenseCheck({
        country: data.country,
        city: data.city,
        registrationAuthority: data.authority,
        registrationNumber: data.regNo,
      });
      setVerificationStatus("SUCCESS");
      toast.success("License matched and verified successfully via registry!");
    } catch {
      // The check endpoint returns 404 if not found in auto-registry; fall through to manual upload
      setVerificationStatus("FAILED");
    }
  }, []);

  const hasHeadshot = Boolean(
    headshotFile ||
    (progressData?.data as LicenseProgressData | undefined)
      ?.professional_headshot,
  );

  const isStepReady = useMemo(() => {
    if (isFormLocked) return true;

    // Must have registry verified OR manual copy uploaded, plus headshot
    const hasLicenseVerified =
      verificationStatus === "SUCCESS" ||
      (verificationStatus === "FAILED" && licenseFile !== null);

    return Boolean(submittedLicence && hasLicenseVerified && hasHeadshot);
  }, [isFormLocked, verificationStatus, licenseFile, submittedLicence, hasHeadshot]);

  // Fix: depend only on boolean isStepReady primitive to prevent re-render loop
  useEffect(() => {
    setVerificationStepReady(1, isStepReady);
  }, [isStepReady]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionAttempted(true);

    if (isFormLocked) {
      setVerificationStep(2);
      setVerificationCompletedStep(1);
      return;
    }

    if (!isStepReady || !submittedLicence || !headshotFile) {
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
          router.push("/dentist/verification?phase=operations-verify");
        },
        onError: (error: any) => {
          const resData = error?.response?.data;
          const newErrors: Record<string, string> = {};

          const field = resData?.errorDetails?.field || resData?.field;
          const msg = resData?.message || error?.message || "Something went wrong. Please try again.";
          if (field) {
            newErrors[field] = msg;
          }

          if (Array.isArray(resData?.errors)) {
            for (const errObj of resData.errors) {
              if (errObj.field) {
                newErrors[errObj.field] = errObj.message;
              }
            }
          }

          if (Array.isArray(resData?.errorDetails)) {
            for (const issue of resData.errorDetails) {
              const fieldName = issue.path?.[issue.path.length - 1];
              if (fieldName) {
                newErrors[fieldName] = issue.message;
              }
            }
          }

          if (
            Object.keys(newErrors).length === 0 &&
            (msg.toLowerCase().includes("5mb") || msg.toLowerCase().includes("file size is too large") || msg.toLowerCase().includes("multer"))
          ) {
            if (licenseFile && licenseFile.size > 5 * 1024 * 1024) {
              newErrors["licenseDocument"] = "File size is too large. Maximum allowed size is 5MB.";
            }
            if (headshotFile && headshotFile.size > 5 * 1024 * 1024) {
              newErrors["profilePicture"] = "File size is too large. Maximum allowed size is 5MB.";
            }
          }

          if (Object.keys(newErrors).length > 0) {
            setServerErrors(newErrors);
          } else {
            toast.error(msg);
          }
        },
      },
    );
  };

  // While waiting for admin review — show status screen only
  if (step1Status === "SUBMITTED") {
    return (
      <VerificationStatusScreen
        status="SUBMITTED"
        phaseName="License Verification"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Rejection banner */}
      {step1Status === "REJECTED" && (
        <VerificationStatusScreen
          status="REJECTED"
          phaseName="License Verification"
          rejectionNote={step1Note || undefined}
        />
      )}

      <div className="rounded-lg border border-border bg-card shadow-sm">
        <div className="grid gap-8 px-5 py-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)] lg:px-8 lg:py-8">
          <PhaseStep step={1} title="Verify your dental licence" />

          <div className="space-y-5">
            <LicenceForm
              onVerify={handleVerify}
              defaultValues={serverSubmittedLicence ?? submittedLicence}
              isFormLocked={isFormLocked}
              isVerifying={verificationStatus === "VERIFYING"}
              serverErrors={serverErrors}
              submissionAttempted={submissionAttempted}
            />
            {submissionAttempted && !submittedLicence && (
              <p className="text-xs font-semibold text-destructive mt-1">
                Please enter and verify your license registry details above first.
              </p>
            )}

            {verificationStatus === "SUCCESS" && submittedLicence && (
              <VerificationResult
                status="match"
                doctorName="Dr. Alex Carter"
                specialty="General Dentist"
                licenceInfo={{
                  country: submittedLicence.country,
                  city: submittedLicence.city,
                  authority: 1,
                  regNo: submittedLicence.regNo,
                }}
                onConfirm={() => toast.success("Confirmed!")}
                onReject={() => setVerificationStatus("FAILED")}
              />
            )}

            {verificationStatus === "FAILED" && (
              <VerificationResult
                status="no-match"
                onFileSelect={(file) => {
                  if (file && file.size > 5 * 1024 * 1024) {
                    setServerErrors((prev) => ({
                      ...prev,
                      licenseDocument: "File size is too large. Maximum allowed size is 5MB.",
                    }));
                    setLicenseFile(null);
                  } else {
                    setLicenseFile(file);
                    setServerErrors((prev) => ({ ...prev, licenseDocument: "" }));
                  }
                }}
                existingFileUrl={
                  (progressData?.data as LicenseProgressData | undefined)
                    ?.licenseDocument
                }
                error={
                  serverErrors.licenseDocument ||
                  (submissionAttempted && !licenseFile && !((progressData?.data as LicenseProgressData | undefined)?.licenseDocument)
                    ? "Registration Certificate is required."
                    : undefined)
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
                disabled={isFormLocked}
                onChange={(file) => {
                  if (file && file.size > 5 * 1024 * 1024) {
                    setServerErrors((prev) => ({
                      ...prev,
                      profilePicture: "File size is too large. Maximum allowed size is 5MB.",
                    }));
                    setHeadshotFile(null);
                  } else {
                    setHeadshotFile(file);
                    setServerErrors((prev) => ({ ...prev, profilePicture: "" }));
                  }
                }}
                existingImageUrl={
                  (progressData?.data as LicenseProgressData | undefined)
                    ?.professional_headshot
                }
                error={
                  serverErrors.profilePicture ||
                  (submissionAttempted && !hasHeadshot
                    ? "Professional headshot is required to continue."
                    : undefined)
                }
              />
              {(serverErrors.profilePicture || (submissionAttempted && !hasHeadshot)) && (
                <p className="text-xs font-semibold text-destructive mt-1">
                  {serverErrors.profilePicture || "Professional headshot is required to continue."}
                </p>
              )}
              <p
                className={cn(
                  "text-xs",
                  isStepReady ? "text-green-600" : "text-muted-foreground",
                )}
              >
                {isStepReady
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
