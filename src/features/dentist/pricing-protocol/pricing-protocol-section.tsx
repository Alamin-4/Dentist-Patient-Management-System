"use client";

import { SquarePen, FileText, Loader2, Video } from "lucide-react";
import { useDentistProgress } from "@/hooks/dentist/useDentist";
import { useRouter } from "next/navigation";

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
      <div className="flex min-h-[200px] items-center justify-center bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const dentistOps = progressData?.data?.dentistOperations;
  const procedures = progressData?.data?.procedures || [];

  return (
    <div className=" bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden p-6 font-sans">
      <div className="flex items-center justify-between pb-5 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-[#0F172A]">
          Pricing Protocols
        </h2>
        <button
          onClick={() => router.push("/dentist/add-pricing")}
          className="p-2 text-[#0F172A] hover:bg-gray-50 rounded-lg transition-colors duration-150 cursor-pointer"
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
                <h3 className="text-[17px] font-semibold text-[#0F172A]">
                  {item.procedureName}
                </h3>
                {item.notes && <p className="text-[15px] text-[#64748B]">{item.notes}</p>}
              </div>
              <div className="text-lg font-bold text-[#1E3A8A] whitespace-nowrap pt-0.5">
                {formatPrice(item.price)}
              </div>
            </div>
          ))
        )}
      </div>

      {(dentistOps?.jciCertificate || dentistOps?.walkthroughVideo) && (
        <div className="mt-6 pt-5 border-t border-gray-100 space-y-3">
          <h3 className="text-sm font-semibold text-gray-500">Sterilization Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {dentistOps?.jciCertificate && (
              <a
                href={dentistOps.jciCertificate}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-white border border-[#E2E8F0] rounded-lg hover:border-gray-300 transition-colors duration-150 cursor-pointer group"
              >
                <div className="flex items-center gap-4 col-span-1">
                  <div className="flex items-center justify-center w-12 h-12 bg-[#FFF1F2] rounded-lg border border-[#FFE4E6]">
                    <FileText className="w-6 h-6 text-[#F43F5E] stroke-[1.5]" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-[15px] font-medium text-[#0F172A] group-hover:underline truncate">
                      JCI License Certificate
                    </p>
                    <p className="text-[13px] text-[#64748B]">PDF Document</p>
                  </div>
                </div>
              </a>
            )}

            {dentistOps?.walkthroughVideo && (
              <a
                href={dentistOps.walkthroughVideo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-white border border-[#E2E8F0] rounded-lg hover:border-gray-300 transition-colors duration-150 cursor-pointer group"
              >
                <div className="flex items-center gap-4 col-span-1">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg border border-blue-100">
                    <Video className="w-6 h-6 text-blue-500 stroke-[1.5]" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-[15px] font-medium text-[#0F172A] group-hover:underline truncate">
                      Walkthrough Video
                    </p>
                    <p className="text-[13px] text-[#64748B]">Video File</p>
                  </div>
                </div>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
