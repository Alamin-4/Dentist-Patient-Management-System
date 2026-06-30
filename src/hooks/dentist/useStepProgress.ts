import { apiClient } from "@/api/client";
import { useQuery } from "@tanstack/react-query";

export type StepStatus = "PENDING" | "SUBMITTED" | "APPROVED" | "REJECTED";

export interface StepCheckResponse {
    submitted: boolean;
    status: StepStatus | null;
    data?: Record<string, unknown>;
}

export type VerificationPhaseStep = 1 | 2 | 3;

const RDV_SCORE_BY_STEP: Record<VerificationPhaseStep, number> = {
    1: 30,
    2: 40,
    3: 30,
};

export default function useVerificationProgress() {
    const checkLicenseVerifyProgress = useQuery<StepCheckResponse>({
        queryKey: ["licenseVerifyProgress"],
        queryFn: () =>
            apiClient.dentists.stepOneCheck()
                .then((res) => (res?.data as StepCheckResponse) || { submitted: false, status: null })
                .catch(() => ({ submitted: false, status: null })),
        enabled: typeof window !== "undefined",
        staleTime: 60_000,
        retry: false,
    });

    const checkPhotoVerifyProgress = useQuery<StepCheckResponse>({
        queryKey: ["photoVerifyProgress"],
        queryFn: () =>
            apiClient.dentists.stepTwoCheck()
                .then((res) => (res?.data as StepCheckResponse) || { submitted: false, status: null })
                .catch(() => ({ submitted: false, status: null })),
        enabled: typeof window !== "undefined",
        staleTime: 60_000,
        retry: false,
    });

    const checkIdVerifyProgress = useQuery<StepCheckResponse>({
        queryKey: ["idVerifyProgress"],
        queryFn: () =>
            apiClient.dentists.stepThreeCheck()
                .then((res) => (res?.data as StepCheckResponse) || { submitted: false, status: null })
                .catch(() => ({ submitted: false, status: null })),
        enabled: typeof window !== "undefined",
        staleTime: 60_000,
        retry: false,
    });

    const step1Status = checkLicenseVerifyProgress.data?.status ?? "PENDING";
    const step2Status = checkPhotoVerifyProgress.data?.status ?? "PENDING";
    const step3Status = checkIdVerifyProgress.data?.status ?? "PENDING";

    // A step counts as "submitted" for badge/display purposes when SUBMITTED or APPROVED
    const submittedByStep: Record<VerificationPhaseStep, boolean> = {
        1: step1Status === "SUBMITTED" || step1Status === "APPROVED",
        2: step2Status === "SUBMITTED" || step2Status === "APPROVED",
        3: step3Status === "SUBMITTED" || step3Status === "APPROVED",
    };

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
