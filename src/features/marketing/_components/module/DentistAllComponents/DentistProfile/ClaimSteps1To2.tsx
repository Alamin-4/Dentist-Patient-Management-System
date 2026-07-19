"use client";

import { ShieldCheck, Loader2 } from "lucide-react";

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
        <label className="text-[14px] font-semibold text-[#1A1A2E] block">Email Address</label>
        <input
          type="email"
          value={claimEmail}
          onChange={(e) => setClaimEmail(e.target.value)}
          disabled={!!user}
          placeholder="Enter professional email"
          className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm font-normal placeholder-[#9EA9AA] transition-all focus:border-[#0E3E65] focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 disabled:bg-slate-50 disabled:text-slate-400"
        />
        {user && (
          <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <ShieldCheck className="size-3.5" /> Logged in session account auto-filled
          </p>
        )}
      </div>

      {!user && (
        <div className="space-y-2 animate-fadeIn">
          <label className="text-[14px] font-semibold text-[#1A1A2E] block">Create Password</label>
          <input
            type="password"
            value={claimPassword}
            onChange={(e) => setClaimPassword(e.target.value)}
            placeholder="Minimum 8 characters"
            className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm font-normal placeholder-[#9EA9AA] transition-all focus:border-[#0E3E65] focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[14px] font-semibold text-[#1A1A2E] block">Years of Experience</label>
          <input
            type="number"
            min={0}
            onKeyDown={(e) => {
              if (e.key === "-" || e.key === "e") e.preventDefault();
            }}
            value={yearsOfExperience}
            onChange={(e) => setYearsOfExperience(Number(e.target.value))}
            className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm font-normal placeholder-[#9EA9AA] transition-all focus:border-[#0E3E65] focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[14px] font-semibold text-[#1A1A2E] block">International Patients (%)</label>
          <input
            type="number"
            min={0}
            onKeyDown={(e) => {
              if (e.key === "-" || e.key === "e") e.preventDefault();
            }}
            value={internationalPatients}
            onChange={(e) => setInternationalPatients(Number(e.target.value))}
            className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm font-normal placeholder-[#9EA9AA] transition-all focus:border-[#0E3E65] focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[14px] font-semibold text-[#1A1A2E] block">Professional Bio / Motivation</label>
        <textarea
          value={motivation}
          onChange={(e) => setMotivation(e.target.value)}
          placeholder="Tell patients about your dental approach and clinical background..."
          className="w-full min-h-[80px] rounded-lg border border-[#E5E7EB] px-4 py-3 font-normal placeholder-[#9EA9AA] transition-all focus:border-[#0E3E65] focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm text-slate-800"
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
  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-sky-50/50 border border-sky-100 p-4">
        <p className="text-slate-600 text-xs leading-normal">
          We sent a verification code to <span className="font-semibold text-slate-800">{claimEmail}</span>. Enter the 6-digit OTP code below:
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-[14px] font-semibold text-[#1A1A2E] block">Verification Code</label>
        <input
          value={claimOtp}
          onChange={(e) => setClaimOtp(e.target.value)}
          placeholder="0 0 0 0 0 0"
          maxLength={6}
          className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-center text-lg font-mono tracking-widest placeholder-[#9EA9AA] transition-all focus:border-[#0E3E65] focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleResendOtpCode}
          disabled={resendOtpMutation.isPending}
          className="text-xs text-[#0E3E65] hover:underline font-semibold cursor-pointer"
        >
          {resendOtpMutation.isPending ? "Resending..." : "Resend Code"}
        </button>
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
