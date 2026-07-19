"use client";

import ChangePassword from "./components/change-password";
import PaymentInfo from "./components/payment-info";
import PersonalInfo from "./components/personal-info";
import { useGetMe } from "@/hooks/user/useUser";

export default function ProfileAndSettings() {
  const { data: response, isLoading } = useGetMe();
  const user = (response as any)?.data || response;

  const isConnected = !!user?.dentist?.dentistDirectory?.stripeSubscriptionId || !!user?.dentist?.dentistDirectory?.stripeCustomerId;

  return (
    <div className="space-y-6 lg:space-y-8">
      <header>
        <h1 className="text-[28px] font-semibold text-[#1A1A2E]">Settings</h1>
      </header>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <PersonalInfo />
        </div>

        <div className="order-2 lg:order-1">
          <ChangePassword />
        </div>

        <div className="order-1 lg:order-2">
          {isLoading ? (
            <div className="rounded-lg border border-[#EEF2F7] bg-white p-6 shadow-sm flex items-center justify-center h-32">
              <div className="h-6 w-6 border-2 border-[#0F3659] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <PaymentInfo
              connected={isConnected}
              card={null}
            />
          )}
        </div>
      </div>
    </div>
  );
}
