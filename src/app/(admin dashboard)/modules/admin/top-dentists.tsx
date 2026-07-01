import { cn } from "@/lib/utils";
import { topDentists } from "./overview-data";

export function TopDentists() {
  return (
    <div className="flex flex-col rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[15px] font-bold text-[#1A1A2E]">Top dentists</h3>
        <span className="text-[12px] text-gray-400">By bookings (30d)</span>
      </div>

      {/* List */}
      <div className="flex flex-col divide-y divide-gray-50">
        {topDentists.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center gap-3 py-3.5 first:pt-0 last:pb-0"
          >
            {/* Avatar */}
            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white",
                doc.avatarBg
              )}
            >
              {doc.initials}
            </div>

            {/* Name + specialty */}
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-[#1A1A2E] truncate leading-tight">
                {doc.name}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                {doc.specialty}&nbsp;&middot;&nbsp;{doc.location}
              </p>
            </div>

            {/* Bookings count */}
            <div className="text-right shrink-0">
              <p className="text-[13px] font-bold text-[#1A1A2E]">
                {doc.bookings.toLocaleString()}
              </p>
              <p className="text-[11px] text-gray-400">bookings</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
