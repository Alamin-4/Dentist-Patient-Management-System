"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import ChangePassword from "./components/change-password";
import PaymentInfo from "./components/payment-info";
import PersonalInfo from "./components/personal-info";
import { useGetMe } from "@/hooks/user/useUser";
import { apiClient } from "@/api/client";
import { useDentistProgress } from "@/hooks/dentist/useDentist";

export default function ProfileAndSettings() {
  const { data: response, isLoading: isMeLoading, refetch } = useGetMe();
  const user = (response as any)?.data || response;
  const searchParams = useSearchParams();

  const { data: progressResponse, isLoading: isProgressLoading } = useDentistProgress();
  const progress = progressResponse?.data || progressResponse;
  const isVerified = !!progress?.is_verified;

  const connectSuccess = searchParams.get("connect_success");
  const connectRefresh = searchParams.get("connect_refresh");

  useEffect(() => {
    if (connectSuccess) {
      const syncStatus = async () => {
        try {
          const res = await apiClient.stripe.connectStatus();
          if (res?.success) {
            toast.success("Stripe Connect account connected and synced successfully!");
          } else {
            toast.success("Stripe onboarding process completed!");
          }
          refetch();
        } catch (error) {
          console.error("Failed to sync Stripe Connect status:", error);
          toast.error("Failed to sync your payouts status.");
        }
      };
      syncStatus();
    } else if (connectRefresh) {
      toast.error("Stripe onboarding was interrupted. Please try again.");
    }
  }, [connectSuccess, connectRefresh, refetch]);

  const isConnected = !!user?.dentist?.stripeConnectOnboarded;
  const isLoading = isMeLoading;

  return (
    <div className="space-y-6 lg:space-y-8">
      <header>
        <h1 className="text-[28px] font-semibold text-text">Settings</h1>
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
              chargesEnabled={!!user?.dentist?.stripeConnectChargesEnabled}
              payoutsEnabled={!!user?.dentist?.stripeConnectPayoutsEnabled}
              refetch={refetch}
              isVerified={isVerified}
              isProgressLoading={isProgressLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
}
