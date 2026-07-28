"use client";

import Image from "next/image";
import { ChevronLeft, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import SignatureModal from "@/app/modules/patient/MyBooking/Modal/SignatureModal";
import { RejectPlanModal } from "@/app/modules/patient/MyBooking/Modal/RejectModal";
import { useTreatmentPlanById, useTreatmentPlanDecision } from "@/hooks/treatment-plan/useTreatmentPlan";
import { apiClient } from "@/api/client";

// ─── Section card wrapper ─────────────────────────────────────────────────────

function SectionCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("bg-white rounded-lg p-6 border border-slate-100", className)}>
      {children}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ReviewPlanPage() {
  const { slug } = useParams();
  const router = useRouter();

  const { data: treatmentPlanResponse, isLoading } = useTreatmentPlanById(slug as string);
  const decisionMutation = useTreatmentPlanDecision();

  const [agreed, setAgreed] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [signModalOpen, setSignModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-40">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0F3659]"></div>
      </div>
    );
  }

  const plan = treatmentPlanResponse?.data;
  if (!plan) {
    return (
      <div className="text-center py-20 bg-white border border-slate-100 rounded-lg ">
        <p className="text-red-500 font-medium">Treatment plan not found.</p>
        <button
          onClick={() => router.push("/patient")}
          className="mt-4 px-6 py-2 bg-[#0F3659] text-white rounded-lg text-sm"
        >
          Go Back
        </button>
      </div>
    );
  }

  const dentistUser = plan.dentist?.user;
  const doctorName = dentistUser ? `Dr. ${dentistUser.firstName} ${dentistUser.lastName}`.trim() : "Dentist";
  const specialty = plan.dentist?.specialty?.name || plan.dentist?.specialty || "Dentist";
  const avatarSrc = dentistUser?.image || plan.dentist?.profileImageUrl || "/images/dentist.png";

  const totalEstimate = plan.lineItems
    ? plan.lineItems.reduce((acc: number, item: any) => acc + Number(item.unitPrice), 0)
    : 0;

  const leewayAmount = Math.round(totalEstimate * 0.15);
  const maxPrice = totalEstimate + leewayAmount;

  const handleAccept = async () => {
    if (!agreed || !signatureData) return;
    setIsRedirecting(true);

    try {
      // Step 1: Accept the treatment plan → creates a TreatmentBooking with PENDING_PAYMENT status
      const acceptResult = await apiClient.treatmentPlans.decision(plan.id, { action: "ACCEPT" });
      const bookingId = acceptResult?.data?.treatmentBooking?.id;

      if (!bookingId) {
        toast.error("Could not retrieve booking details. Please contact support.");
        setIsRedirecting(false);
        return;
      }

      // Step 2: Create Stripe escrow checkout session → get redirect URL
      const sessionResult = await apiClient.treatmentBookings.createEscrowSession(bookingId);
      const checkoutUrl = sessionResult?.data?.url;

      if (!checkoutUrl) {
        toast.error("Could not initiate payment. Please try again.");
        setIsRedirecting(false);
        return;
      }

      // Step 3: Redirect to Stripe Checkout
      window.location.href = checkoutUrl;
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Payment initiation failed. Please try again.");
      setIsRedirecting(false);
    }
  };

  const handleRejectConfirm = () => {
    decisionMutation.mutate(
      {
        id: plan.id,
        payload: { action: "REJECT" },
      },
      {
        onSuccess: () => {
          toast.success("Treatment plan rejected.");
          setRejectModalOpen(false);
          router.push("/patient");
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || "Failed to reject treatment plan.");
        },
      }
    );
  };

  const formatTravelRange = () => {
    const from = plan.consultation?.intake?.travelFrom;
    const to = plan.consultation?.intake?.travelTo;
    if (!from || !to) return "Not specified";
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const optionsMonth: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
    const optionsYear: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
    if (fromDate.getFullYear() === toDate.getFullYear()) {
      if (fromDate.getMonth() === toDate.getMonth()) {
        return `${fromDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}-${toDate.getDate()}, ${fromDate.getFullYear()}`;
      }
      return `${fromDate.toLocaleDateString('en-US', optionsMonth)} - ${toDate.toLocaleDateString('en-US', optionsYear)}`;
    }
    return `${fromDate.toLocaleDateString('en-US', optionsYear)} - ${toDate.toLocaleDateString('en-US', optionsYear)}`;
  };

  const travelRange = formatTravelRange();

  const formatScheduledDate = () => {
    if (!plan.consultation?.scheduledDate) return "Not Scheduled";
    const dateObj = new Date(plan.consultation.scheduledDate);
    return dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const scheduledDate = formatScheduledDate();

  return (
    <>
      <SignatureModal
        isOpen={signModalOpen}
        onClose={() => setSignModalOpen(false)}
        onConfirm={(data) => {
          setSignatureData(data);
          setAgreed(true);
        }}
      />

      <RejectPlanModal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        onConfirm={handleRejectConfirm}
      />


      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-400 mb-4 hover:text-slate-600 transition-colors cursor-pointer"
      >
        <ChevronLeft className="size-5" />
        <span className="text-sm font-medium">Back</span>
      </button>

      <h1 className="text-2xl lg:text-3xl text-text font-bold mb-6">
        Review Plan
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ── Left column ──────────────────────────────────────────────────── */}
        <div className="lg:col-span-7 space-y-6">
          <SectionCard className=" p-5 md:p-6 ">
            {/* Doctor header */}
            <div className="flex items-center justify-between p-5 border  rounded-xl bg-white mb-8">
              <div className="flex items-center gap-4">
                <div className="relative size-16 rounded-full overflow-hidden bg-slate-100 shrink-0">
                  <Image
                    src={avatarSrc}
                    alt={doctorName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text">{doctorName}</h3>
                  <p className="text-sm text-[#475569] font-medium">{specialty}</p>
                </div>
              </div>
              <div className="bg-secondary text-primary px-3.5 py-2 rounded-full border border-[#B3D8FF] flex items-center gap-2 select-none">
                <ShieldCheck className="size-4 text-[#0086C9]" />
                <span className="text-[11px] font-bold uppercase tracking-wider">No Surprise Guarantee</span>
              </div>
            </div>

            {/* Treatment breakdown */}
            <h4 className="text-[17px] font-bold mb-4 text-text">Treatment plan breakdown</h4>
            <div className="border  rounded-xl overflow-hidden  bg-white">
              <div className="flex justify-between bg-slate-50 px-6 py-3.5 border-b  font-bold text-[13px] uppercase tracking-wider text-[#475569]">
                <span>Procedure breakdown</span>
                <span>Price</span>
              </div>
              <div className="divide-y divide-[#EEF2F6]">
                {plan.lineItems?.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between px-6 py-4 text-sm hover:bg-slate-50/50 transition-colors">
                    <span className="text-[#475569] font-medium">{item.globalProcedure?.name || "Procedure"}</span>
                    <span className="text-text font-semibold">
                      {Number(item.unitPrice) === 0 ? "Included" : `$${Number(item.unitPrice).toLocaleString()}`}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between px-6 py-5 bg-white border-t  font-bold text-text">
                  <span className="text-base">Estimate amount</span>
                  <span className="text-lg">
                    ${totalEstimate.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* 15% leeway */}
            <div className="mt-6 bg-[#F0F9FF] p-5 rounded-xl border border-[#B3D8FF] shadow-[0_1px_2px_rgba(14,62,101,0.02)]">
              <p className="text-primary font-bold mb-1 text-[15px]">15% leeway</p>
              <p className="text-[#203A55] text-sm leading-relaxed font-medium">
                Your final price on Day 1 will be within 15%. If Dr. {dentistUser?.lastName || "your dentist"}&apos;s
                final price exceeds 15%, you can Reject for a full refund. No questions asked.
              </p>
            </div>

            {/* Doctor's additional notes */}
            {plan.notes && (
              <div className="mt-4 p-4 rounded-xl border border-slate-100 bg-slate-50">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Doctor&apos;s Notes
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">{plan.notes}</p>
              </div>
            )}
          </SectionCard>

          {/* Consent checkbox */}
          <div className="flex items-start gap-3.5 px-1 py-4">
            <input
              type="checkbox"
              id="consent"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 size-5 rounded border-slate-300 text-[#0F3659] focus:ring-[#0F3659] cursor-pointer"
            />
            <label htmlFor="consent" className="text-slate-500 text-[13px] leading-relaxed cursor-pointer font-medium select-none">
              I have reviewed the treatment plan and understand the estimate range of 15%, with the No Surprise Guarantee
              offering a full refund if the final price exceeds 15%.
            </label>
          </div>
        </div>

        {/* ── Right column ─────────────────────────────────────────────────── */}
        <div className="lg:col-span-5 space-y-6">
          <SectionCard className=" p-5 md:p-6 ">
            <h4 className="text-lg font-bold mb-6 text-text">Estimate Timeline</h4>

            <div className="relative pl-6 ml-2 space-y-6 mb-8">
              {/* Connecting Line */}
              <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-primary/30" />

              {/* Bullet 1 */}
              <div className="relative flex items-start gap-4">
                <div className="absolute left-[-23px] top-1.5 size-3.5 rounded-full bg-primary border-4 border-white shrink-0 z-10" />
                <p className="text-sec-text text-sm font-semibold leading-relaxed">
                  You selected : <span className="text-black font-bold">{travelRange}</span>
                </p>
              </div>
              {/* Bullet 2 */}
              <div className="relative flex items-start gap-4">
                <div className="absolute left-[-23px] top-1.5 size-3.5 rounded-full bg-primary border-4 border-white shrink-0 z-10" />
                <p className="text-sec-text text-sm font-semibold leading-relaxed">
                  Treatment takes : <span className="text-black font-bold">4–5 days once you arrive</span>
                </p>
              </div>
              {/* Bullet 3 */}
              <div className="relative flex items-start gap-4">
                <div className="absolute left-[-23px] top-1.5 size-3.5 rounded-full bg-primary border-4 border-white shrink-0 z-10" />
                <p className="text-sec-text text-sm font-semibold leading-relaxed">
                  Appointment Date : <span className="text-black font-bold">{scheduledDate}</span>
                </p>
              </div>
            </div>

            {/* Sign to confirm */}
            <div className="mt-8 bg-slate-50 p-6 rounded-xl border border-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
              <h5 className="font-bold text-text text-[15px] mb-1">Sign to confirm plan</h5>
              <p className="text-[11px] text-slate-500 mb-4 font-semibold">
                Read each point carefully. You must agree to all three before your payment is processed.
              </p>

              {signatureData ? (
                <div className="relative h-32 bg-white border border-[#10B981] rounded-lg overflow-hidden ">
                  {signatureData.startsWith("data:image") ? (
                    <img
                      src={signatureData}
                      alt="Signature"
                      className="h-full w-full object-contain p-2"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <span className="text-3xl font-serif italic text-text">
                        {signatureData}
                      </span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setSignModalOpen(true)}
                    className="absolute top-2 right-2 text-[11px] font-semibold text-sec-text border border-slate-200 bg-white rounded-md px-2 py-1 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Resign
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setSignModalOpen(true)}
                  className="w-full h-32 bg-white border border-slate-200 rounded-lg flex items-center justify-center hover:border-[#0F3659] transition-all cursor-pointer  group"
                >
                  <div className="flex items-center gap-2 text-slate-500 group-hover:text-[#0F3659] transition-colors">
                    <svg className="w-5 h-5 text-slate-400 group-hover:text-[#0F3659] shrink-0 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 20C10 18 12 12 18 10C21 9 22 13 18 15C13 17 8 13 14 8C17 5 21 6 22 10" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-sm font-bold border-b-2 border-slate-400 group-hover:border-[#0F3659] pb-0.5">
                      click here to sign
                    </span>
                  </div>
                </button>
              )}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <div className="mt-8 border-t border-slate-200 pt-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 bg-[#F0F9FF] px-5 py-3.5 rounded-full border border-[#B3D8FF]">
            <ShieldCheck className="size-5 text-[#0369A1]" />
            <p className="text-[#0369A1] text-xs font-bold">
              Secure payment held in escrow · Released only on day 1 of your arrival · Payment protected by Stripe
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={() => setRejectModalOpen(true)}
              className="h-12 px-8 rounded-lg border border-slate-300 font-bold text-[#EF4444] hover:bg-red-50 transition-all cursor-pointer"
            >
              Reject
            </button>
            <button
              type="button"
              onClick={handleAccept}
              disabled={!agreed || !signatureData || isRedirecting}
              className={cn(
                "h-12 px-10 rounded-lg font-bold text-[15px] transition-all cursor-pointer",
                agreed && signatureData && !isRedirecting
                  ? "bg-[#0A2540] text-white hover:opacity-90 active:scale-95"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              )}
            >
              {isRedirecting ? "Redirecting to payment..." : `Pay $${totalEstimate.toLocaleString()} securely`}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
