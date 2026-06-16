import { StateCreator } from "zustand";
import type { Dentist } from "@/app/(marketing)/_components/module/DentistAllComponents/types";

export interface DataSlice {
    selectedDentistId: string | null;
    schedule: boolean;
    activeTab: string;
    dentistsToCompare: Dentist[];
    searchQuery: string;
    isNewestFirst: boolean;

    setSelectedDentistId: (id: string | null) => void;
    setSchedule: (schedule: boolean) => void;
    setActiveTab: (tab: string) => void;
    setDentistsToCompare: (dentists: Dentist[] | ((prev: Dentist[]) => Dentist[])) => void;
    setSearchQuery: (query: string) => void;
    setIsNewestFirst: (isNewest: boolean | ((prev: boolean) => boolean)) => void;
}

export const createDataSlice: StateCreator<DataSlice> = (set) => ({
    selectedDentistId: null,
    schedule: false,
    activeTab: "",
    dentistsToCompare: [],
    searchQuery: "",
    isNewestFirst: true,

    setSelectedDentistId: (id) => set({ selectedDentistId: id }),
    setSchedule: (schedule) => set({ schedule }),
    setActiveTab: (tab) => set({ activeTab: tab }),
    setDentistsToCompare: (dentistsOrFn) => set((state) => ({
        dentistsToCompare: typeof dentistsOrFn === "function" ? dentistsOrFn(state.dentistsToCompare) : dentistsOrFn
    })),
    setSearchQuery: (query) => set({ searchQuery: query }),
    setIsNewestFirst: (isNewestOrFn) => set((state) => ({
        isNewestFirst: typeof isNewestOrFn === "function" ? isNewestOrFn(state.isNewestFirst) : isNewestOrFn
    })),
});