import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PatientKol } from "@/lib/patient-kol-data";

interface KolCardProps {
  kol: PatientKol;
  onAsk: (kol: PatientKol) => void;
}

function KolAvatar({ kol }: { kol: PatientKol }) {
  if (kol.headshot) {
    return (
      <img
        src={kol.headshot}
        alt={kol.name}
        className="h-20 w-20 shrink-0 rounded-full object-cover border border-[#E5E7EB]"
      />
    );
  }
  return (
    <span
      className="inline-flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-xl font-bold text-white"
      style={{ backgroundColor: kol.avatarColor }}
    >
      {kol.initials}
    </span>
  );
}

export function KolCard({ kol, onAsk }: KolCardProps) {
  const languageList = kol.languages.join(" · ");

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-[#CEE0F4] bg-white p-5 shadow-[0_1px_0_rgba(17,50,84,0.02)]">
      {/* Top: avatar + info */}
      <div className="flex gap-4">
        <KolAvatar kol={kol} />
        <div className="min-w-0 flex-1 space-y-0.5">
          <h3 className="text-[16px] font-bold text-[#1A1A2E]">{kol.name}</h3>
          <p className="text-[13px] text-[#6B7280]">{kol.credentials}</p>
          <p className="text-[14px] font-semibold text-[#113254]">
            {kol.specialty}
            <span className="font-normal text-[#6B7280]"> · {kol.country}</span>
          </p>
          <p className="text-[13px] text-[#9CA3AF]">
            {kol.yearsExperience} years of experience · Languages:{" "}
            <span className="font-medium text-[#6B7280]">{languageList}</span>
          </p>
        </div>
      </div>

      {/* Bio */}
      <p className="text-[13px] leading-relaxed text-[#6B7280] line-clamp-3">
        {kol.bio}
      </p>

      {/* CTA */}
      <button
        onClick={() => onAsk(kol)}
        className={cn(
          "self-start rounded-lg border border-[#D0D5DD] bg-white px-4 py-2 text-[13px] font-semibold text-[#1A1A2E]",
          "transition-colors hover:border-[#113254] hover:bg-[#F8FAFC] active:scale-95"
        )}
      >
        Ask {kol.firstName} a Question
      </button>
    </div>
  );
}
