"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, type CustomComponents } from "react-day-picker";
import { cn } from "@/lib/utils";

interface MiniCalendarProps {
  selected?: Date | null;
  onSelect?: (date: Date | undefined) => void;
  disabledDates?: Date[];
  className?: string;
}

export default function MiniCalendar({
  selected,
  onSelect,
  disabledDates = [],
  className,
}: MiniCalendarProps) {
  // 🔥 FIX: Reset time to midnight so "today" is never considered past
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Combine past dates + any custom disabled dates
  const disabled = [{ before: today }, ...disabledDates];

  // 🔥 FIX: Custom Chevron component for react-day-picker v9
  const ChevronComponent: CustomComponents["Chevron"] = ({ orientation }) => {
    if (orientation === "left") {
      return <ChevronLeft className="h-4 w-4" />;
    }
    return <ChevronRight className="h-4 w-4" />;
  };

  return (
    <div className={cn("rounded-lg border border-gray-200 p-3 bg-white", className)}>
      <DayPicker
        mode="single"
        selected={selected ?? undefined}
        onSelect={onSelect}
        disabled={disabled}
        showOutsideDays
        className="pointer-events-auto"
        classNames={{
          root: "w-fit",
          months: "flex flex-col sm:flex-row gap-2",
          month: "flex flex-col gap-2",
          month_caption: "flex justify-center items-center h-7 relative", // v9 renamed from 'caption'
          caption_label: "text-sm font-semibold text-gray-800",
          nav: "flex items-center justify-between absolute inset-x-0",
          button_previous: cn( // v9 renamed from 'nav_button_previous'
            "absolute left-0 top-0 z-10 h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 hover:bg-gray-100 border border-gray-200 rounded-md inline-flex items-center justify-center"
          ),
          button_next: cn( // v9 renamed from 'nav_button_next'
            "absolute right-0 top-0 z-10 h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 hover:bg-gray-100 border border-gray-200 rounded-md inline-flex items-center justify-center"
          ),
          weekdays: "flex",
          weekday: "text-gray-500 w-9 font-medium text-[0.8rem] uppercase text-center",
          week: "flex w-full mt-2",
          day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 relative focus-within:relative focus-within:z-20",
          day_button: cn(
            "h-9 w-9 p-0 font-normal hover:bg-gray-100 transition-colors rounded-md inline-flex items-center justify-center"
          ),
          selected: "bg-[#113254] text-white hover:bg-[#0d2844] hover:text-white focus:bg-[#113254] focus:text-white font-semibold shadow-sm",
          today: "bg-blue-50 text-[#113254] font-bold ring-1 ring-[#113254]/30",
          outside: "text-gray-400 opacity-40 aria-selected:bg-gray-100/50 aria-selected:text-gray-400 aria-selected:opacity-30",
          disabled: "text-gray-300 opacity-40 cursor-not-allowed hover:bg-transparent",
          hidden: "invisible",
        }}
        components={{
          Chevron: ChevronComponent, // v9 renamed from 'IconLeft' / 'IconRight'
        }}
      />
    </div>
  );
}