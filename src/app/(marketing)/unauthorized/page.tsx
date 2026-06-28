"use client";

import { useRouter } from "next/navigation";
import { ShieldAlert, ArrowLeft, LogIn } from "lucide-react";
import { useStateContext } from "@/providers/StateProvider";

export default function UnauthorizedPage() {
  const router = useRouter();
  const stateContext = useStateContext();

  const handleGoHome = () => {
    router.push("/");
  };

  const handleSignIn = () => {
    if (stateContext?.setShowSigninModal) {
      stateContext.setShowSigninModal(true);
    } else {
      router.push("/?session_token_required=true");
    }
  };

  return (
    <section className="relative w-full bg-[#F9FAF8] py-16 md:py-24 min-h-[70vh] flex items-center justify-center">
      {/* Background decoration to match marketing warmth */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-[#10436B]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-[#2e90fa]/5 rounded-full blur-3xl" />

      <div className="relative z-10 mx-auto max-w-lg w-11/12 text-center">
        <div className="flex flex-col items-center">


          <p className="max-w-sm text-base leading-relaxed text-gray-500 mb-8">
            This page is not available or broken. Please check your connection or try again later.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
            <button
              onClick={handleGoHome}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all cursor-pointer w-full sm:w-auto"
            >
              <ArrowLeft size={18} />
              <span>Back to Home</span>
            </button>

            <button
              onClick={handleSignIn}
              className="flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-[#10436B] text-white font-semibold hover:opacity-90 transition-all cursor-pointer shadow-sm shadow-[#10436B]/15 w-full sm:w-auto"
            >
              <LogIn size={18} />
              <span>Sign In</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
