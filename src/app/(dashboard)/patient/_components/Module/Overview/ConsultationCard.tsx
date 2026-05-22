import { Star, CheckCircle2, Plus } from "lucide-react";

export const ConsultationCard = () => (
  <div className="bg-white border border-[#CEE0F4] rounded-lg p-6 mb-4 last:mb-0 transition-hover hover:border-[#113254]/30">
    {/* Top Row: Doctor & Procedure Info */}
    <div className="flex flex-col lg:flex-row justify-between gap-6 pb-6 border-b border-gray-100">
      {/* Doctor Profile */}
      <div className="flex gap-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 shrink-0">
          <img
            src="/dentist-avatar.jpg"
            alt="Dr. Eliza"
            className="object-cover"
          />
        </div>
        <div>
          <h4 className="text-lg font-bold text-[#1A1A2E]">Dr. Eliza Mick</h4>
          <p className="text-sm font-medium text-[#6B7280]">Orthodontist</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[#113254] font-bold text-sm">5</span>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"
              />
            ))}
            <span className="text-[#9CA3AF] text-xs font-medium ml-1">
              (8 Ratings)
            </span>
          </div>
          <div className="flex items-center gap-1 mt-2 text-[#10B981]">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-[10px] font-bold tracking-wider uppercase">
              Verified
            </span>
          </div>
        </div>
      </div>

      {/* Procedure Info */}
      <div className="flex flex-col lg:items-center">
        <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide">
          Procedure
        </p>
        <p className="text-[15px] font-bold text-[#1A1A2E] mt-1">
          All-on-4 Full Arch
        </p>
      </div>

      {/* Budget Info */}
      <div className="lg:text-right">
        <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide">
          Estimate Budget
        </p>
        <p className="text-lg font-bold text-[#113254] mt-1">$3,760 – $4,300</p>
        <div className="inline-block bg-[#F3F4F6] px-2 py-0.5 rounded-full mt-1">
          <span className="text-[11px] font-bold text-[#6B7280]">
            96% <span className="font-medium">Accuracy</span>
          </span>
        </div>
      </div>
    </div>

    {/* Bottom Row: Date & Action */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 gap-4">
      <div className="space-y-1">
        <p className="text-[15px] font-bold text-[#1A1A2E]">
          Tuesday, 29 April 2025
        </p>
        <p className="text-sm font-medium text-[#6B7280]">
          10:30 AM EST • 15-minute video call
        </p>
        <button className="flex items-center gap-1 text-[#113254] text-sm font-bold mt-2 hover:underline">
          <Plus className="w-4 h-4" /> Add to calendar
        </button>
      </div>
      <button className="w-full sm:w-auto px-8 py-3 bg-[#113254] text-white font-bold rounded-xl hover:bg-[#0d2844] transition-all active:scale-95">
        Join Consultation
      </button>
    </div>
  </div>
);
