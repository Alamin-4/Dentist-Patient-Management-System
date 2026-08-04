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
        router.replace("/dentist");
        return;
      }

      try {
        setConfirmStatus("loading");
        await apiClient.dentists.confirmDirectoryPayment({ sessionId });
        setConfirmStatus("success");
        // Force session update on frontend
        await queryClient.invalidateQueries({ queryKey: ["auth"] });
        router.replace("/dentist");
      } catch (err: any) {
        console.error("Payment confirmation failed:", err);
        setConfirmStatus("error");
        setErrorMessage(err?.message || "Failed to confirm payment.");
      }
    };

    confirmPaymentAndRefresh();
  }, [searchParams, queryClient, router]);

  if (!mounted) {
    return null;
  }

  const directoryId = searchParams.get("directoryId");

  if (confirmStatus === "loading") {
    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-secondary/30 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6 bg-card p-8 sm:p-10 rounded-2xl border border-border/80 shadow-lg text-center relative overflow-hidden animate-scaleUp">
          {/* Subtle Accent Glow */}
          <div className="absolute -top-12 -left-12 size-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 size-32 bg-badge/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative flex flex-col items-center justify-center py-4">
            <div className="relative mb-6">
              <div className="size-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
                <Loader2 className="size-8 animate-spin" />
              </div>
              <div className="absolute inset-0 rounded-full bg-primary/15 animate-ping pointer-events-none" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="size-3.5 text-accent" />
              Verifying Transaction
            </div>

            <h2 className="text-2xl font-bold text-text tracking-tight mb-2">
              Verifying Your Payment
            </h2>
            <p className="text-sm text-sec-text max-w-xs leading-relaxed">
              We are securely confirming your transaction with Stripe and activating your dashboard access...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (confirmStatus === "error") {
    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-secondary/30 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-card p-8 sm:p-10 rounded-2xl border border-border/80 shadow-lg text-center relative overflow-hidden animate-scaleUp">
          <div className="relative flex flex-col items-center justify-center">
            <div className="mx-auto size-16 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive mb-6 shadow-sm">
              <AlertTriangle className="size-8" />
            </div>
            <h2 className="text-2xl font-bold text-text tracking-tight mb-2">Verification Failed</h2>
            <p className="text-sm text-sec-text max-w-xs leading-relaxed mb-6">
              {errorMessage || "We encountered an issue verifying your payment session with Stripe."}
            </p>

            <div className="space-y-3 flex flex-col items-center w-full">
              <Button
                onClick={() => window.location.reload()}
                className="w-full max-w-xs h-12 bg-primary hover:bg-brand-deep-navy-hover cursor-pointer text-primary-foreground text-sm font-semibold rounded-xl transition-all shadow-md active:scale-[0.98]"
              >
                Retry Verification
              </Button>
              <Button
                variant="link"
                onClick={() => router.push("/find-dentists")}
                className="text-sec-text hover:text-text text-sm font-semibold transition-colors cursor-pointer"
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
    <div className="min-h-[85vh] flex items-center justify-center bg-secondary/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 bg-card p-8 sm:p-10 rounded-2xl border border-border/80 shadow-lg text-center relative overflow-hidden animate-scaleUp">
        <div className="relative">
          {/* Success Badge */}
          <div className="mx-auto size-20 rounded-full bg-badge flex items-center justify-center text-white mb-6 shadow-md ring-8 ring-badge/15">
            <Check className="size-10 stroke-3" />
          </div>

          <div className="flex justify-center items-center gap-1.5 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-badge bg-badge/10 border border-badge/20 px-3.5 py-1 rounded-full flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-accent" /> Payment Verified
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-text tracking-tight mb-3">
            Profile Claimed Successfully!
          </h1>
          <p className="text-sec-text text-sm leading-relaxed mb-6 max-w-sm mx-auto">
            Welcome to RatedDocs! Your professional identity has been verified, your membership plan activated, and your dashboard is ready.
          </p>

          <div className="p-5 rounded-xl bg-secondary/60 border border-border/80 text-left space-y-3 max-w-sm mx-auto mb-8">
            <h3 className="font-bold text-text text-xs uppercase tracking-wider border-b border-border/80 pb-2">
              Setup Actions Completed:
            </h3>
            <p className="flex items-center gap-2.5 text-xs font-medium text-sec-text">
              <Check className="size-4 text-badge stroke-3 shrink-0" />
              <span>Membership status updated to <strong className="text-text">Paid</strong></span>
            </p>
            <p className="flex items-center gap-2.5 text-xs font-medium text-sec-text">
              <Check className="size-4 text-badge stroke-3 shrink-0" />
              <span>Directory profile linked to dashboard</span>
            </p>
            <p className="flex items-center gap-2.5 text-xs font-medium text-sec-text">
              <Check className="size-4 text-badge stroke-3 shrink-0" />
              <span>Confirmation email sent</span>
            </p>
          </div>

          <div className="space-y-3 flex flex-col items-center">
            <Button
              onClick={() => router.push("/dentist")}
              className="w-full max-w-xs h-12 bg-primary hover:bg-brand-deep-navy-hover cursor-pointer text-primary-foreground text-sm font-semibold rounded-xl transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Go To Your Dashboard <ArrowRight className="size-4" />
            </Button>
            <Button
              variant="link"
              onClick={() => router.push("/find-dentists")}
              className="text-sec-text hover:text-text text-sm font-semibold transition-colors cursor-pointer"
            >
              Back to Dentist Directory
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
