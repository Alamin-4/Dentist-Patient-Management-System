
import Image from "next/image";
import { BadgeCheck, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ResultCardProps {
  title: string;
  patientName: string;
  date: string;
  location: string;
  beforeImage: string;
  afterImage: string;
  status?: string;
  className?: string;
}

export default function ResultCard({
  title,
  patientName,
  date,
  location,
  beforeImage,
  afterImage,
  status = "Authenticated",
  className,
}: ResultCardProps) {
  return (
    <article
      className={cn(
        "overflow-hidden rounded-[20px] border border-[#DDE5F0] bg-white shadow-[0_8px_24px_rgba(17,50,84,0.04)]",
        className,
      )}
    >
      <div className="grid grid-cols-2 gap-0.5 bg-[#EEF3F8] p-0.5">
        <div className="relative aspect-square overflow-hidden bg-slate-100">
          <Image
            src={beforeImage}
            alt={`${title} before`}
            fill
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
            className="object-cover"
          />
        </div>
        <div className="relative aspect-square overflow-hidden bg-slate-100">
          <Image
            src={afterImage}
            alt={`${title} after`}
            fill
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="space-y-3 px-4 py-4 sm:px-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-[17px] font-semibold leading-6 text-[#1A1A2E] sm:text-[18px]">
              {title}
            </h3>
            <p className="mt-1 text-[13px] font-medium leading-5 text-[#7B8794] sm:text-[14px]">
              Patient: {patientName} · {date}
            </p>
          </div>

          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#E7FAF3] px-2.5 py-1 text-[11px] font-medium leading-none text-[#11B87D]">
            <BadgeCheck className="size-3.5" />
            {status}
          </span>
        </div>

        <div className="h-px bg-[#E9EEF4]" />

        <div className="flex items-center gap-2 text-[#0F3659]">
          <MapPin className="size-4 shrink-0" />
          <span className="text-[13px] font-medium leading-5 sm:text-[14px]">
            {location}
          </span>
        </div>
      </div>
    </article>
  );
}
