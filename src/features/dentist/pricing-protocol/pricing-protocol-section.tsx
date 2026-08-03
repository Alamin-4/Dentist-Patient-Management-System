"use client";

import { SquarePen, FileText, Video } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDentistProgress } from "@/hooks/dentist/useDentist";
import { useRouter } from "next/navigation";
import { SectionCard } from "@/components/shared/section-card";

export default function PricingProtocolSection() {
  const router = useRouter();
  const { data: progressData, isLoading } = useDentistProgress();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <SectionCard className="p-6 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <Skeleton className="h-6 w-44 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
        <div className="divide-y divide-gray-100">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-4">
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-44 rounded" />
                <Skeleton className="h-3.5 w-28 rounded" />
              </div>
              <Skeleton className="h-6 w-20 rounded" />
            </div>
          ))}
        </div>
      </SectionCard>
    );
  }

  const dentistOps = progressData?.data?.dentistOperations;
  const procedures = progressData?.data?.procedures || [];

  return (
    <SectionCard className="p-6 font-sans">
      <div className="flex items-center justify-between pb-5 border-b border-border">
        <h2 className="text-xl font-semibold text-text">
          Pricing Protocols
        </h2>
        <button
          onClick={() => router.push("/dentist/add-pricing")}
          className="p-2 text-text hover:bg-slate-50 rounded-lg transition-colors duration-150 cursor-pointer"
          aria-label="Edit pricing protocols"
        >
          <SquarePen className="w-5 h-5 stroke-[1.5]" />
        </button>
      </div>

      <div className="divide-y divide-gray-100">
        {procedures.length === 0 ? (
          <p className="text-sm text-gray-400 py-8 text-center">No pricing protocols added yet.</p>
        ) : (
          procedures.map((item: any) => (
            <div
              key={item.id}
              className="py-5 flex items-start justify-between gap-4"
            >
              <div className="space-y-1">
                <h3 className="text-[17px] font-semibold text-text">
                  {item.procedureName}
                </h3>
                {item.notes && <p className="text-[15px] text-sec-text">{item.notes}</p>}
              </div>
              <div className="text-lg font-bold text-brand-medium-navy whitespace-nowrap pt-0.5">
                {formatPrice(item.price)}
              </div>
            </div>
          ))
        )}
      </div>

      {(dentistOps?.jciCertificate || dentistOps?.walkthroughVideo) && (
        <div className="mt-6 pt-5 border-t border-border space-y-3">
          <h3 className="text-sm font-semibold text-gray-500">Sterilization Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {dentistOps?.jciCertificate && (
              <a
                href={dentistOps.jciCertificate}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-white border border-border rounded-lg hover:border-slate-350 transition-colors duration-150 cursor-pointer group"
              >
                <div className="flex items-center gap-4 col-span-1">
                  <div className="flex items-center justify-center w-12 h-12 bg-red-50 rounded-lg border border-red-100">
                    <FileText className="w-6 h-6 text-red-500 stroke-[1.5]" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-[15px] font-medium text-text group-hover:underline truncate">
                      JCI License Certificate
                    </p>
                    <p className="text-[13px] text-sec-text">PDF Document</p>
                  </div>
                </div>
              </a>
            )}

            {dentistOps?.walkthroughVideo && (
              <a
                href={dentistOps.walkthroughVideo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-white border border-border rounded-lg hover:border-slate-350 transition-colors duration-150 cursor-pointer group"
              >
                <div className="flex items-center gap-4 col-span-1">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg border border-blue-100">
                    <Video className="w-6 h-6 text-blue-500 stroke-[1.5]" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-[15px] font-medium text-text group-hover:underline truncate">
                      Walkthrough Video
                    </p>
                    <p className="text-[13px] text-sec-text">Video File</p>
                  </div>
                </div>
              </a>
            )}
          </div>
        </div>
      )}
    </SectionCard>
  );
}
