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
  claimMutation,
  isLoading,
}: any) {
  const isPending = isLoading || claimMutation?.isPending;

  const isAgreed =
    hasSterilizationDocs &&
    hasBeforeAfterPhotos &&
    hasMaterialsDocs &&
    hasEducationCertificates &&
    hasGuarantees;

  const handleToggleAll = (checked: boolean) => {
    setHasSterilizationDocs(checked);
    setHasBeforeAfterPhotos(checked);
    setHasMaterialsDocs(checked);
    setHasEducationCertificates(checked);
    setHasGuarantees(checked);
  };

  const PROTOCOLS = [
    "Detailed sterilization logs maintained for all dental apparatuses & instruments",
    "Clear, authentic, and verifiable before & after treatment patient photographs",
    "Exclusive utilization of FDA / CE approved dental implants and restorative materials",
    "Authentic, accredited certificates of dentistry education and active professional licensing",
    "Full adherence to the RatedDocs 'No Surprise Price Guarantee' for international patients",
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-accent/5/60 border border-amber-200 p-4">
        <p className="text-accent/95 text-xs font-semibold flex items-center gap-1.5 mb-1">
          <AlertCircle className="size-4 shrink-0 text-accent" /> Medical Standards & Compliance Requirements
        </p>
        <p className="text-accent/95 text-xs leading-relaxed">
          To maintain directory trust and protect international patients, all listed dental practices must commit to the following clinical standards:
        </p>
      </div>

      {/* Protocol List */}
      <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-3">
        {PROTOCOLS.map((protocol, idx) => (
          <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium leading-relaxed">
            <div className="size-4 rounded-full bg-brand-deep-navy/10 text-brand-deep-navy flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
              {idx + 1}
            </div>
            <span>{protocol}</span>
          </div>
        ))}
      </div>

      {/* Single Agreement Checkbox */}
      <div className="pt-1">
        <div className="flex items-start gap-3 rounded-lg border border-slate-200 p-3.5 bg-white hover:bg-slate-50/50 transition-colors">
          <Checkbox
            id="agree-all-protocols"
            checked={isAgreed}
            onCheckedChange={(checked) => handleToggleAll(!!checked)}
            className="mt-0.5 data-[state=checked]:bg-brand-deep-navy data-[state=checked]:border-brand-deep-navy"
          />
          <label
            htmlFor="agree-all-protocols"
            className="text-xs font-semibold text-slate-800 cursor-pointer select-none leading-relaxed"
          >
            I confirm and agree that my dental practice adheres to all the RatedDocs medical protocols listed above.
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-4 border-t border-slate-100 mt-6">
        {!user && (
          <button
            type="button"
            disabled={isPending}
            onClick={() => setClaimStep(2)}
            className="rounded-lg border border-[#E5E7EB] px-5 py-2.5 font-semibold text-slate-700 transition-colors hover:bg-slate-50 cursor-pointer text-sm disabled:opacity-50"
          >
            Back
          </button>
        )}
        <button
          type="button"
          disabled={!isAgreed || isPending}
          onClick={handleNextStep}
          className={`${user ? "w-full" : ""} flex items-center justify-center gap-2 rounded-lg bg-brand-deep-navy px-6 py-2.5 font-semibold text-white transition-all duration-200 hover:bg-brand-deep-navy-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer text-sm`}
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving Application...
            </>
          ) : (
            "Save & Proceed to Payment →"
          )}
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
        <label className="text-[14px] font-semibold text-text block">Choose Your Membership Plan</label>
        <div className="grid grid-cols-2 gap-4">
          <div
            onClick={() => setSelectedPlan("6_MONTH")}
            className={`border-2 rounded-xl p-4 text-center cursor-pointer transition-all ${selectedPlan === "6_MONTH"
              ? "border-brand-deep-navy bg-brand-deep-navy/5 ring-2 ring-brand-deep-navy/10"
              : "border-slate-200 hover:bg-slate-50"
              }`}
          >
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide">6 Months</span>
            <span className="block text-2xl font-extrabold text-brand-deep-navy mt-1">$899</span>
            <span className="block text-[10px] text-slate-400 mt-1">~$149.83/mo</span>
          </div>
          <div
            onClick={() => setSelectedPlan("12_MONTH")}
            className={`relative border-2 rounded-xl p-4 text-center cursor-pointer transition-all ${selectedPlan === "12_MONTH"
              ? "border-badge bg-badge/5 ring-2 ring-badge/10"
              : "border-slate-200 hover:bg-slate-50"
              }`}
          >
            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-badge text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Best Value</span>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide">12 Months</span>
            <span className="block text-2xl font-extrabold text-brand-deep-navy mt-1">$1499</span>
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

      <div className="flex items-center justify-center pt-4 border-t border-slate-100 mt-6">
        <button
          type="button"
          onClick={() => setClaimStep(3)}
          disabled={checkoutMutation.isPending}
          className="rounded-lg border hidden border-[#E5E7EB] px-5 py-2.5 font-semibold text-slate-700 transition-colors hover:bg-slate-50 cursor-pointer text-sm"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleProceedToPayment}
          disabled={checkoutMutation.isPending}
          className="flex items-center justify-center w-full gap-2 rounded-lg bg-brand-deep-navy px-6 py-2.5 font-semibold text-white transition-all duration-200 hover:bg-brand-deep-navy-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer text-sm"
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
          Your profile has been successfully claimed. Please log in to your dashboard to complete document verification.
        </p>
      </div>

      <div className="p-4 rounded-lg bg-slate-50 border border-slate-150 inline-block text-left text-xs space-y-2 text-slate-600">
        <p className="flex items-center gap-1.5 font-semibold text-slate-800">
          <Check className="size-4 text-emerald-500 stroke-3" /> Profile claimed successfully
        </p>
        <p className="flex items-center gap-1.5 font-semibold text-slate-800">
          <Check className="size-4 text-emerald-500 stroke-3" /> Dentist account promoted
        </p>
        <p className="flex items-center gap-1.5 font-semibold text-slate-800">
          <Check className="size-4 text-emerald-500 stroke-3" /> Onboarding emails dispatched
        </p>
      </div>

      <div className="pt-4 mt-6">
        <button
          type="button"
          onClick={async () => {
            onOpenChange(false);
            await queryClient.invalidateQueries({ queryKey: ["auth"] });
            window.location.href = "/dentist";
          }}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-brand-deep-navy px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-brand-deep-navy-hover active:scale-[0.98] cursor-pointer text-sm"
        >
          Go to Dashboard →
        </button>
      </div>
    </div>
  );
}
