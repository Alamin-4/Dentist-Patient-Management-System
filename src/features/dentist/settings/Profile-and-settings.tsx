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
import { PageContainer } from "@/components/shared/page-container";
import { HeadingGroup } from "@/components/shared/heading-group";
import { SectionCard } from "@/components/shared/section-card";

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
    <PageContainer className="space-y-6">
      <HeadingGroup title="Settings" />

      <div className="grid grid-cols-1 gap-6">
        <div>
          <PersonalInfo />
        </div>

        <div className="order-2 lg:order-1">
          <ChangePassword />
        </div>

        <div className="order-1 lg:order-2">
          {isLoading ? (
            <SectionCard className="flex items-center justify-center h-32">
              <div className="h-6 w-6 border-2 border-brand-medium-navy border-t-transparent rounded-full animate-spin"></div>
            </SectionCard>
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
    </PageContainer>
  );
}
