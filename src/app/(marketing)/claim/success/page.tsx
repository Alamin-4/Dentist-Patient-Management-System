"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ShieldCheck, Check, Sparkles, LayoutDashboard, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStateContext } from "@/providers/StateProvider";

export default function ClaimSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setShowSigninModal } = useStateContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const directoryId = searchParams.get("directoryId");

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
              onClick={() => {
                setShowSigninModal(true);
              }}
              className="w-full max-w-xs h-12 bg-[#0E3E65] hover:bg-[#002850] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 hover:shadow-lg"
            >
              Sign In to Your Dashboard <ArrowRight className="size-4" />
            </Button>
            <Button
              variant="link"
              onClick={() => router.push("/find-dentist")}
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
