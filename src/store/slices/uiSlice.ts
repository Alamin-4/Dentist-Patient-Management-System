import { StateCreator } from "zustand";

export type AppModalType =
    | "signin"
    | "signup"
    | "personalize"
    | "compare"
    | "startBooking"
    | "booking"
    | null;

export interface UISlice {
    activeModal: AppModalType;
    compareModalPurpose: "compare" | "postBooking" | null;

    openModal: (modalType: AppModalType) => void;
    closeModal: () => void;
    setCompareModalPurpose: (purpose: "compare" | "postBooking" | null) => void;
}

export const createUISlice: StateCreator<UISlice> = (set) => ({
    activeModal: null,
    compareModalPurpose: "compare",

    openModal: (modalType) => set({ activeModal: modalType }),
    closeModal: () => set({ activeModal: null }),
    setCompareModalPurpose: (purpose) => set({ compareModalPurpose: purpose }),
});
