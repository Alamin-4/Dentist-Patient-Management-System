"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export const TIMEZONES = [
    "Eastern Time (EST, UTC-5)",
    "Central Time (CST, UTC-6)",
    "Mountain Time (MST, UTC-7)",
    "Pacific Time (PST, UTC-8)",
    "Greenwich Mean Time (GMT, UTC+0)",
    "Central European Time (CET, UTC+1)",
    "Mexico City Time (CST, UTC-6)",
    "Australia Eastern (AEST, UTC+10)",
    "GMT+6 Time Zone (BST, GMT+6)",
];

export function getDefaultTimezone(): string {
    try {
        const offsetMinutes = -new Date().getTimezoneOffset();
        const offsetHours = offsetMinutes / 60;
        const sign = offsetHours >= 0 ? "+" : "-";
        const absoluteHours = Math.abs(offsetHours);
        const formattedOffset = `${sign}${absoluteHours}`;

        const matched = TIMEZONES.find((tz) =>
            tz.includes(`UTC${formattedOffset}`) ||
            tz.includes(`GMT${formattedOffset}`) ||
            tz.includes(`UTC${sign}0${absoluteHours}`) ||
            tz.includes(`GMT${sign}0${absoluteHours}`) ||
            (offsetHours === 0 && (tz.includes("UTC+0") || tz.includes("GMT+0") || tz.includes("UTC-0") || tz.includes("GMT-0")))
        );

        if (matched) return matched;
    } catch (e) {
        console.error("Failed to detect timezone", e);
    }
    return TIMEZONES[0];
}

interface TimezoneSelectorProps {
    value: string;
    onChange: (value: string) => void;
}

export function TimezoneSelector({ value, onChange }: TimezoneSelectorProps) {
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
            <p className="text-sm font-semibold text-gray-700">Select Time Zone</p>
            <div className="relative" ref={dropdownRef}>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full h-11 px-4 text-left bg-white border rounded-lg outline-none transition-all flex items-center justify-between cursor-pointer text-sm ${
                        isOpen
                            ? "border-[#113254] ring-2 ring-[#113254]/5"
                            : "border-gray-200 hover:border-gray-300"
                    } text-gray-750 font-medium`}
                >
                    <span>{value || "Select Time Zone"}</span>
                    <ChevronDown
                        className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                            isOpen ? "rotate-180 text-[#113254]" : ""
                        }`}
                    />
                </button>

                {isOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                        {TIMEZONES.map((tz) => {
                            const isSelected = value === tz;
                            return (
                                <button
                                    key={tz}
                                    type="button"
                                    onClick={() => {
                                        onChange(tz);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between cursor-pointer ${
                                        isSelected
                                            ? "bg-[#113254]/5 text-[#113254] font-semibold"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                                >
                                    <span>{tz}</span>
                                    {isSelected && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#113254]" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}