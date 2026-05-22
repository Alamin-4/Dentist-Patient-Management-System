"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  Info,
  ShieldCheck,
  Signature,
  Award,
  RotateCcw,
  Check,
  X,
  InfoIcon,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import PaymentSuccessModal from "../../../_components/Module/MyBooking/Modal/PaySuccessModal";
import { treatmentPlansData } from "../../../_components/Module/MyBooking/data";

const SectionCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "bg-white rounded-2xl p-6 border border-slate-100 ",
      className,
    )}
  >
    {children}
  </div>
);

/**
 * Functional Signature Modal based on image_3b35c0.png
 */
const SignatureModal = ({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: string) => void;
}) => {
  const [activeTab, setActiveTab] = useState<"draw" | "type">("draw");
  const [typedName, setTypedName] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (activeTab === "draw" && isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.strokeStyle = "#000000";
      }
    }
  }, [activeTab, isOpen]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = ("touches" in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ("touches" in e ? e.touches[0].clientY : e.clientY) - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = ("touches" in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ("touches" in e ? e.touches[0].clientY : e.clientY) - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => setIsDrawing(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleConfirm = () => {
    if (activeTab === "draw" && canvasRef.current) {
      // Check if canvas is empty (simplified)
      onConfirm(canvasRef.current.toDataURL());
    } else if (typedName.trim()) {
      onConfirm(typedName);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-xl font-bold text-[#1A1A2E]">E-Signature</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-full"
          >
            <X className="size-6 text-slate-400" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex bg-[#F8FAFC] p-1 rounded-xl mb-6">
            <button
              onClick={() => setActiveTab("draw")}
              className={cn(
                "flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all",
                activeTab === "draw"
                  ? "bg-white shadow-sm text-[#1A1A2E]"
                  : "text-slate-400",
              )}
            >
              Draw
            </button>
            <button
              onClick={() => setActiveTab("type")}
              className={cn(
                "flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all",
                activeTab === "type"
                  ? "bg-white shadow-sm text-[#1A1A2E]"
                  : "text-slate-400",
              )}
            >
              Type
            </button>
          </div>

          <div className="relative border border-slate-200 rounded-xl overflow-hidden min-h-50 bg-white">
            {activeTab === "draw" ? (
              <>
                <canvas
                  ref={canvasRef}
                  width={500}
                  height={200}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-50 cursor-crosshair touch-none"
                />
                <button
                  onClick={clearCanvas}
                  className="absolute top-3 right-3 p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400"
                >
                  <RotateCcw className="size-5" />
                </button>
              </>
            ) : (
              <div className="p-8 flex items-center justify-center h-50">
                <input
                  type="text"
                  placeholder="Type your name here..."
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  className="w-full text-4xl text-center font-serif italic border-none focus:ring-0 placeholder:text-slate-200 text-[#1A1A2E]"
                />
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-6 border-t border-slate-100 flex items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-[#1A1A2E] hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 bg-[#0F3659] text-white rounded-xl font-bold hover:bg-[#0A2640]"
          >
            Confirm Sign
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default function TreatmentDetailsPage() {
  const { slug } = useParams();
  const router = useRouter();

  // State Management
  const [agreed, setAgreed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const plan =
    treatmentPlansData.find((p) => p.slug === slug) || treatmentPlansData[0];
  const payhandler = () => {
    setShowSuccess(true);
  };

  return (
    <div className="">
      <SignatureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={(data) => setSignatureData(data)}
      />
      <PaymentSuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
      />

      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-400 mb-4"
      >
        <ChevronLeft className="size-5" />
        <span className="text-sm font-medium">Back</span>
      </button>

      <h1 className="text-2xl lg:text-3xl text-[#1A1A2E] font-bold mb-6">
        Review Plan
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <SectionCard className="text-black">
            <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl mb-8">
              <div className="flex items-center gap-4">
                <div className="relative size-16 rounded-full overflow-hidden bg-slate-100">
                  <Image
                    src={plan.doctor.image}
                    alt={plan.doctor.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1A1A2E]">
                    {plan.doctor.name}
                  </h3>
                  <p className="text-sm text-[#475569]">
                    {plan.doctor.specialty}
                  </p>
                </div>
              </div>
              <div className="bg-[#EEF8FF] text-[#0E3E65] px-3 py-1.5 rounded-full border border-[#B3D8FF] flex items-center gap-2">
                <Award className="size-4" />
                <span className="text-xs font-semibold uppercase">
                  No Surprise Guarantee
                </span>
              </div>
            </div>

            <h4 className="font-semibold mb-4 text-[#1A1A2E]">
              Treatment plan breakdown
            </h4>
            <div className="border border-slate-100 rounded-xl overflow-hidden">
              <div className="flex justify-between bg-slate-50 px-4 py-3 border-b border-slate-100 font-bold text-sm">
                <span>Procedure breakdown</span>
                <span>Price</span>
              </div>
              <div className="divide-y divide-slate-50">
                {plan.procedure.breakdown.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between px-4 py-4 text-sm"
                  >
                    <span className="text-[#64748B]">{item.label}</span>
                    <span className="text-[#1E293B] font-semibold">
                      ${item.price.toLocaleString()}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between px-4 py-5 bg-white border-t-2 border-slate-100">
                  <span className="text-[#1A1A2E] font-bold">
                    Estimate amount
                  </span>
                  <span className="text-[#1A1A2E] font-bold text-lg">
                    ${plan.procedure.totalEstimate.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-[#F0F9FF] p-5 rounded-xl border border-[#B3D8FF]">
              <p className="text-[#0E3E65] font-bold mb-1">15% leeway</p>
              <p className="text-[#203A55] text-sm leading-relaxed">
                Your final price on Day 1 will be within $161 of $
                {plan.procedure.totalEstimate.toLocaleString()}.
              </p>
            </div>
          </SectionCard>

          <div className="flex items-center gap-3 px-2 py-4">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 size-5 rounded border-slate-300 text-[#0F3659] focus:ring-[#0F3659] cursor-pointer"
            />
            <p className="text-slate-500 text-sm leading-relaxed">
              I have reviewed the treatment plan and understand the estimate
              range of $1,075, with the No Surprise Guarantee offering a full
              refund if the final price exceeds $1,236.
            </p>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <SectionCard className="text-black">
            <h4 className="text-lg font-bold mb-6">Estimate Timeline</h4>
            <div className="relative space-y-8">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#0E3E65] rounded-full" />
                <p className="text-[#6B7280] text-sm">
                  Estimated treatment days:{" "}
                  <span className="text-black font-bold">
                    {plan.timeline.days}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#0E3E65] rounded-full" />
                <p className="text-[#6B7280] text-sm">
                  Recommended stay:{" "}
                  <span className="text-black font-bold">
                    {plan.timeline.dates}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <InfoIcon className="text-[#0E3E65]" />
                <p className="text-sm text-[#0E3E65]">
                  Available treatment dates shared after payment confirmation.
                </p>
              </div>
            </div>

            <div className="mt-10 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h5 className="font-bold text-[#1A1A2E] mb-1">
                Sign to confirm plan
              </h5>
              <p className="text-[11px] text-slate-500 mb-4">
                You must sign before your payment is processed.
              </p>

              <div
                onClick={() => setIsModalOpen(true)}
                className="h-32 bg-white border-2 border-slate-200 border-dashed rounded-xl flex items-center justify-center cursor-pointer hover:border-[#0F3659] transition-all overflow-hidden"
              >
                {signatureData ? (
                  signatureData.startsWith("data:image") ? (
                    <img
                      src={signatureData}
                      alt="Signature"
                      className="h-full object-contain p-2"
                    />
                  ) : (
                    <span className="text-3xl font-serif italic text-[#1A1A2E]">
                      {signatureData}
                    </span>
                  )
                ) : (
                  <div className="flex items-center gap-2 text-slate-500">
                    <Signature className="size-5" />
                    <span className="font-bold border-b-2 border-black pb-0.5">
                      click here to sign
                    </span>
                  </div>
                )}
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      <div className="mt-8 border-t border-slate-200 pt-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 bg-[#F0F9FF] px-4 py-3 rounded-lg border border-[#B3D8FF]">
            <ShieldCheck className="size-5 text-[#0369A1]" />
            <p className="text-[#0369A1] text-xs font-medium">
              Secure payment protected by Stripe
            </p>
          </div>
          <button
            onClick={payhandler}
            disabled={!agreed || !signatureData}
            className={cn(
              "w-full md:w-auto px-10 py-4 rounded-xl font-bold text-lg transition-all",
              agreed && signatureData
                ? "bg-[#0F3659] text-white hover:bg-[#0A2640]"
                : "bg-slate-200 text-slate-400 cursor-not-allowed",
            )}
          >
            Pay ${plan.procedure.totalEstimate.toLocaleString()} securely
          </button>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
