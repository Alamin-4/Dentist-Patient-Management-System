"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  consultationFlowData,
  getConsultationFlowItemBySlug,
} from "@/app/(dashboard)/patient/_components/Module/MyBooking/data";

export default function ConsultationMeetingPage() {
  const router = useRouter();
  const params = useParams();
  const slug =
    typeof params.slug === "string"
      ? params.slug
      : consultationFlowData[0].slug;
  const consultation = getConsultationFlowItemBySlug(slug);
  const [micMuted, setMicMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);

  return (
    /* 1. Uses h-[calc(100vh-theme(spacing.12))] (adjusted to fit within standard layout dashboard shell space)
      2. Uses max-h-full layout with flex-col to force everything inside the boundaries 
    */
    <div className="flex flex-col h-screen max-h-screen w-full rounded-xl border border-border bg-card p-6 font-sans antialiased overflow-hidden">
      {/* Header Container Area */}
      <div className="flex-none flex items-start justify-between gap-4 border-b border-border pb-4">
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
            Consultation
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            Secure video session with {consultation.doctor.name}
          </p>
        </div>

        <div className="text-right">
          <p className="text-lg font-bold text-foreground tabular-nums tracking-tight">
            00:14:12
          </p>
          <p className="text-[11px] text-muted-foreground uppercase font-semibold tracking-wider">
            Time Remaining
          </p>
        </div>
      </div>

      {/* Main Dynamically Sized Dynamic Video Area Box */}
      <div className="flex-1 min-h-0 py-4 flex flex-col justify-between gap-4">
        {/* Core Video Dynamic Sandbox Container */}
        <div className="relative flex-1 min-h-0 w-full rounded-xl border border-border bg-gray-50 overflow-hidden group">
          {/* Main Stage Doctor Feed */}
          <div className="relative w-full h-full bg-navy-900 flex items-center justify-center">
            <Image
              src="/images/ai-smile-preview.png"
              alt="Consultation video background"
              fill
              className="object-cover object-center"
              priority
            />
            {/* Subtle Gradient Shadow Overlay on feed top/bottom edges */}
            <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/30 pointer-events-none" />

            {/* Doctor Label Tag Badge Component */}
            <div className="absolute left-4 top-4 rounded-lg bg-navy-800/90 text-navy-50 text-xs font-medium px-3 py-1.5 backdrop-blur-sm border border-navy-700">
              {consultation.doctor.name}
            </div>

            {/* PIP Frame Component Layout Positioning */}
            <div className="absolute bottom-4 right-4 w-40 sm:w-48 md:w-56 overflow-hidden rounded-xl border border-white/20 bg-navy-800 shadow-md transition-all duration-300">
              <div className="relative aspect-4/3 w-full bg-gray-100">
                <div className="absolute inset-0 flex items-center justify-center bg-navy-900">
                  <Image
                    src="https://i.pravatar.cc/200?img=12"
                    alt="You"
                    width={56}
                    height={56}
                    className="rounded-full border-2 border-white/10"
                  />
                </div>
                <div className="absolute bottom-2 left-2 rounded-md bg-navy-800/80 px-2 py-0.5 text-[11px] font-medium text-navy-100 backdrop-blur-sm">
                  You
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls Toolbar Module Utility */}
        <div className="flex-none flex items-center justify-center rounded-xl border border-border bg-white p-3">
          <div className="flex items-center justify-center gap-3">
            {/* Mic Toggle Trigger */}
            <button
              type="button"
              onClick={() => setMicMuted((value) => !value)}
              className={cn(
                "size-11 rounded-lg border flex items-center justify-center transition-all duration-150 cursor-pointer active:scale-95",
                micMuted
                  ? "border-[#113254] bg-[#113254] text-white hover:bg-[#0d2844]"
                  : "border-[#E5E7EB] bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]",
              )}
            >
              {micMuted ? (
                <MicOff className="size-5" />
              ) : (
                <Mic className="size-5" />
              )}
            </button>

            {/* Camera Toggle Trigger */}
            <button
              type="button"
              onClick={() => setCameraOff((value) => !value)}
              className={cn(
                "size-11 rounded-lg border flex items-center justify-center transition-all duration-150 cursor-pointer active:scale-95",
                cameraOff
                  ? "border-[#113254] bg-[#113254] text-white hover:bg-[#0d2844]"
                  : "border-[#E5E7EB] bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]",
              )}
            >
              {cameraOff ? (
                <VideoOff className="size-5" />
              ) : (
                <Video className="size-5" />
              )}
            </button>

            {/* End Call Direct Action CTA */}
            <Button
              type="button"
              onClick={() => router.push(`/consultation/${slug}/complete`)}
              className="bg-[#D94B45] hover:bg-[#c33d37] text-white text-xs font-bold tracking-tight px-5 h-11 rounded-lg transition-all active:scale-95 cursor-pointer"
            >
              End consultation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
