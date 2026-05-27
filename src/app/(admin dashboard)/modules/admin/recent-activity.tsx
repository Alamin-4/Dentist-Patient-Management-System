import {
  ShieldCheck,
  UserPlus,
  Flag,
  CreditCard,
  XCircle,
} from "lucide-react";
import { recentActivity, type ActivityItem } from "./overview-data";
import { cn } from "@/lib/utils";

interface IconConfig {
  icon: React.ReactNode;
  bg: string;
}

function getIconConfig(type: ActivityItem["type"]): IconConfig {
  const configs: Record<ActivityItem["type"], IconConfig> = {
    verified: {
      icon: <ShieldCheck className="h-4 w-4 text-emerald-600" />,
      bg: "bg-emerald-50",
    },
    signup: {
      icon: <UserPlus className="h-4 w-4 text-blue-500" />,
      bg: "bg-blue-50",
    },
    flagged: {
      icon: <Flag className="h-4 w-4 text-amber-500" />,
      bg: "bg-amber-50",
    },
    payout: {
      icon: <CreditCard className="h-4 w-4 text-emerald-600" />,
      bg: "bg-emerald-50",
    },
    failed: {
      icon: <XCircle className="h-4 w-4 text-red-500" />,
      bg: "bg-red-50",
    },
  };
  return configs[type];
}

export function RecentActivity() {
  return (
    <div className="flex flex-col rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      {/* Header */}
      <h3 className="text-[15px] font-bold text-[#1A1A2E] mb-5">
        Recent activity
      </h3>

      {/* Activity list */}
      <div className="flex flex-col divide-y divide-gray-50">
        {recentActivity.map((item) => {
          const { icon, bg } = getIconConfig(item.type);
          return (
            <div
              key={item.id}
              className="flex items-start gap-3 py-3.5 first:pt-0 last:pb-0"
            >
              {/* Icon */}
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full mt-0.5",
                  bg
                )}
              >
                {icon}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[#1A1A2E] leading-tight">
                  {item.title}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                  {item.description}
                </p>
              </div>

              {/* Time */}
              <span className="text-[11px] text-gray-400 shrink-0 mt-0.5">
                {item.timeAgo}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
