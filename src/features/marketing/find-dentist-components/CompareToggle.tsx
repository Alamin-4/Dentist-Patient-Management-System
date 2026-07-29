// modules/find-dentists/components/CompareToggle.tsx

"use client";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/core/lib/utils";

interface CompareToggleProps {
    isCompareMode: boolean;
    onToggle: (value: boolean) => void;
}

export default function CompareToggle({ isCompareMode, onToggle }: CompareToggleProps) {
    return (
        <div className="flex items-center justify-end">
            <div className="flex items-center gap-3">
                <div className="*:text-left">
                    <span className="block font-medium text-primary">Compare</span>
                    <span className="block text-xs font-medium text-sec-text">
                        up to 3
                    </span>
                </div>
                <button
                    onClick={() => onToggle(!isCompareMode)}
                    className={cn(
                        "w-11 h-6 rounded-full transition-all relative flex items-center px-1 cursor-pointer",
                        isCompareMode ? "bg-primary" : "bg-gray-300",
                    )}
                >
                    <div
                        className={cn(
                            "w-4 h-4 bg-white rounded-full transition-all shadow-sm",
                            isCompareMode ? "translate-x-5" : "translate-x-0",
                        )}
                    />
                </button>
            </div>
        </div>
    );
}