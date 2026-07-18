
"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { formatSlotToAmPm } from "./DentistScheduleCard";

interface TimeSlotPickerProps {
    slots: string[];
    selectedSlot: string;
    onSelect: (slot: string) => void;
}

export function TimeSlotPicker({ slots, selectedSlot, onSelect }: TimeSlotPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-700">Select Time</p>
            <div className="relative" ref={dropdownRef}>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full h-11 px-4 text-left bg-white border rounded-lg outline-none transition-all flex items-center justify-between cursor-pointer text-sm ${
                        isOpen
                            ? "border-[#113254] ring-2 ring-[#113254]/5"
                            : "border-gray-200 hover:border-gray-300"
                    } ${selectedSlot ? "text-gray-750 font-medium" : "text-gray-400"}`}
                >
                    <span>{selectedSlot ? formatSlotToAmPm(selectedSlot) : "Select Time Slot"}</span>
                    <ChevronDown
                        className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                            isOpen ? "rotate-180 text-[#113254]" : ""
                        }`}
                    />
                </button>

                {isOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                        {slots.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-gray-400 text-center">
                                No available slots
                            </div>
                        ) : (
                            slots.map((slot) => {
                                const isSelected = selectedSlot === slot;
                                return (
                                    <button
                                        key={slot}
                                        type="button"
                                        onClick={() => {
                                            onSelect(slot);
                                            setIsOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between cursor-pointer ${
                                            isSelected
                                                ? "bg-[#113254]/5 text-[#113254] font-semibold"
                                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        }`}
                                    >
                                        <span>{formatSlotToAmPm(slot)}</span>
                                        {isSelected && (
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#113254]" />
                                        )}
                                    </button>
                                );
                            })
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}