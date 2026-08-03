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

  const [submittedLicence, setSubmittedLicence] = useState<SubmittedLicence | null>(null);
  const { checkLicenseVerifyProgress, step1Status, step1Note } = useVerificationProgress();

  const [headshotFile, setHeadshotFile] = useState<File | null>(null);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [submissionAttempted, setSubmissionAttempted] = useState(false);
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});

  const [verificationStatus, setVerificationStatus] = useState<"IDLE" | "VERIFYING" | "SUCCESS" | "FAILED">("IDLE");
  const stepOneMutation = useStepOneMutation();
  const progressData = checkLicenseVerifyProgress?.data;

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
    console.log("🔍 Starting verification for:", data);
    setVerificationStatus("VERIFYING");
    setSubmittedLicence(data);
    setServerErrors({});

    try {
      const response = await apiClient.dentists.verifyLicenseCheck({
        country: data.country,
        city: data.city,
        registrationAuthority: data.authority,
        registrationNumber: data.regNo,
      });

      const resData = response?.data || response;
      console.log("✅ Verification Response:", resData);

      if (resData?.success === false) {
        setVerificationStatus("FAILED");
        return;
      }

      console.log("🎉 Verification SUCCESS");
      setVerificationStatus("SUCCESS");
      toast.success("License matched and verified successfully via registry!");

    } catch (error: any) {
      console.warn("ℹ️ Verification API registry check note:", error?.message || error);
      const status = error?.response?.status || error?.statusCode || error?.status;
      const errMsg = error?.response?.data?.message || error?.message || "";

      if (status === 409 || errMsg.toLowerCase().includes("already") || errMsg.toLowerCase().includes("conflict")) {
        const conflictMsg = "This license registration number is already verified by another account.";
        setServerErrors({ regNo: conflictMsg });
        setVerificationStatus("IDLE"); // Keep IDLE so PDF upload box is NOT shown!
        // toast.error(conflictMsg);
      } else {
        // Not registered -> switch to manual PDF upload state cleanly
        setServerErrors({});
        setVerificationStatus("FAILED");
      }
    }
  }, []);

  const handleFormChange = useCallback(() => {
    if (verificationStatus !== "IDLE") {
      setVerificationStatus("IDLE");
      setSubmittedLicence(null);
      setLicenseFile(null);
      setServerErrors({});
    }
  }, [verificationStatus]);

  const hasHeadshot = Boolean(
    headshotFile || (progressData?.data as LicenseProgressData | undefined)?.professional_headshot
  );

  const isStepReady = useMemo(() => {
    if (isFormLocked) return true;
    if (serverErrors.licenseDocument || serverErrors.profilePicture) return false;

    const hasLicenseVerified =
      verificationStatus === "SUCCESS" ||
      (verificationStatus === "FAILED" && licenseFile !== null);

    return Boolean(submittedLicence && hasLicenseVerified && hasHeadshot);
  }, [isFormLocked, verificationStatus, licenseFile, submittedLicence, hasHeadshot, serverErrors]);

  useEffect(() => {
    setVerificationStepReady(1, isStepReady);
  }, [isStepReady, setVerificationStepReady]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionAttempted(true);

    if (stepOneMutation.isPending) return;

    if (isFormLocked) {
      setVerificationStep(2);
      setVerificationCompletedStep(1);
      return;
    }

    if (!isStepReady || !submittedLicence || !headshotFile) {
      return;
    }

    setServerErrors({});

    if (licenseFile && licenseFile.size > 5 * 1024 * 1024) {
      const sizeMB = (licenseFile.size / (1024 * 1024)).toFixed(2);
      const msg = `License document file size (${sizeMB} MB) exceeds the 5MB limit. Please choose a smaller file.`;
      setServerErrors({ licenseDocument: msg });
      return;
    }

    if (headshotFile && headshotFile.size > 5 * 1024 * 1024) {
      const sizeMB = (headshotFile.size / (1024 * 1024)).toFixed(2);
      const msg = `Profile picture file size (${sizeMB} MB) exceeds the 5MB limit. Please choose a smaller file.`;
      setServerErrors({ profilePicture: msg });
      return;
    }

    const fileToUpload =
      licenseFile ||
      new File(["verified match"], "license.pdf", { type: "application/pdf" });

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

          const normalizeField = (field: string) => {
            if (field === "registrationNumber") return "regNo";
            if (field === "registrationAuthority") return "authority";
            if (field === "profilePicture" || field === "headshot") return "profilePicture";
            if (field === "licenseDocument" || field === "license") return "licenseDocument";
            return field;
          };

          if (resData?.path && resData?.message) {
            const fieldName = Array.isArray(resData.path) ? resData.path[resData.path.length - 1] : resData.path;
            newErrors[normalizeField(fieldName)] = resData.message;
          }

          if (Array.isArray(resData?.errorDetails)) {
            resData.errorDetails.forEach((err: any) => {
              if (err.path && err.message) {
                const fieldName = Array.isArray(err.path) ? err.path[err.path.length - 1] : err.path;
                newErrors[normalizeField(fieldName)] = err.message;
              }
            });
          }

          if (Array.isArray(resData?.errors)) {
            resData.errors.forEach((err: any) => {
              if (err.field && err.message) {
                newErrors[normalizeField(err.field)] = err.message;
              }
            });
          }

          if (Object.keys(newErrors).length === 0) {
            const msg = resData?.message || error?.message || "Something went wrong. Please try again.";
            if (
              msg.toLowerCase().includes("5mb") ||
              msg.toLowerCase().includes("file size") ||
              msg.toLowerCase().includes("too large") ||
              msg.toLowerCase().includes("large entity") ||
              msg.toLowerCase().includes("multer")
            ) {
              if (licenseFile) {
                newErrors["licenseDocument"] = msg;
              }
              if (headshotFile) {
                newErrors["profilePicture"] = msg;
              }
            }
          }

          if (Object.keys(newErrors).length > 0) {
            setServerErrors(newErrors);
          } else {
            // toast.error(resData?.message || error?.message || "Something went wrong. Please try again.");
          }
        },
      }
    );
  };

  if (step1Status === "SUBMITTED") {
    return <VerificationStatusScreen status="SUBMITTED" phaseName="License Verification" />;
  }

  // 🚨 DEBUG: Check console to see if this is actually "FAILED"
  console.log("📊 Current verificationStatus:", verificationStatus);

  return (
    <div className="space-y-6">
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
              onFormChange={handleFormChange}
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
                  authority: submittedLicence.authority,
                  regNo: submittedLicence.regNo,
                }}
                onConfirm={() => toast.success("Confirmed!")}
                onReject={() => setVerificationStatus("FAILED")}
              />
            )}

            {/* 🚨 THIS IS THE BLOCK THAT MUST SHOW */}
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
                    setServerErrors((prev) => ({ ...prev, licenseDocument: "", regNo: "", authority: "" }));
                  }
                }}
                existingFileUrl={(progressData?.data as LicenseProgressData | undefined)?.licenseDocument}
                error={
                  serverErrors.licenseDocument ||
                  (submissionAttempted && !licenseFile && !(progressData?.data as LicenseProgressData | undefined)?.licenseDocument
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
              <p className="text-sm font-semibold text-foreground">Professional headshot</p>
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
                existingImageUrl={(progressData?.data as LicenseProgressData | undefined)?.professional_headshot}
                error={
                  serverErrors.profilePicture ||
                  (submissionAttempted && !hasHeadshot ? "Professional headshot is required to continue." : undefined)
                }
              />
              {(serverErrors.profilePicture || (submissionAttempted && !hasHeadshot)) && (
                <p className="text-xs font-semibold text-destructive mt-1">
                  {serverErrors.profilePicture || "Professional headshot is required to continue."}
                </p>
              )}
              <p className={cn("text-xs", isStepReady ? "text-green-600" : "text-muted-foreground")}>
                {isStepReady
                  ? "Phase 1 is ready to complete."
                  : "Complete the verification or upload flow and add your headshot to continue."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <form id="phase-1-verification-form" onSubmit={onSubmit} className="hidden" />
    </div>
  );
}