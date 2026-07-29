"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import {
  Copy,
  Calendar,
  MessageSquare,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";

export default function ReferralsPageComponent() {
  const { data: referralsData, isLoading, isError, refetch } = useQuery({
    queryKey: ["patient-referrals"],
    queryFn: async () => {
      const response = await apiClient.patients.getReferrals();
      return response?.data || response;
    },
  });

  const referralCode = referralsData?.referralCode || "";
  const availableCredits = referralsData?.availableCredits || "$0";
  const expireDate = referralsData?.expireDate || "December 31, 2026";
  const history = referralsData?.history || [];

  const copyToClipboard = () => {
    if (!referralCode) {
      toast.error("No referral code available");
      return;
    }
    navigator.clipboard.writeText(referralCode);
    toast.success("Referral code copied to clipboard!");
  };

  if (isError) {
    return (
      <ErrorState
        title="Referral Dashboard Unavailable"
        message="Could not load your referral details. Please try again."
        onRetry={() => refetch()}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-10 animate-pulse">
        <Skeleton className="h-9 w-36 rounded-md" />

        {/* Top Section Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Referral Code Card Skeleton */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-slate-100 p-8 flex flex-col items-center justify-center text-center space-y-6">
            <div className="space-y-2 flex flex-col items-center">
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-10 w-48 rounded" />
              <Skeleton className="h-3.5 w-60 rounded" />
            </div>
            <div className="flex gap-4 w-full max-w-md">
              <Skeleton className="h-12 flex-1 rounded-lg" />
              <Skeleton className="h-12 flex-1 rounded-lg" />
            </div>
          </div>

          {/* Credits Card Skeleton */}
          <div className="bg-white rounded-lg border border-slate-100 p-8 flex flex-col justify-between min-h-60">
            <div className="space-y-2">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-9 w-20 rounded" />
            </div>
            <div className="border-t border-slate-50 pt-4 flex gap-2">
              <Skeleton className="size-5 rounded-full" />
              <Skeleton className="h-4 w-36 rounded" />
            </div>
          </div>
        </div>

        {/* History Section Skeleton */}
        <div className="space-y-6 p-6 rounded-lg bg-white border border-slate-100">
          <Skeleton className="h-7 w-44 rounded-md" />
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, idx) => (
              <div key={idx} className="bg-white rounded-lg border border-slate-100 p-6 flex justify-between items-center">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32 rounded" />
                  <Skeleton className="h-4 w-20 rounded" />
                </div>
                <Skeleton className="h-9 w-24 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      <h1 className="text-3xl font-bold text-text">Referrals</h1>

      {/* Top Section: Code & Credits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Referral Code Card */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-border p-8 flex flex-col items-center justify-center text-center space-y-6">
          <div className="space-y-1">
            <p className="text-sec-text">Your Referral Code</p>
            <div className="flex items-center gap-3">
              <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-text tracking-tight">
                {referralCode || "N/A"}
              </span>
              {referralCode && (
                <button
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-slate-50 rounded-full transition-colors group"
                >
                  <Copy className="size-6 text-slate-300 group-hover:text-[#0F3659]" />
                </button>
              )}
            </div>
            <p className="text-sec-text text-xs">
              Share your code and you both get $50 credit
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <Button
              variant="outline"
              disabled={!referralCode}
              className="flex-1 h-12 rounded-lg cursor-pointer border-sec-text font-medium text-sec-text gap-2"
            >
              <MessageSquare className="size-4" /> Share as SMS
            </Button>
            <Button
              variant="outline"
              disabled={!referralCode}
              className="flex-1 h-12 rounded-lg cursor-pointer border-sec-text font-medium text-sec-text gap-2"
            >
              <Mail className="size-4" /> Share as Email
            </Button>
          </div>
        </div>

        {/* Available Credits Card */}
        <div className="bg-white rounded-lg border border-border p-8 flex flex-col justify-between min-h-60">
          <div className="space-y-1">
            <p className="text-sec-text">Available Credits</p>
            <p className="text-2xl md:text-3xl font-bold text-text">{availableCredits}</p>
          </div>

          <div className="flex items-center gap-2 text-sec-text border-t pt-4">
            <Calendar className="size-5" />
            <p className="text-sm">
              Expires on:{" "}
              <span className="font-bold text-slate-600">
                {expireDate}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Referral History Section */}
      <div className="space-y-6 p-4 lg:p-6 rounded-lg bg-white border border-stroke">
        <h2 className="text-2xl font-bold text-text">Referral History</h2>

        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-slate-200 rounded-lg bg-slate-50/50">
            <p className="text-sm font-semibold text-slate-500">No referrals yet</p>
            <p className="text-xs text-slate-400 mt-1">Start sharing your referral code with friends!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item: any) => (
              <div
                key={item.id}
                className="bg-white rounded-lg border border-border p-4 lg:p-6 flex items-center justify-between"
              >
                <div className="space-y-1">
                  <h4 className="text-xl font-bold text-text">
                    {item.name}
                  </h4>
                  <p className="text-sec-text font-medium">{item.date}</p>
                </div>

                <div
                  className={`px-6 py-2 rounded-lg font-bold text-sm whitespace-nowrap ${item.status === "Credit issued"
                    ? "bg-[#0BB05F] text-white"
                    : "bg-[#F7941D] text-white"
                    }`}
                >
                  {item.status}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
