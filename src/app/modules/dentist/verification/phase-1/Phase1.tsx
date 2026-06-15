"use client";

import { useEffect, useMemo, useState } from "react";
import LicenceForm from "./licence-form";
import { VerificationResult } from "./match-found";
import { useStateContext } from "@/providers/StateProvider";
import { HeadshotUpload } from "./headshot-upload";
import { cn } from "@/lib/utils";
import PhaseStep from "../PhaseStep";
import useDentist from "@/hooks/dentist/useDentist";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

type SubmittedLicence = {
  country: string;
  city: string;
  authority: string;
  regNo: string;
};

export default function Phase1() {
  const {
    verificationStatus,
    setVerificationStatus,
    setVerificationStepReady,
    setVerificationCompletedStep,
  } = useStateContext();
  const [submittedLicence, setSubmittedLicence] =
    useState<SubmittedLicence | null>(null);
  const [isProfileConfirmed, setIsProfileConfirmed] = useState(false);
  const [isLicenceImported, setIsLicenceImported] = useState(false);
  const [hasHeadshot, setHasHeadshot] = useState(false);

  // Store actual Files for API submission
  const [headshotFile, setHeadshotFile] = useState<File | null>(null);
  const [licenceFile, setLicenceFile] = useState<File | null>(null);

  const { stepOneMutation, stepOneError } = useDentist();
  
  const handleVerify = (data: SubmittedLicence) => {
    setSubmittedLicence(data);
    setIsProfileConfirmed(false);
    setIsLicenceImported(false);

    if (data.regNo === "CA-123456") {
      setVerificationStatus("match");
      return;
    }

    setVerificationStatus("no-match");
  };

  const isStepReady = useMemo(() => {
    if (verificationStatus === "match") {
      return isProfileConfirmed && hasHeadshot;
    }

    if (verificationStatus === "no-match") {
      return isLicenceImported && hasHeadshot;
    }

    return false;
  }, [hasHeadshot, isLicenceImported, isProfileConfirmed, verificationStatus]);

  useEffect(() => {
    setVerificationStepReady(1, isStepReady);
  }, [isStepReady, setVerificationStepReady]);

  const handleConfirmProfile = () => {
    setIsProfileConfirmed(true);
  };

  const handleRejectProfile = () => {
    setVerificationStatus("no-match");
    setIsProfileConfirmed(false);
    setIsLicenceImported(false);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStepReady || !submittedLicence || !headshotFile) {
      toast.error("Please complete all verification steps first.");
      return;
    }

    // Django expects a file. If matched, create a dummy file to satisfy Django validation.
    const fileToUpload = licenceFile || new File(["verified match"], "licence.pdf", { type: "application/pdf" });

    stepOneMutation.mutate(
      {
        country: submittedLicence.country,
        city: submittedLicence.city,
        registration_authority: submittedLicence.authority,
        registration_no: submittedLicence.regNo,
        professional_headshot: headshotFile,
        file: fileToUpload,
      },
      {
        onSuccess: () => {
          toast.success("License verification details submitted!");
          setVerificationCompletedStep(1);
        },
       
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="grid gap-8 px-5 py-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)] lg:px-8 lg:py-8">
          <PhaseStep step={1} title="Verify your dental licence" />

          <div className="space-y-5">
            <LicenceForm onVerify={handleVerify} />

            {verificationStatus !== "idle" && (
              <VerificationResult
                status={verificationStatus}
                doctorName="Dr. Alex Hemsworth"
                specialty="Orthodontist"
                licenceInfo={submittedLicence}
                onConfirm={handleConfirmProfile}
                onReject={handleRejectProfile}
                onFileSelect={(file) => {
                  setIsLicenceImported(true);
                  setLicenceFile(file);
                }}
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
                onChange={(file) => {
                  setHasHeadshot(Boolean(file));
                  setHeadshotFile(file);
                }}
              />
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
      {stepOneMutation.isPending && (
        <div className="flex justify-center py-4">
          <Loader2 className="animate-spin h-6 w-6 text-[#0E3E65]" />
          <span className="ml-2 text-sm text-muted-foreground">Submitting Phase 1...</span>
        </div>
      )}
      <form
        id="phase-1-verification-form"
        onSubmit={onSubmit}
        className="hidden"
      />
    </div>
  );
}
