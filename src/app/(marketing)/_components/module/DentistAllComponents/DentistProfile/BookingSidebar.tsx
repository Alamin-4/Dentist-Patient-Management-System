import Image from "next/image";
import { ShieldCheck, MapPin, Globe, Star, FileText, Pen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BookingSidebar({ dentist }: { dentist: any }) {
  return (
    <aside className="lg:sticky lg:top-24 w-full rounded-lg border border-slate-200 bg-white p-6">
      <div className="flex gap-5 mb-6">
        <div className="flex flex-col gap-4 items-center">
          <div className="relative size-24 shrink-0 overflow-hidden rounded-full ring-4 ring-slate-50">
            <Image
              src={dentist.image}
              alt={dentist.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex w-full flex-col items-center gap-2">
            <div className="flex items-center gap-1 text-xs font-medium text-[#1A1A2E]">
              <ShieldCheck className="size-4 text-[#4CA30D]" />
              VERIFIED
            </div>

            <div className="flex items-center justify-center gap-2 rounded-md border border-slate-200 px-3 py-1.5 text-center">
              <div className="font-extrabold text-[#0E3E65]">
                {dentist.rdvScore}
              </div>
              <div className="text-xs font-medium text-[#1A1A2E]">
                RDV Score
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xl md:text-2xl lg:text-3xl font-bold text-[#0E3E65]">
            {dentist.name}
          </p>
          <p className="font-medium text-[#1A1A2E]">{dentist.specialty}</p>
          <div className="flex flex-col lg:flex-row lg:items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-[#003366]">5.0</span>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>
            </div>
            <button className="text-xs flex items-center justify-start gap-1 text-[#003366] border-b cursor-pointer ml-2">
              <Pen size={14} /> Write a review
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6 border-t border-slate-200 pt-6">
        <div className="space-y-4 text-[#6B7280]">
          <div className="flex items-center gap-3">
            <MapPin className="size-5" /> Mexico City, Mexico
          </div>
          <div className="flex items-center gap-3">
            <FileText className="size-5" /> License No.{" "}
            <span className="text-slate-900">MX-2847361</span>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex items-center gap-2 rounded-full bg-[#EEF8FF] px-4 py-2 text-xs text-medium text-[#0E3E65]">
            <ShieldCheck className="size-4" /> No Surprise Guarantee
          </div>
          <div className="flex items-center gap-2 rounded-full bg-[#EEF8FF] px-4 py-2 text-xs text-medium text-[#0E3E65]">
            <Globe className="size-4" /> EN · ES
          </div>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between gap-6">
        <div>
          <p className="text-xs text-[#6B7280]">Starting at</p>
          <p className="text-xl lg:text-2xl font-extrabold text-[#0E3E65]">
            $1,500
          </p>
        </div>
        <Button className="h-14 flex-1 bg-[#0E3E65] font-semibold text-white hover:bg-[#002850]">
          Book consultation
        </Button>
      </div>
    </aside>
  );
}
