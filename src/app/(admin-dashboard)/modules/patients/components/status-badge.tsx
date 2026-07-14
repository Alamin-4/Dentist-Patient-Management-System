// status-badge.tsx
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
    Active: "bg-emerald-50 text-emerald-600",
    Inactive: "bg-gray-100 text-gray-500",
};

interface Props { status: string; }
export function StatusBadge({ status }: Props) {
    return (
        <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", STATUS_STYLES[status] ?? "bg-gray-100 text-gray-500")}>
            <span className={cn("h-1.5 w-1.5 rounded-full", status === "Active" ? "bg-emerald-500" : "bg-gray-400")} />
            {status}
        </span>
    );
}