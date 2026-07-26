"use client";

import { useState } from "react";
import { CreditCard, ShieldCheck, Loader2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { apiClient } from "@/api/client";

interface PaymentInfoProps {
  connected?: boolean;
  chargesEnabled?: boolean;
  payoutsEnabled?: boolean;
  refetch?: () => void;
  isVerified?: boolean;
  isProgressLoading?: boolean;
}

export default function PaymentInfo({
  connected = false,
  chargesEnabled = false,
  payoutsEnabled = false,
  refetch,
  isVerified = false,
  isProgressLoading = false,
}: PaymentInfoProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.stripe.connectOnboard();
      if (response?.success && response?.data?.url) {
        window.location.href = response.data.url;
      } else {
        setError("Failed to start Stripe onboarding. Please try again.");
      }
    } catch (err: any) {
      console.error(err);
      const errMsg = err?.response?.data?.message || "An error occurred during Stripe Connect initialization.";
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncStatus = async () => {
    setIsSyncing(true);
    setError(null);
    try {
      const response = await apiClient.stripe.connectStatus();
      if (response?.success) {
        toast.success("Payout status synced successfully!");
        if (refetch) refetch();
      } else {
        setError("Failed to sync payout status.");
      }
    } catch (err: any) {
      console.error(err);
      const errMsg = err?.response?.data?.message || "An error occurred while syncing Stripe status.";
      setError(errMsg);
    } finally {
      setIsSyncing(false);
    }
  };

  const isFullyOnboarded = connected && chargesEnabled && payoutsEnabled;

  return (
    <section className="rounded-lg border border-[#EEF2F7] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-[#EEF2F7] pb-4 mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-[#0E3E65]">Payout Settings</h2>
          <span className="text-xs text-[#475569] bg-slate-100 px-2 py-0.5 rounded-full font-medium">Stripe Connect</span>
        </div>
        {isVerified && connected && (
          <button
            type="button"
            onClick={handleSyncStatus}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer border text-[#0F3659] hover:bg-slate-50 border-slate-200 disabled:opacity-60"
          >
            {isSyncing ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Syncing...
              </>
            ) : (
              "Sync Status"
            )}
          </button>
        )}
      </div>

      <div className="mt-4">
        {isProgressLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-[#0F3659]" />
          </div>
        ) : !isVerified ? (
          <div className="rounded-lg border border-amber-200 p-4 bg-amber-50/50 flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
              <ShieldCheck className="size-6" />
            </div>
            <div className="space-y-1">
              <span className="text-sm font-semibold text-slate-800">
                Verification Required
              </span>
              <p className="text-xs text-[#6B7280]">
                Your account is not verified yet. Please complete your profile verification first to set up payouts.
              </p>
            </div>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5">
                <AlertCircle className="size-4 shrink-0 mt-0.5 text-red-600" />
                <div className="flex-1 space-y-0.5">
                  <p className="font-semibold">Setup Error</p>
                  <p className="text-red-700">{error}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="text-red-500 hover:text-red-800 text-xs font-semibold px-1"
                >
                  Dismiss
                </button>
              </div>
            )}

            {!connected ? (
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-800">Set Up Payout Account</p>
                  <p className="text-sm text-[#6B7280]">
                    Connect your Stripe account to receive patient booking fees directly.
                  </p>
                </div>
                <button
                  onClick={handleConnect}
                  disabled={isLoading}
                  className="ml-auto flex items-center gap-2 rounded-md bg-[#0F3659] hover:bg-[#0a2640] px-4 py-2 text-sm font-semibold text-white transition-colors cursor-pointer disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    "Connect Stripe"
                  )}
                </button>
              </div>
            ) : (
              <div className="rounded-lg border border-slate-100 p-4 flex flex-col md:flex-row md:items-center gap-4 bg-slate-50/50">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                    {isFullyOnboarded ? (
                      <ShieldCheck className="size-6" />
                    ) : (
                      <CreditCard className="size-5" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-800">
                        Stripe Account Linked
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${isFullyOnboarded
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                          }`}
                      >
                        {isFullyOnboarded ? "Active Payouts" : "Setup Incomplete"}
                      </span>
                    </div>
                    <p className="text-xs text-[#6B7280]">
                      {isFullyOnboarded
                        ? "Your banking details are verified. Payouts will automatically transfer upon treatment completion."
                        : "Please finish your onboarding registration with Stripe to enable card charges and payouts."}
                    </p>
                  </div>
                </div>

                <div className="md:ml-auto flex items-center gap-3 shrink-0">
                  <button
                    onClick={handleConnect}
                    disabled={isLoading}
                    className="flex items-center gap-1 rounded-md bg-[#0F3659] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0a2640] transition-colors cursor-pointer disabled:opacity-60"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isFullyOnboarded ? (
                      "Manage Stripe"
                    ) : (
                      "Complete Setup"
                    )}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
