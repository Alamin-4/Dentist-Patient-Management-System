import { apiClient } from "@/api/client";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useMemo } from "react";

export type StepStatus = "PENDING" | "SUBMITTED" | "APPROVED" | "REJECTED";

export interface StepCheckResponse {
    submitted: boolean;
    status: StepStatus | null;
    note?: string | null;
    data?: Record<string, unknown>;
}

export type VerificationPhaseStep = 1 | 2 | 3;

const RDV_SCORE_BY_STEP: Record<VerificationPhaseStep, number> = {
    1: 30,
    2: 40,
    3: 30,
};

export default function useVerificationProgress() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const progressQuery = useQuery({
        queryKey: ["dentistVerificationProgress"],
        queryFn: () => apiClient.dentists.getProgress(),
        enabled: mounted,
        staleTime: 60_000,
        retry: false,
    });

    const progressData = progressQuery.data?.data;

    const checkLicenseVerifyProgress = useMemo(() => ({
        data: progressData ? {
            submitted: progressData.step_one_status === "SUBMITTED" || progressData.step_one_status === "APPROVED",
            status: progressData.step_one_status || "PENDING",
            note: progressData.step_one_note || null,
            data: progressData.dentistLicense || {
                country: "Bangladesh",
                city: "Dhaka",
                registration_authority: 1,
                registration_no: "",
            }
        } : undefined,
        isLoading: progressQuery.isLoading,
        isError: progressQuery.isError,
        error: progressQuery.error,
        refetch: progressQuery.refetch,
    }), [progressData, progressQuery.isLoading, progressQuery.isError, progressQuery.error, progressQuery.refetch]);

    const checkPhotoVerifyProgress = useMemo(() => ({
        data: progressData ? {
            submitted: progressData.step_two_status === "SUBMITTED" || progressData.step_two_status === "APPROVED",
            status: progressData.step_two_status || "PENDING",
            note: progressData.step_two_note || null,
            data: progressData.dentistOperations
                ? {
                    signer_name: progressData.dentistOperations.signerName,
                    accepted_terms: progressData.dentistOperations.agreedToGuarantee,
                    jci_certificate: progressData.dentistOperations.jciCertificate,
                    walkthrough_video: progressData.dentistOperations.walkthroughVideo,
                }
                : {},
        } : undefined,
        isLoading: progressQuery.isLoading,
        isError: progressQuery.isError,
        error: progressQuery.error,
        refetch: progressQuery.refetch,
    }), [progressData, progressQuery.isLoading, progressQuery.isError, progressQuery.error, progressQuery.refetch]);

    const checkIdVerifyProgress = useMemo(() => ({
        data: progressData ? {
            submitted: progressData.step_three_status === "SUBMITTED" || progressData.step_three_status === "APPROVED",
            status: progressData.step_three_status || "PENDING",
            note: progressData.step_three_note || null,
            data: {
                materials: [],
                clinic_address: progressData.prefilled_clinic_address || ""
            }
        } : undefined,
        isLoading: progressQuery.isLoading,
        isError: progressQuery.isError,
        error: progressQuery.error,
        refetch: progressQuery.refetch,
    }), [progressData, progressQuery.isLoading, progressQuery.isError, progressQuery.error, progressQuery.refetch]);

    const step1Status = checkLicenseVerifyProgress.data?.status ?? "PENDING";
    const step2Status = checkPhotoVerifyProgress.data?.status ?? "PENDING";
    const step3Status = checkIdVerifyProgress.data?.status ?? "PENDING";

    const step1Note = checkLicenseVerifyProgress.data?.note ?? null;
    const step2Note = checkPhotoVerifyProgress.data?.note ?? null;
    const step3Note = checkIdVerifyProgress.data?.note ?? null;

    const submittedByStep: Record<VerificationPhaseStep, boolean> = useMemo(() => ({
        1: step1Status === "SUBMITTED" || step1Status === "APPROVED",
        2: step2Status === "SUBMITTED" || step2Status === "APPROVED",
        3: step3Status === "SUBMITTED" || step3Status === "APPROVED",
    }), [step1Status, step2Status, step3Status]);

    const canAccessStep = (step: VerificationPhaseStep): boolean => {
        if (step === 1) return true;
        if (step === 2) return step1Status === "APPROVED" || submittedByStep[1];
        return step2Status === "APPROVED" || submittedByStep[2];
    };

    // Helper to check if a step is submitted or approved
    const isStepFilled = (status: StepStatus) => status === "SUBMITTED" || status === "APPROVED";

    // Next step to action: prioritize REJECTED step first, then first PENDING step
    const nextIncompleteStep: VerificationPhaseStep = useMemo(() => {
        if (step1Status === "REJECTED") return 1;
        if (step2Status === "REJECTED") return 2;
        if (step3Status === "REJECTED") return 3;

        if (!isStepFilled(step1Status)) return 1;
        if (!isStepFilled(step2Status)) return 2;
        if (!isStepFilled(step3Status)) return 3;

        return 3;
    }, [step1Status, step2Status, step3Status]);

    const allSubmittedOrApproved = useMemo(() => {
        return isStepFilled(step1Status) && isStepFilled(step2Status) && isStepFilled(step3Status);
    }, [step1Status, step2Status, step3Status]);

    const allApproved = useMemo(() => {
        return step1Status === "APPROVED" && step2Status === "APPROVED" && step3Status === "APPROVED";
    }, [step1Status, step2Status, step3Status]);

    const approvedByStep: Record<VerificationPhaseStep, boolean> = useMemo(() => ({
        1: step1Status === "APPROVED",
        2: step2Status === "APPROVED",
        3: step3Status === "APPROVED",
    }), [step1Status, step2Status, step3Status]);

    const rdvScore = (Object.entries(approvedByStep) as [string, boolean][])
        .reduce((score, [step, approved]) => {
            if (!approved) return score;
            return score + RDV_SCORE_BY_STEP[Number(step) as VerificationPhaseStep];
        }, 0);

    return {
        checkLicenseVerifyProgress,
        checkPhotoVerifyProgress,
        checkIdVerifyProgress,
        step1Status,
        step2Status,
        step3Status,
        step1Note,
        step2Note,
        step3Note,
        submittedByStep,
        nextIncompleteStep,
        allSubmittedOrApproved,
        allApproved,
        rdvScore,
        canAccessStep,
        isProgressLoading:
            checkLicenseVerifyProgress.isLoading ||
            checkPhotoVerifyProgress.isLoading ||
            checkIdVerifyProgress.isLoading,
        isProgressError:
            checkLicenseVerifyProgress.isError ||
            checkPhotoVerifyProgress.isError ||
            checkIdVerifyProgress.isError,
    };
}
