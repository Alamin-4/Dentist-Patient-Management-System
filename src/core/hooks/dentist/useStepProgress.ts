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
    // `enabled` must be identical between the server render and the client's
    // first (hydration) render, or React throws a hydration mismatch. Gating
    // on a `mounted` flag flipped in an effect (instead of `typeof window`,
    // which is already true during the client's hydration pass) keeps both
    // renders in sync; the queries simply start one tick later on the client.
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

    // A step counts as "submitted" for badge/display purposes when SUBMITTED or APPROVED
    const submittedByStep: Record<VerificationPhaseStep, boolean> = useMemo(() => ({
        1: step1Status === "SUBMITTED" || step1Status === "APPROVED",
        2: step2Status === "SUBMITTED" || step2Status === "APPROVED",
        3: step3Status === "SUBMITTED" || step3Status === "APPROVED",
    }), [step1Status, step2Status, step3Status]);

    // Access to the next step only unlocks when the previous step is APPROVED
    const canAccessStep = (step: VerificationPhaseStep): boolean => {
        if (step === 1) return true;
        if (step === 2) return step1Status === "APPROVED";
        return step2Status === "APPROVED";
    };


    // The next incomplete step is the first step that hasn't been APPROVED yet
    const nextIncompleteStep: VerificationPhaseStep = step1Status !== "APPROVED"
        ? 1
        : step2Status !== "APPROVED"
            ? 2
            : 3;

    const rdvScore = (Object.entries(submittedByStep) as [string, boolean][])
        .reduce((score, [step, submitted]) => {
            if (!submitted) return score;
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
