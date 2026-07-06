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
        setErrorMessage(err?.response?.data?.message || err?.message || "Failed to confirm payment.");
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
        <div className="max-w-xl w-full space-y-8 bg-white p-8 md:p-10 rounded-2xl border border-slate-100 shadow-xl text-center relative overflow-hidden">
          {/* Top Decorative Gradient */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-r from-emerald-400 via-teal-500 to-[#0E3E65]" />
          <div className="relative flex flex-col items-center justify-center py-10">
            <Loader2 className="size-12 animate-spin text-[#0E3E65] mb-6" />
            <h2 className="text-2xl font-bold text-[#0E3E65]">Verifying Your Payment</h2>
            <p className="mt-2 text-slate-500 max-w-sm">
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
        <div className="max-w-xl w-full space-y-8 bg-white p-8 md:p-10 rounded-2xl border border-slate-100 shadow-xl text-center relative overflow-hidden">
          {/* Top Decorative Gradient */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-red-500" />
          <div className="relative flex flex-col items-center justify-center py-6">
            <div className="mx-auto size-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600 mb-6">
              <AlertTriangle className="size-8" />
            </div>
            <h2 className="text-2xl font-bold text-red-600">Verification Failed</h2>
            <p className="mt-2 text-slate-600 max-w-sm text-sm">
              {errorMessage || "We encountered an issue verifying your payment session with Stripe."}
            </p>
            <div className="mt-8 space-y-3 flex flex-col items-center w-full">
              <Button
                onClick={() => window.location.reload()}
                className="w-full max-w-xs h-12 bg-[#0E3E65] hover:bg-[#002850] text-white font-bold rounded-xl shadow-md transition-all"
              >
                Retry Verification
              </Button>
              <Button
                variant="link"
                onClick={() => router.push("/find-dentists")}
                className="text-slate-500 hover:text-[#0E3E65] text-xs font-medium"
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
      <div className="max-w-xl w-full space-y-8 bg-white p-8 md:p-10 rounded-2xl border border-slate-100 shadow-xl text-center relative overflow-hidden">
        {/* Top Decorative Gradient */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-r from-emerald-400 via-teal-500 to-[#0E3E65]" />

        {/* Floating sparkles background accent */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-50 rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#0E3E65]/5 rounded-full blur-3xl opacity-60 pointer-events-none" />

        <div className="relative">
          {/* Animated Success Badge */}
          <div className="mx-auto size-20 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-6 shadow-inner animate-bounce">
            <ShieldCheck className="size-12 stroke-[1.5]" />
          </div>

          <div className="flex justify-center items-center gap-1.5 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="size-3" /> Payment Verified
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-[#0E3E65] tracking-tight sm:text-4xl">
            Profile Claimed Successfully!
          </h1>
          <p className="mt-4 text-slate-500 text-base max-w-md mx-auto">
            Welcome to RatedDocs! Your professional identity has been verified, your membership plan activated, and your premium directory page is now live.
          </p>

          <div className="mt-8 p-6 rounded-xl bg-slate-50 border border-slate-100 text-left space-y-3.5 max-w-md mx-auto">
            <h3 className="font-semibold text-slate-800 text-sm border-b border-slate-200/60 pb-2">
              Setup Actions Completed:
            </h3>
            <p className="flex items-center gap-2.5 text-xs font-medium text-slate-600">
              <Check className="size-4 text-emerald-500 stroke-3 shrink-0" />
              <span>Membership status updated to <strong>Paid</strong></span>
            </p>
            <p className="flex items-center gap-2.5 text-xs font-medium text-slate-600">
              <Check className="size-4 text-emerald-500 stroke-3 shrink-0" />
              <span>Professional credentials linked to your new dashboard</span>
            </p>
            <p className="flex items-center gap-2.5 text-xs font-medium text-slate-600">
              <Check className="size-4 text-emerald-500 stroke-3 shrink-0" />
              <span>EJS Welcome & verification template dispatched to your email</span>
            </p>
          </div>

          <div className="mt-8 space-y-3 flex flex-col items-center">
            <Button
              onClick={() => router.push("/dentist")}
              className="w-full max-w-xs h-12 bg-[#0E3E65] hover:bg-[#002850] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 hover:shadow-lg"
            >
              Go To Your Dashboard <ArrowRight className="size-4" />
            </Button>
            <Button
              variant="link"
              onClick={() => router.push("/find-dentists")}
              className="text-slate-500 hover:text-[#0E3E65] text-xs font-medium"
            >
              Back to Dentist Directory
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
