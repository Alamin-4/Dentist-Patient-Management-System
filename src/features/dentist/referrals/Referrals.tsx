"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import ReferralStats from "./components/referral-stats";
import ReferralHistory, { type ReferralHistoryItem } from "./components/referral-history";
import ReferralsSkeleton from "./components/referrals-skeleton";

export default function Referrals() {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");

  const { data: referralsData, isLoading } = useQuery({
    queryKey: ["dentist-referrals"],
    queryFn: async () => {
      try {
        const response = await apiClient.dentists.getReferrals();
        return response?.data || response;
      } catch (err) {
        // Log error quietly to the console in development
        console.warn("Referrals API route not ready or found:", err);
        return null;
      }
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: async () => {
      return await apiClient.dentists.withdrawReferral();
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Withdrawal request submitted successfully");
      queryClient.invalidateQueries({ queryKey: ["dentist-referrals"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message || "Failed to process withdrawal");
    },
  });

  const referralCode = referralsData?.referralCode || "";
  const availableBalance = referralsData?.availableBalance || "$0";
  const historyItems = referralsData?.history || [];

  const filteredHistory = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return historyItems;
    }

    return historyItems.filter((item: ReferralHistoryItem) => {
      return (
        item.name.toLowerCase().includes(normalizedQuery) ||
        item.email.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [query, historyItems]);

  const handleCopyCode = async () => {
    if (!referralCode) {
      toast.error("No referral code available");
      return;
    }
    try {
      await navigator.clipboard.writeText(referralCode);
      toast.success("Referral code copied");
    } catch {
      toast.error("Unable to copy referral code");
    }
  };

  if (isLoading) {
    return <ReferralsSkeleton />;
  }

  return (
    <section className="space-y-6 lg:space-y-7">
      <header className="space-y-1.5">
        <h1 className="text-[26px] font-semibold leading-tight tracking-[-0.02em] text-text sm:text-[30px]">
          Referrals
        </h1>
      </header>

      <ReferralStats
        referralCode={referralCode}
        availableBalance={availableBalance}
        onCopyCode={handleCopyCode}
        onWithdraw={() => withdrawMutation.mutate()}
      />

      <ReferralHistory
        items={filteredHistory}
        query={query}
        onQueryChange={setQuery}
      />
    </section>
  );
}
