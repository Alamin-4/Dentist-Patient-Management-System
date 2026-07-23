import { cn } from "@/lib/utils";
import { type QueueDoctor } from "./overview-data";

interface VerificationQueueProps {
  queue?: QueueDoctor[];
  total?: number;
}

export function VerificationQueue({ queue = [], total = 0 }: VerificationQueueProps) {
  return (
    <div className="flex flex-col rounded-lg border border-gray-100 bg-white p-5 shadow-sm h-full">

      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[15px] font-bold text-[#1A1A2E]">
          Verification Queue
        </h3>
        <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#1A1A2E] px-2 text-[11px] font-bold text-white">
          {total}
        </span>
      </div>

      <div className="flex flex-col divide-y divide-gray-50">
        {queue.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-6">Queue is empty</p>
        )}
        {queue.map((doc) => (
          <div key={doc.id} className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0">
            <div className="flex items-center gap-3">

              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white",
                  doc.avatarBg
                )}
              >
                {doc.initials}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[#1A1A2E] truncate">
                  {doc.name}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {doc.specialty}&nbsp;&middot;&nbsp;{doc.timeAgo}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 pl-12">
              {doc.phases.map((phase) => (
                <span
                  key={phase}
                  className="rounded-md border border-sky-200 bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-600"
                >
                  {phase}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* View all link */}
      <div className="mt-auto pt-4 border-t border-gray-50">
        <a
          href="/admin/verification-queue"
          className="text-[13px] font-medium text-sky-600 hover:text-sky-700 transition-colors"
        >
          View all ({total}) →
        </a>
      </div>
    </div>
  );
}
