// modules/find-dentist/components/CompareToggle.tsx

"use client";

import { Switch } from "@/components/ui/switch";

interface CompareToggleProps {
    isCompareMode: boolean;
    onToggle: (value: boolean) => void;
}

export default function CompareToggle({ isCompareMode, onToggle }: CompareToggleProps) {
    return (
        <div className="flex items-center gap-3">
            <div className="text-right">
                <span className="block text-[12px] font-bold text-[#003366]">Compare</span>
                <span className="block text-[10px] font-medium uppercase text-slate-400">
                    up to 3
                </span>
            </div>
            <Switch
                checked={isCompareMode}
                onCheckedChange={onToggle}
                className="data-[state=checked]:bg-[#003366]"
            />
        </div>
    );
}