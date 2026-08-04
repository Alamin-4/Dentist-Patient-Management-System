"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ShieldCheck, Check, Sparkles, LayoutDashboard, ArrowRight, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStateContext } from "@/providers/StateProvider";
import { useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/client";

export default function ClaimSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setShowSigninModal } = useStateContext();
  const [mounted, setMounted] = useState(false);
  const [confirmStatus, setConfirmStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setMounted(true);

    const sessionId = searchParams.get("session_id");
    const confirmPaymentAndRefresh = async () => {
      if (!sessionId) {
        setConfirmStatus("success");
        return;
      }

      try {
        setConfirmStatus("loading");
        await apiClient.dentists.confirmDirectoryPayment({ sessionId });
        setConfirmStatus("success");
        // Force session update on frontend
        await queryClient.invalidateQueries({ queryKey: ["auth"] });
      } catch (err: any) {
        console.error("Payment confirmation failed:", err);
        setConfirmStatus("error");
        setErrorMessage(err?.message || err?.message || "Failed to confirm payment.");
      }
    };

    confirmPaymentAndRefresh();
  }, [searchParams, queryClient]);

  if (!mounted) {
    return null;
  }

  const directoryId = searchParams.get("directoryId");

  if (confirmStatus === "loading") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl w-full space-y-8 bg-white p-8 md:p-10 rounded-xl border border-slate-200/80 shadow-md text-center relative overflow-hidden">
          <div className="relative flex flex-col items-center justify-center py-10">
            <Loader2 className="size-12 animate-spin text-brand-medium-navy mb-6" />
            <h2 className="text-2xl font-bold text-text">Verifying Your Payment</h2>
            <p className="mt-2 text-gray-500 max-w-sm text-sm leading-relaxed">
              We are confirming your transaction with Stripe. This will only take a moment...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (confirmStatus === "error") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl w-full space-y-8 bg-white p-8 md:p-10 rounded-xl border border-slate-200/80 shadow-md text-center relative overflow-hidden">
          <div className="relative flex flex-col items-center justify-center py-6">
            <div className="mx-auto size-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600 mb-6">
              <AlertTriangle className="size-8" />
            </div>
            <h2 className="text-2xl font-bold text-red-600">Verification Failed</h2>
            <p className="mt-2 text-gray-600 max-w-sm text-sm leading-relaxed">
              {errorMessage || "We encountered an issue verifying your payment session with Stripe."}
            </p>
            <div className="mt-8 space-y-3 flex flex-col items-center w-full">
              <Button
                onClick={() => window.location.reload()}
                className="w-full max-w-xs h-14 bg-brand-medium-navy hover:bg-brand-medium-navy-hover cursor-pointer text-white text-base font-semibold rounded-lg transition-all shadow-md active:scale-[0.98]"
              >
                Retry Verification
              </Button>
              <Button
                variant="link"
                onClick={() => router.push("/find-dentists")}
                className="text-gray-500 hover:text-brand-medium-navy text-sm font-semibold transition-colors"
              >
                Back to Dentist Directory
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8 bg-white p-8 md:p-10 rounded-xl border border-slate-200/80 shadow-md text-center relative overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="relative">
          {/* Success Badge */}
          <div className="mx-auto size-20 lg:size-24 rounded-full bg-brand-medium-navy flex items-center justify-center text-white mb-8 shadow-md">
            <Check className="size-10 lg:size-12 stroke-3" />
          </div>

          <div className="flex justify-center items-center gap-1.5 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-medium-navy bg-brand-medium-navy/10 px-3 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="size-3" /> Payment Verified
            </span>
          </div>

          <h1 className="text-[28px] lg:text-[32px] font-bold text-text leading-tight mb-4">
            Profile Claimed Successfully!
          </h1>
          <p className="text-gray-600 text-base leading-relaxed mb-6 max-w-md mx-auto">
            Welcome to RatedDocs! Your professional identity has been verified, your membership plan activated, and your premium directory page is now live.
          </p>

          <div className="mt-8 p-6 rounded-xl bg-slate-50 border border-slate-200/60 text-left space-y-4 max-w-md mx-auto">
            <h3 className="font-bold text-text text-sm border-b border-slate-200 pb-2">
              Setup Actions Completed:
            </h3>
            <p className="flex items-center gap-3 text-xs font-medium text-gray-600">
              <Check className="size-4 text-brand-medium-navy stroke-3 shrink-0" />
              <span>Membership status updated to <strong className="text-gray-800">Paid</strong></span>
            </p>
            <p className="flex items-center gap-3 text-xs font-medium text-gray-600">
              <Check className="size-4 text-brand-medium-navy stroke-3 shrink-0" />
              <span>Professional credentials linked to your new dashboard</span>
            </p>
            <p className="flex items-center gap-3 text-xs font-medium text-gray-600">
              <Check className="size-4 text-brand-medium-navy stroke-3 shrink-0" />
              <span>Welcome & verification email sent to your inbox</span>
            </p>
          </div>

          <div className="mt-8 space-y-3 flex flex-col items-center">
            <Button
              onClick={() => router.push("/dentist")}
              className="w-full max-w-xs h-14 bg-brand-medium-navy hover:bg-brand-medium-navy-hover cursor-pointer text-white text-base font-semibold rounded-lg transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Go To Your Dashboard <ArrowRight className="size-5" />
            </Button>
            <Button
              variant="link"
              onClick={() => router.push("/find-dentists")}
              className="text-gray-500 hover:text-brand-medium-navy text-sm font-semibold transition-colors"
            >
              Back to Dentist Directory
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
