"use client";

import { useEffect, useState } from "react";
import { formatSlotToAmPm } from "./DentistScheduleCard";

interface TimeSlotPickerProps {
    slots: string[];
    selectedSlot: string;
    onSelect: (slot: string) => void;
}

export function TimeSlotPicker({ selectedSlot, onSelect }: TimeSlotPickerProps) {
    const startTime = selectedSlot ? selectedSlot.split(" to ")[0] : "";
    const [timeValue, setTimeValue] = useState(startTime);

    useEffect(() => {
        const start = selectedSlot ? selectedSlot.split(" to ")[0] : "";
        setTimeValue(start);
    }, [selectedSlot]);

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setTimeValue(val);

        if (!val) {
            onSelect("");
            return;
        }

        const parts = val.split(":");
        if (parts.length < 2) return;

        const h = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10);
        if (isNaN(h) || isNaN(m)) return;

        // Calculate end time (+15 mins)
        let endM = m + 15;
        let endH = h;
        if (endM >= 60) {
            endM -= 60;
            endH = (endH + 1) % 24;
        }

        const startPad = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
        const endPad = `${endH.toString().padStart(2, "0")}:${endM.toString().padStart(2, "0")}`;

        const constructedSlot = `${startPad} to ${endPad}`;
        onSelect(constructedSlot);
    };

    return (
        <div className="space-y-3">
            <label htmlFor="time-picker" className="text-sm font-semibold text-gray-750 block">
                Select Start Time
            </label>

            <div className="relative">
                <input
                    id="time-picker"
                    type="time"
                    value={timeValue}
                    onChange={handleTimeChange}
                    className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg outline-none transition-all focus:border-[#113254] focus:ring-2 focus:ring-[#113254]/5 text-sm text-gray-750 font-semibold cursor-pointer"
                />
            </div>

            {selectedSlot && (
                <div className="p-3.5 bg-[#F0F9FF] border border-[#E0F2FE] rounded-lg animate-in fade-in slide-in-from-top-1 duration-150">
                    <p className="text-[13px] text-gray-500 font-medium">Selected Slot (15 min meeting):</p>
                    <p className="text-[16px] text-[#113254] font-bold mt-0.5">
                        {formatSlotToAmPm(selectedSlot)}
                    </p>
                </div>
            )}
        </div>
    );
}