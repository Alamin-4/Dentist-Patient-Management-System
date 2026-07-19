"use client";

import { ShieldCheck, Check, AlertCircle, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export function ClaimStep3({
  hasSterilizationDocs,
  setHasSterilizationDocs,
  hasBeforeAfterPhotos,
  setHasBeforeAfterPhotos,
  hasMaterialsDocs,
  setHasMaterialsDocs,
  hasEducationCertificates,
  setHasEducationCertificates,
  hasGuarantees,
  setHasGuarantees,
  handleNextStep,
  user,
  setClaimStep,
}: any) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-amber-50/50 border border-amber-200 p-4 mb-2">
        <p className="text-amber-800 text-xs font-semibold flex items-center gap-1.5">
          <AlertCircle className="size-4 shrink-0 text-amber-600" /> Please verify you adhere to RatedDocs medical protocols:
        </p>
      </div>

      <div className="space-y-4 py-2">
        <div className="flex items-start gap-3">
          <Checkbox
            id="steril"
            checked={hasSterilizationDocs}
            onCheckedChange={(checked) => setHasSterilizationDocs(!!checked)}
            className="mt-1 data-[state=checked]:bg-[#113254] data-[state=checked]:border-[#113254]"
          />
          <label htmlFor="steril" className="text-sm font-semibold text-slate-700 cursor-pointer select-none leading-none pt-0.5">
            I maintain detailed sterilization logs for all dental apparatuses
          </label>
        </div>

        <div className="flex items-start gap-3">
          <Checkbox
            id="photos"
            checked={hasBeforeAfterPhotos}
            onCheckedChange={(checked) => setHasBeforeAfterPhotos(!!checked)}
            className="mt-1 data-[state=checked]:bg-[#113254] data-[state=checked]:border-[#113254]"
          />
          <label htmlFor="photos" className="text-sm font-semibold text-slate-700 cursor-pointer select-none leading-none pt-0.5">
            I possess clear and verifiable before & after treatment photos
          </label>
        </div>

        <div className="flex items-start gap-3">
          <Checkbox
            id="materials"
            checked={hasMaterialsDocs}
            onCheckedChange={(checked) => setHasMaterialsDocs(!!checked)}
            className="mt-1 data-[state=checked]:bg-[#113254] data-[state=checked]:border-[#113254]"
          />
          <label htmlFor="materials" className="text-sm font-semibold text-slate-700 cursor-pointer select-none leading-none pt-0.5">
            I only utilize FDA / CE approved dental implant and crown materials
          </label>
        </div>

        <div className="flex items-start gap-3">
          <Checkbox
            id="education"
            checked={hasEducationCertificates}
            onCheckedChange={(checked) => setHasEducationCertificates(!!checked)}
            className="mt-1 data-[state=checked]:bg-[#113254] data-[state=checked]:border-[#113254]"
          />
          <label htmlFor="education" className="text-sm font-semibold text-slate-700 cursor-pointer select-none leading-none pt-0.5">
            I hold authentic, accredited certificates of dentistry education & license
          </label>
        </div>

        <div className="flex items-start gap-3">
          <Checkbox
            id="guarantees"
            checked={hasGuarantees}
            onCheckedChange={(checked) => setHasGuarantees(!!checked)}
            className="mt-1 data-[state=checked]:bg-[#113254] data-[state=checked]:border-[#113254]"
          />
          <label htmlFor="guarantees" className="text-sm font-semibold text-slate-700 cursor-pointer select-none leading-none pt-0.5">
            I agree to offer the RatedDocs "No Surprise Price Guarantee" for patients
          </label>
        </div>
      </div>

      <div className="flex justify-between pt-4 border-t border-slate-100 mt-6">
        {!user && (
          <button
            type="button"
            onClick={() => setClaimStep(2)}
            className="rounded-lg border border-[#E5E7EB] px-5 py-2.5 font-semibold text-slate-700 transition-colors hover:bg-slate-50 cursor-pointer text-sm"
          >
            Back
          </button>
        )}
        <button
          type="button"
          onClick={handleNextStep}
          className={`${user ? "w-full" : ""} flex items-center justify-center gap-2 rounded-lg bg-[#113254] px-6 py-2.5 font-semibold text-white transition-all duration-200 hover:bg-[#0d2844] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer text-sm`}
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
}

export function ClaimStep4({
  selectedPlan,
  setSelectedPlan,
  checkoutMutation,
  handleProceedToPayment,
  setClaimStep,
}: any) {
  return (
    <div className="space-y-4">
      <div className="space-y-3 mb-4">
        <label className="text-[14px] font-semibold text-[#1A1A2E] block">Choose Your Membership Plan</label>
        <div className="grid grid-cols-2 gap-4">
          <div
            onClick={() => setSelectedPlan("6_MONTH")}
            className={`border-2 rounded-xl p-4 text-center cursor-pointer transition-all ${
              selectedPlan === "6_MONTH"
                ? "border-[#113254] bg-[#113254]/5 ring-2 ring-[#113254]/10"
                : "border-slate-200 hover:bg-slate-50"
            }`}
          >
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide">6 Months</span>
            <span className="block text-2xl font-extrabold text-[#113254] mt-1">$899</span>
            <span className="block text-[10px] text-slate-400 mt-1">~$149.83/mo</span>
          </div>
          <div
            onClick={() => setSelectedPlan("12_MONTH")}
            className={`relative border-2 rounded-xl p-4 text-center cursor-pointer transition-all ${
              selectedPlan === "12_MONTH"
                ? "border-[#4CA30D] bg-[#4CA30D]/5 ring-2 ring-[#4CA30D]/10"
                : "border-slate-200 hover:bg-slate-50"
            }`}
          >
            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#4CA30D] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Best Value</span>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide">12 Months</span>
            <span className="block text-2xl font-extrabold text-[#113254] mt-1">$1499</span>
            <span className="block text-[10px] text-slate-400 mt-1">~$124.92/mo</span>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-emerald-50/50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-start gap-2">
        <ShieldCheck className="size-4 shrink-0 mt-0.5 text-emerald-600 animate-scaleUp" />
        <span>
          You will be redirected to <strong>Stripe's secure checkout</strong>. Your profile will be marked as <strong>Claimed</strong> automatically after payment.
        </span>
      </div>

      <div className="flex justify-between pt-4 border-t border-slate-100 mt-6">
        <button
          type="button"
          onClick={() => setClaimStep(3)}
          disabled={checkoutMutation.isPending}
          className="rounded-lg border border-[#E5E7EB] px-5 py-2.5 font-semibold text-slate-700 transition-colors hover:bg-slate-50 cursor-pointer text-sm"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleProceedToPayment}
          disabled={checkoutMutation.isPending}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#113254] px-6 py-2.5 font-semibold text-white transition-all duration-200 hover:bg-[#0d2844] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer text-sm"
        >
          {checkoutMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Redirecting...
            </>
          ) : (
            `Pay ${selectedPlan === "12_MONTH" ? "$1499" : "$899"} & Claim →`
          )}
        </button>
      </div>
    </div>
  );
}

export function ClaimStep5({ dentist, queryClient, router, onOpenChange }: any) {
  return (
    <div className="text-center py-6 space-y-4 animate-scaleUp">
      <div className="mx-auto size-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
        <ShieldCheck className="size-10 stroke-[1.5]" />
      </div>
      <div className="space-y-1">
        <h4 className="text-lg font-bold text-slate-900">Congratulations, Dr. {dentist.name}!</h4>
        <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
          Your profile claim was registered, and membership status has been successfully updated via Stripe.
        </p>
      </div>

      <div className="p-4 rounded-lg bg-slate-50 border border-slate-150 inline-block text-left text-xs space-y-2 text-slate-600">
        <p className="flex items-center gap-1.5 font-semibold text-slate-800">
          <Check className="size-4 text-emerald-500 stroke-3" /> Credentials registered successfully
        </p>
        <p className="flex items-center gap-1.5 font-semibold text-slate-800">
          <Check className="size-4 text-emerald-500 stroke-3" /> Stripe signature and payment verified
        </p>
        <p className="flex items-center gap-1.5 font-semibold text-slate-800">
          <Check className="size-4 text-emerald-500 stroke-3" /> Email notifications dispatched
        </p>
      </div>

      <div className="pt-4 mt-6">
        <button
          type="button"
          onClick={async () => {
            onOpenChange(false);
            await queryClient.invalidateQueries({ queryKey: ["auth"] });
            router.push("/dentist");
          }}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#113254] px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-[#0d2844] active:scale-[0.98] cursor-pointer text-sm"
        >
          Go to Dashboard →
        </button>
      </div>
    </div>
  );
}
