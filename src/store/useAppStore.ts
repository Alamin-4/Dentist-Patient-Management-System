import { create, StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { createVerificationSlice, VerificationSlice } from "./slices/verificationSlice";
import { createUISlice, UISlice } from "./slices/uiSlice";
import { createDataSlice, DataSlice } from "./slices/dataSlice";

// Combined store interface
type AppStoreState = VerificationSlice & UISlice & DataSlice;

const storeCreator = (...a: Parameters<StateCreator<AppStoreState>>) => ({
  ...createVerificationSlice(...a),
  ...createUISlice(...a),
  ...createDataSlice(...a),
});

export const useAppStore = create<AppStoreState>()(
  persist(
    process.env.NODE_ENV === "development"
      ? devtools(storeCreator, { name: "AppStore" })
      : storeCreator,
    {
      name: "app-store",
      partialize: (state) => ({
        verificationStep: state.verificationStep,
      }),
    }
  )
);