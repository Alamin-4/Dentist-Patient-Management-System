"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ShieldCheck, MapPin, Globe, Star, FileText, Pen, Loader2, Check, AlertCircle, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useMe } from "@/hooks/auth/useAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  useClaimDentistDirectoryProfile,
  useRequestDirectoryConsultation,
  useSimulateStripeWebhook,
} from "@/hooks/dentist/useDentistDirectory";

export default function BookingSidebar({ dentist }: { dentist: any }) {
  const { user } = useMe();
  const searchParams = useSearchParams();

  const [isClaimOpen, setIsClaimOpen] = useState(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  // Auto-open claim dialog if ?claim=true is in URL
  useEffect(() => {
    if (searchParams.get("claim") === "true") {
      setIsClaimOpen(true);
    }
  }, [searchParams]);

  // Consultation Request State
  const requestMutation = useRequestDirectoryConsultation();
  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [consultationMessage, setConsultationMessage] = useState("");

  const handleRequestConsultationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !patientEmail) {
      toast.error("Please fill in name and email fields.");
      return;
    }

    const toastId = toast.loading("Sending consultation request...");
    requestMutation.mutate(
      {
        slug: dentist.slug,
        payload: {
          patientName,
          patientEmail,
          message: consultationMessage,
        },
      },
      {
        onSuccess: () => {
          toast.success("Consultation request sent successfully!", { id: toastId });
          setIsConsultationOpen(false);
          setPatientName("");
          setPatientEmail("");
          setConsultationMessage("");
        },
        onError: (err: any) => {
          const errMsg = err?.response?.data?.message || err?.message || "Failed to send consultation request.";
          toast.error(errMsg, { id: toastId });
        },
      }
    );
  };

  // Claim Profile Wizard State
  const claimMutation = useClaimDentistDirectoryProfile();
  const webhookMutation = useSimulateStripeWebhook();

  const [claimStep, setClaimStep] = useState(1);
  const [claimEmail, setClaimEmail] = useState("");
  const [claimPassword, setClaimPassword] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState(5);
  const [motivation, setMotivation] = useState("");
  const [internationalPatients, setInternationalPatients] = useState(10);
  const [selectedPlan, setSelectedPlan] = useState("1_YEAR");

  // Checkboxes
  const [hasSterilizationDocs, setHasSterilizationDocs] = useState(false);
  const [hasBeforeAfterPhotos, setHasBeforeAfterPhotos] = useState(false);
  const [hasMaterialsDocs, setHasMaterialsDocs] = useState(false);
  const [hasEducationCertificates, setHasEducationCertificates] = useState(false);
  const [hasGuarantees, setHasGuarantees] = useState(false);

  // Card Info (Mock)
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("123");

  // Autofill email if user logged in
  useEffect(() => {
    if (user?.email) {
      setClaimEmail(user.email);
    }
  }, [user]);

  const handleNextStep = () => {
    if (claimStep === 1) {
      if (!user && (!claimEmail || !claimPassword)) {
        toast.error("Please provide email and password to create your account.");
        return;
      }
      if (yearsOfExperience < 0) {
        toast.error("Experience must be a positive number.");
        return;
      }
      setClaimStep(2);
    } else if (claimStep === 2) {
      if (!hasSterilizationDocs || !hasBeforeAfterPhotos || !hasMaterialsDocs || !hasEducationCertificates || !hasGuarantees) {
        toast.error("You must fulfill and agree to all quality standards to claim this profile.");
        return;
      }
      setClaimStep(3);
    }
  };

  const handleClaimAndPay = async () => {
    const toastId = toast.loading("Processing claim registration...");
    
    // 1. Submit claim payload to backend
    claimMutation.mutate(
      {
        slug: dentist.slug,
        payload: {
          email: claimEmail,
          password: user ? undefined : claimPassword,
          yearsOfExperience: Number(yearsOfExperience),
          motivation,
          internationalPatients: Number(internationalPatients),
          procedures: [dentist.specialty],
          hasSterilizationDocs,
          hasBeforeAfterPhotos,
          hasMaterialsDocs,
          hasEducationCertificates,
          hasGuarantees,
        },
      },
      {
        onSuccess: async (claimResponse: any) => {
          const dentistDirectoryId = claimResponse?.data?.id;
          if (!dentistDirectoryId) {
            toast.error("Invalid response from server. Directory ID not found.", { id: toastId });
            return;
          }

          toast.loading("Simulating secure Stripe checkout completion...", { id: toastId });

          // 2. Trigger simulated Stripe webhook in backend to mark as PAID & claimed
          webhookMutation.mutate(
            {
              type: "checkout.session.completed",
              data: {
                object: {
                  metadata: {
                    dentistDirectoryId,
                    membershipPlan: selectedPlan,
                  },
                },
              },
            },
            {
              onSuccess: () => {
                toast.success("Profile successfully claimed & payment verified!", { id: toastId });
                setClaimStep(4); // Success screen!
              },
              onError: (err: any) => {
                const errMsg = err?.response?.data?.message || err?.message || "Payment simulation failed.";
                toast.error(`Claim registered but payment failed: ${errMsg}`, { id: toastId });
              },
            }
          );
        },
        onError: (err: any) => {
          const errMsg = err?.response?.data?.message || err?.message || "Failed to register profile claim.";
          toast.error(errMsg, { id: toastId });
        },
      }
    );
  };

  return (
    <aside className="lg:sticky lg:top-24 w-full rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex gap-5 mb-6">
        <div className="flex flex-col gap-4 items-center">
          <div className="relative size-24 shrink-0 overflow-hidden rounded-full ring-4 ring-slate-50 bg-slate-100">
            <Image
              src={dentist.image || "/placeholder-avatar.png"}
              alt={dentist.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex w-full flex-col items-center gap-2">
            {dentist.verified ? (
              <div className="flex items-center gap-1 text-xs font-semibold text-[#1A1A2E]">
                <ShieldCheck className="size-4 text-[#4CA30D]" />
                VERIFIED
              </div>
            ) : dentist.status === "CLAIMED" ? (
              <div className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                CLAIMED
              </div>
            ) : (
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                DIRECTORY
              </div>
            )}

            <div className="flex items-center justify-center gap-2 rounded-md border border-slate-200 px-3 py-1.5 text-center">
              <div className="font-extrabold text-[#0E3E65]">
                {dentist.verified ? dentist.rdvScore : "—"}
              </div>
              <div className="text-xs font-medium text-[#1A1A2E]">
                RDV Score
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-2 min-w-0">
          <p className="text-xl md:text-2xl font-bold text-[#0E3E65] truncate">
            {dentist.name}
          </p>
          <p className="font-semibold text-[#1A1A2E]">{dentist.specialty}</p>
          <div className="flex flex-col lg:flex-row lg:items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-[#003366]">{dentist.rating}</span>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-4 fill-current text-amber-400" />
                ))}
              </div>
            </div>
            <button className="text-xs flex items-center justify-start gap-1 text-[#003366] border-b cursor-pointer lg:ml-2">
              <Pen size={14} /> Write a review
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6 border-t border-slate-200 pt-6">
        <div className="space-y-4 text-[#6B7280]">
          <div className="flex items-center gap-3">
            <MapPin className="size-5 text-slate-400" /> {dentist.location}
          </div>
          <div className="flex items-center gap-3">
            <FileText className="size-5 text-slate-400" /> License No.{" "}
            <span className="text-slate-900">{dentist.verified ? "MX-2847361" : "Pending Claim"}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 rounded-full bg-[#EEF8FF] px-4 py-2 text-xs font-medium text-[#0E3E65]">
            <ShieldCheck className="size-4 text-[#003366]" /> No Surprise Guarantee
          </div>
          <div className="flex items-center gap-2 rounded-full bg-[#EEF8FF] px-4 py-2 text-xs font-medium text-[#0E3E65]">
            <Globe className="size-4 text-[#003366]" /> {dentist.languages.join(" · ")}
          </div>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between gap-6">
        <div>
          <p className="text-xs text-[#6B7280]">Starting at</p>
          <p className="text-xl lg:text-2xl font-extrabold text-[#0E3E65]">
            ${dentist.price ? dentist.price.toLocaleString() : "1,500"}
          </p>
        </div>

        {dentist.verified ? (
          <Button className="h-14 flex-1 bg-[#0E3E65] font-semibold text-white hover:bg-[#002850]">
            Book consultation
          </Button>
        ) : (
          <div className="flex flex-col gap-2 flex-1">
            {dentist.isClaimable && dentist.status === "UNVERIFIED" && (
              <Button
                variant="outline"
                className="h-11 border-amber-500 text-amber-700 bg-amber-50/50 hover:bg-amber-50 font-bold"
                onClick={() => setIsClaimOpen(true)}
              >
                Claim Profile
              </Button>
            )}
            <Button
              className="h-11 bg-[#0E3E65] font-semibold text-white hover:bg-[#002850]"
              onClick={() => setIsConsultationOpen(true)}
            >
              Request Consultation
            </Button>
          </div>
        )}
      </div>

      {/* ── Consultation Request Modal ─────────────────────────────────── */}
      <Dialog open={isConsultationOpen} onOpenChange={setIsConsultationOpen}>
        <DialogContent className="sm:max-w-md bg-white border border-slate-200 shadow-xl rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-[#0E3E65] font-bold text-xl">Request a Consultation</DialogTitle>
            <DialogDescription className="text-slate-500">
              Dr. {dentist.name} is not yet verified on RatedDocs. We can coordinate this appointment manually for you.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRequestConsultationSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="patientName" className="font-semibold text-slate-700">Full Name</Label>
              <Input
                id="patientName"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Enter your full name"
                required
                className="border-slate-200 focus:border-[#0E3E65]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="patientEmail" className="font-semibold text-slate-700">Email Address</Label>
              <Input
                id="patientEmail"
                type="email"
                value={patientEmail}
                onChange={(e) => setPatientEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="border-slate-200 focus:border-[#0E3E65]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message" className="font-semibold text-slate-700">Medical Notes / Message</Label>
              <Textarea
                id="message"
                value={consultationMessage}
                onChange={(e) => setConsultationMessage(e.target.value)}
                placeholder="Describe your dental issue or preferred appointment date..."
                className="border-slate-200 focus:border-[#0E3E65] min-h-[80px]"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsConsultationOpen(false)}
                className="border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={requestMutation.isPending}
                className="bg-[#0E3E65] hover:bg-[#002850] text-white font-semibold"
              >
                {requestMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Request"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Claim Profile Wizard Modal ─────────────────────────────────── */}
      <Dialog open={isClaimOpen} onOpenChange={setIsClaimOpen}>
        <DialogContent className="sm:max-w-lg bg-white border border-slate-200 shadow-2xl rounded-xl overflow-hidden p-0">
          <div className="bg-[#0E3E65] text-white p-6">
            <h3 className="text-xl font-bold">Claim Dentist Profile</h3>
            <p className="text-sky-100 text-xs mt-1">
              Verify your identity, select a premium plan, and start getting international patient leads.
            </p>

            {/* Step Indicators */}
            <div className="flex items-center gap-2 mt-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-1">
                  <div
                    className={`size-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      claimStep >= s
                        ? "bg-amber-400 text-[#0E3E65] scale-110"
                        : "bg-[#0E3E65] border border-sky-400/40 text-sky-200"
                    }`}
                  >
                    {claimStep > s ? <Check className="size-3.5 stroke-[3]" /> : s}
                  </div>
                  {s < 3 && <div className={`w-8 h-[2px] ${claimStep > s ? "bg-amber-400" : "bg-sky-400/20"}`} />}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Step 1: Onboarding Credentials */}
            {claimStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-700 font-semibold">Email Address</Label>
                  <Input
                    type="email"
                    value={claimEmail}
                    onChange={(e) => setClaimEmail(e.target.value)}
                    disabled={!!user}
                    placeholder="Enter professional email"
                    className="border-slate-200 focus:border-[#0E3E65]"
                  />
                  {user && (
                    <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                      <ShieldCheck className="size-3.5" /> Logged in session account auto-filled
                    </p>
                  )}
                </div>

                {!user && (
                  <div className="space-y-2 animate-fadeIn">
                    <Label className="text-slate-700 font-semibold">Create Password</Label>
                    <Input
                      type="password"
                      value={claimPassword}
                      onChange={(e) => setClaimPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      className="border-slate-200 focus:border-[#0E3E65]"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold">Years of Experience</Label>
                    <Input
                      type="number"
                      value={yearsOfExperience}
                      onChange={(e) => setYearsOfExperience(Number(e.target.value))}
                      className="border-slate-200 focus:border-[#0E3E65]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold">International Patients (%)</Label>
                    <Input
                      type="number"
                      value={internationalPatients}
                      onChange={(e) => setInternationalPatients(Number(e.target.value))}
                      className="border-slate-200 focus:border-[#0E3E65]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700 font-semibold">Professional Bio / Motivation</Label>
                  <Textarea
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    placeholder="Tell patients about your dental approach and clinical background..."
                    className="border-slate-200 focus:border-[#0E3E65] min-h-[80px]"
                  />
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <Button
                    onClick={handleNextStep}
                    className="bg-[#0E3E65] hover:bg-[#002850] text-white font-semibold"
                  >
                    Continue to Standards
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Quality Checkmarks */}
            {claimStep === 2 && (
              <div className="space-y-4">
                <div className="rounded-lg bg-amber-50/50 border border-amber-200 p-4 mb-2">
                  <p className="text-amber-800 text-xs font-medium flex items-center gap-1.5">
                    <AlertCircle className="size-4" /> Please verify you adhere to RatedDocs medical protocols:
                  </p>
                </div>

                <div className="space-y-4 py-2">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="steril"
                      checked={hasSterilizationDocs}
                      onCheckedChange={(checked) => setHasSterilizationDocs(!!checked)}
                      className="mt-1 data-[state=checked]:bg-[#0E3E65]"
                    />
                    <label htmlFor="steril" className="text-sm font-medium text-slate-600 cursor-pointer">
                      I maintain detailed sterilization logs for all dental apparatuses
                    </label>
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="photos"
                      checked={hasBeforeAfterPhotos}
                      onCheckedChange={(checked) => setHasBeforeAfterPhotos(!!checked)}
                      className="mt-1 data-[state=checked]:bg-[#0E3E65]"
                    />
                    <label htmlFor="photos" className="text-sm font-medium text-slate-600 cursor-pointer">
                      I possess clear and verifiable before & after treatment photos
                    </label>
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="materials"
                      checked={hasMaterialsDocs}
                      onCheckedChange={(checked) => setHasMaterialsDocs(!!checked)}
                      className="mt-1 data-[state=checked]:bg-[#0E3E65]"
                    />
                    <label htmlFor="materials" className="text-sm font-medium text-slate-600 cursor-pointer">
                      I only utilize FDA / CE approved dental implant and crown materials
                    </label>
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="education"
                      checked={hasEducationCertificates}
                      onCheckedChange={(checked) => setHasEducationCertificates(!!checked)}
                      className="mt-1 data-[state=checked]:bg-[#0E3E65]"
                    />
                    <label htmlFor="education" className="text-sm font-medium text-slate-600 cursor-pointer">
                      I hold authentic, accredited certificates of dentistry education & license
                    </label>
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="guarantees"
                      checked={hasGuarantees}
                      onCheckedChange={(checked) => setHasGuarantees(!!checked)}
                      className="mt-1 data-[state=checked]:bg-[#0E3E65]"
                    />
                    <label htmlFor="guarantees" className="text-sm font-medium text-slate-600 cursor-pointer">
                      I agree to offer the RatedDocs "No Surprise Price Guarantee" for patients
                    </label>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <Button
                    variant="outline"
                    onClick={() => setClaimStep(1)}
                    className="border-slate-200 text-slate-600 hover:bg-slate-50"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleNextStep}
                    className="bg-[#0E3E65] hover:bg-[#002850] text-white font-semibold"
                  >
                    Continue to Payment
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Secure Payment Simulation */}
            {claimStep === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <div
                    onClick={() => setSelectedPlan("6_MONTH")}
                    className={`border rounded-lg p-3 text-center cursor-pointer transition-all ${
                      selectedPlan === "6_MONTH"
                        ? "border-[#0E3E65] bg-sky-50/40 ring-1 ring-[#0E3E65]"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <span className="block text-xs font-bold text-slate-500 uppercase">6 Months</span>
                    <span className="block text-xl font-extrabold text-[#0E3E65] mt-1">$89</span>
                  </div>
                  <div
                    onClick={() => setSelectedPlan("1_YEAR")}
                    className={`border rounded-lg p-3 text-center cursor-pointer transition-all ${
                      selectedPlan === "1_YEAR"
                        ? "border-[#0E3E65] bg-sky-50/40 ring-1 ring-[#0E3E65]"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <span className="block text-xs font-bold text-slate-500 uppercase">1 Year</span>
                    <span className="block text-xl font-extrabold text-[#0E3E65] mt-1">$149</span>
                  </div>
                </div>

                {/* Credit Card Simulation Form */}
                <div className="rounded-lg border border-slate-200 p-4 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                    <span>SECURE CARD PAYMENT</span>
                    <span className="text-emerald-600 flex items-center gap-1">
                      <ShieldCheck className="size-3.5" /> 256-bit SSL
                    </span>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] text-slate-500 uppercase">Card Number</Label>
                    <Input
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="bg-white border-slate-200 h-10 font-mono text-slate-700"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[11px] text-slate-500 uppercase">Expiry</Label>
                      <Input
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="bg-white border-slate-200 h-10 font-mono text-slate-700"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] text-slate-500 uppercase">CVC</Label>
                      <Input
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="bg-white border-slate-200 h-10 font-mono text-slate-700"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <Button
                    variant="outline"
                    onClick={() => setClaimStep(2)}
                    disabled={claimMutation.isPending || webhookMutation.isPending}
                    className="border-slate-200 text-slate-600 hover:bg-slate-50"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleClaimAndPay}
                    disabled={claimMutation.isPending || webhookMutation.isPending}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 shadow-md transition-colors"
                  >
                    {claimMutation.isPending || webhookMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Pay $${selectedPlan === "1_YEAR" ? "149" : "89"} & Claim`
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Success Celebratory Screen */}
            {claimStep === 4 && (
              <div className="text-center py-6 space-y-4 animate-scaleUp">
                <div className="mx-auto size-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <ShieldCheck className="size-10 stroke-[1.5]" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-slate-900">Congratulations, Dr. {dentist.name}!</h4>
                  <p className="text-slate-500 text-sm max-w-sm mx-auto">
                    Your profile claim was registered, and membership status has been successfully updated via Stripe.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-150 inline-block text-left text-xs space-y-1.5 text-slate-600">
                  <p className="flex items-center gap-1.5 font-medium text-slate-800">
                    <Check className="size-4 text-emerald-500 stroke-[3]" /> Credentials registered successfully
                  </p>
                  <p className="flex items-center gap-1.5 font-medium text-slate-800">
                    <Check className="size-4 text-emerald-500 stroke-[3]" /> Stripe signature and payment verified
                  </p>
                  <p className="flex items-center gap-1.5 font-medium text-slate-800">
                    <Check className="size-4 text-emerald-500 stroke-[3]" /> EJS Email template notifications dispatched
                  </p>
                </div>

                <div className="pt-4">
                  <Button
                    onClick={() => {
                      setIsClaimOpen(false);
                      window.location.reload(); // Reload to refresh profile state
                    }}
                    className="bg-[#0E3E65] hover:bg-[#002850] text-white font-semibold px-8"
                  >
                    Finish & View Profile
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </aside>
  );
}
