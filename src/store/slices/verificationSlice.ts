import { StateCreator } from "zustand";

export interface VerificationSlice {
    verificationStatus: "idle" | "match" | "no-match";
    verificationStep: number;
    verificationCompletedStep: number | null;
    verificationStepReady: Record<number, boolean>;

    setVerificationStatus: (status: "idle" | "match" | "no-match") => void;
    setVerificationStep: (step: number | ((prev: number) => number)) => void;
    setVerificationStepReady: (step: number, ready: boolean) => void;
    setVerificationCompletedStep: (step: number | null) => void;
    nextStep: () => void;
    prevStep: () => void;
}

export const createVerificationSlice: StateCreator<VerificationSlice> = (set) => ({
    verificationStatus: "idle",
    verificationStep: 1,
    verificationCompletedStep: null,
    verificationStepReady: { 1: false, 2: false, 3: false },

    setVerificationStatus: (status) => set({ verificationStatus: status }),

    setVerificationStep: (stepOrFn) => set((state) => {
        const next = typeof stepOrFn === "function" ? stepOrFn(state.verificationStep) : stepOrFn;
        if (next < 1 || next > 3) return {};

        // LocalStorage সিঙ্ক (পেজ রিফ্রেশ প্রটেকশন)
        if (typeof window !== "undefined") {
            localStorage.setItem("dentist_verification_step", String(next));
        }
        return { verificationStep: next };
    }),

    setVerificationStepReady: (step, ready) => set((state) => ({
        verificationStepReady: { ...state.verificationStepReady, [step]: ready }
    })),

    setVerificationCompletedStep: (step) => set({ verificationCompletedStep: step }),

    nextStep: () => set((state) => {
        const current = state.verificationStep;
        if (current >= 3) return {};

        if (typeof window !== "undefined") {
            localStorage.setItem("dentist_verification_step", String(current + 1));
        }
        return {
            verificationCompletedStep: current,
            verificationStep: current + 1,
        };
    }),

    prevStep: () => set((state) => {
        const current = state.verificationStep;
        if (current <= 1) return {};

        if (typeof window !== "undefined") {
            localStorage.setItem("dentist_verification_step", String(current - 1));
        }
        return { verificationStep: current - 1 };
    }),
});