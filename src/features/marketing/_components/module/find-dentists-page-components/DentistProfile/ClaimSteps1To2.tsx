"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, Loader2, Eye, EyeOff, Clock } from "lucide-react";
import { useOtpCountdown } from "@/hooks/auth/useOtpCountdown";

function PasswordField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-2 animate-fadeIn">
      <label className="text-[14px] font-semibold text-text block">Create Password</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Minimum 8 characters"
          className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 pr-10 text-sm font-normal placeholder-[#9EA9AA] transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          tabIndex={-1}
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    </div>
  );
}

export function ClaimStep1({
  dentist,
  user,
  claimEmail,
  setClaimEmail,
  claimPassword,
  setClaimPassword,
  yearsOfExperience,
  setYearsOfExperience,
  internationalPatients,
  setInternationalPatients,
  motivation,
  setMotivation,
  sendClaimOtpMutation,
  handleSendOtp,
}: any) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-[14px] font-semibold text-text block">Email Address</label>
        <input
          type="email"
          value={claimEmail}
          onChange={(e) => setClaimEmail(e.target.value)}
          disabled={!!user}
          placeholder="Enter professional email"
          className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm font-normal placeholder-[#9EA9AA] transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 disabled:bg-slate-50 disabled:text-slate-400"
        />
        {user && (
          <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <ShieldCheck className="size-3.5" /> Logged in session account auto-filled
          </p>
        )}
      </div>

      {!user && (
        <PasswordField
          value={claimPassword}
          onChange={setClaimPassword}
        />
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[14px] font-semibold text-text block">Years of Experience</label>
          <input
            type="number"
            min={0}
            onKeyDown={(e) => {
              if (e.key === "-" || e.key === "e") e.preventDefault();
            }}
            value={yearsOfExperience}
            onChange={(e) => setYearsOfExperience(Number(e.target.value))}
            className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm font-normal placeholder-[#9EA9AA] transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[14px] font-semibold text-text block">International Patients (%)</label>
          <input
            type="number"
            min={0}
            onKeyDown={(e) => {
              if (e.key === "-" || e.key === "e") e.preventDefault();
            }}
            value={internationalPatients}
            onChange={(e) => setInternationalPatients(Number(e.target.value))}
            className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm font-normal placeholder-[#9EA9AA] transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[14px] font-semibold text-text block">Professional Bio / Motivation</label>
        <textarea
          value={motivation}
          onChange={(e) => setMotivation(e.target.value)}
          placeholder="Tell patients about your dental approach and clinical background..."
          className="w-full min-h-20 rounded-lg border border-[#E5E7EB] px-4 py-3 font-normal placeholder-[#9EA9AA] transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm text-slate-800"
        />
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-100 mt-6">
        <button
          type="button"
          onClick={handleSendOtp}
          disabled={sendClaimOtpMutation.isPending}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#113254] px-6 py-2.5 font-semibold text-white transition-all duration-200 hover:bg-[#0d2844] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer text-sm"
        >
          {sendClaimOtpMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending OTP...
            </>
          ) : (
            "Send OTP & Continue"
          )}
        </button>
      </div>
    </div>
  );
}

export function ClaimStep2({
  claimEmail,
  claimOtp,
  setClaimOtp,
  handleVerifyOtp,
  verifyOtpMutation,
  handleResendOtpCode,
  resendOtpMutation,
  setClaimStep,
}: any) {
  /**
   * Countdown timer — namespaced as 'claim_step2' so it doesn't interfere
   * with the patient-signup or register-doctor OTP timers.
   * Persists across reloads via localStorage.
   */
  const { isActive, displayTime, startCountdown, syncWithBackend } =
    useOtpCountdown({ storageKey: "claim_step2" });

  // Start the 2-minute timer when this step mounts (OTP was just sent).
  // If a timer is already running (e.g. user navigated back), skip restarting.
  useEffect(() => {
    if (!isActive) {
      startCountdown(); // 120 s default
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally run once on mount

  const onResend = () => {
    // Don't allow resend while countdown is active or a request is in flight
    if (isActive || resendOtpMutation.isPending) return;

    handleResendOtpCode({
      onSuccess: () => {
        startCountdown();
      },
      onError: (err: any) => {
        const httpStatus = err?.response?.status ?? err?.status;
        if (httpStatus === 429) {
          const retryAfterSeconds: number | undefined =
            err?.response?.data?.data?.retryAfter;
          if (retryAfterSeconds && retryAfterSeconds > 0) {
            syncWithBackend(retryAfterSeconds);
          }
        }
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-sky-50/50 border border-sky-100 p-4">
        <p className="text-slate-600 text-xs leading-normal">
          We sent a verification code to{" "}
          <span className="font-semibold text-slate-800">{claimEmail}</span>.
          Enter the 6-digit OTP code below:
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-[14px] font-semibold text-text block">Verification Code</label>
        <input
          value={claimOtp}
          onChange={(e) => setClaimOtp(e.target.value)}
          placeholder="0 0 0 0 0 0"
          maxLength={6}
          className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-center text-lg font-mono tracking-widest placeholder-[#9EA9AA] transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
        />
      </div>

      {/* ── Countdown / Resend area — mirrors Otp-Verify-Modal pattern ── */}
      <div className="flex justify-end">
        {isActive ? (
          <span className="flex items-center gap-1.5 text-xs text-[#113254]/60">
            <Clock className="size-3.5" />
            Resend in{" "}
            <span className="font-semibold tabular-nums text-[#113254]">
              {displayTime}
            </span>
          </span>
        ) : (
          <button
            type="button"
            onClick={onResend}
            disabled={resendOtpMutation.isPending}
            className="text-xs text-primary hover:underline font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resendOtpMutation.isPending ? "Resending..." : "Resend Code"}
          </button>
        )}
      </div>

      <div className="flex justify-between pt-4 border-t border-slate-100 mt-6">
        <button
          type="button"
          onClick={() => setClaimStep(1)}
          className="rounded-lg border border-[#E5E7EB] px-5 py-2.5 font-semibold text-slate-700 transition-colors hover:bg-slate-50 cursor-pointer text-sm"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleVerifyOtp}
          disabled={verifyOtpMutation.isPending}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#113254] px-6 py-2.5 font-semibold text-white transition-all duration-200 hover:bg-[#0d2844] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer text-sm"
        >
          {verifyOtpMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify & Continue"
          )}
        </button>
      </div>
    </div>
  );
}
