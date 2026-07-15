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
  fullWidth?: boolean;
}

export default function MiniCalendar({
  selected,
  onSelect,
  disabledDates = [],
  className,
  fullWidth = false,
}: MiniCalendarProps) {
  // Reset time to midnight so "today" is never considered past
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Combine past dates + any custom disabled dates
  const disabled = [{ before: today }, ...disabledDates];

  // Custom Chevron component for react-day-picker v9
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
          root: fullWidth ? "w-full" : "w-fit",
          months: "w-full flex flex-col gap-2",
          month: "w-full flex flex-col gap-2",
          month_caption: "flex justify-center items-center h-8 relative mb-4",
          caption_label: "text-sm font-bold text-slate-800",
          nav: "flex items-center justify-between absolute inset-x-0",
          button_previous: cn(
            "absolute left-0 top-0 z-10 h-8 w-8 bg-transparent p-0 opacity-70 hover:opacity-100 hover:bg-slate-105 border border-slate-200 rounded-lg inline-flex items-center justify-center transition-all cursor-pointer"
          ),
          button_next: cn(
            "absolute right-0 top-0 z-10 h-8 w-8 bg-transparent p-0 opacity-70 hover:opacity-100 hover:bg-slate-105 border border-slate-200 rounded-lg inline-flex items-center justify-center transition-all cursor-pointer"
          ),
          weekdays: "flex w-full justify-between",
          weekday: cn(
            "text-slate-400 font-semibold text-[11px] uppercase text-center tracking-wider py-1",
            fullWidth ? "flex-1" : "w-9"
          ),
          week: "flex w-full mt-1.5 justify-between",
          day: cn(
            "p-0 font-normal aria-selected:opacity-100 relative focus-within:relative focus-within:z-20",
            fullWidth ? "flex-1" : "h-9 w-9"
          ),
          day_button: cn(
            "p-0 font-medium transition-all rounded-lg inline-flex items-center justify-center cursor-pointer",
            fullWidth ? "w-full aspect-square sm:aspect-video h-auto text-[11px] sm:text-xs" : "h-9 w-9 text-xs sm:text-sm",
            "text-slate-500 active:scale-95"
          ),
          selected: "!bg-[#113254] !text-white hover:!bg-[#0d2844] hover:!text-white focus:!bg-[#113254] focus:!text-white font-bold shadow-md shadow-[#113254]/20 rounded-lg after:!bg-white",
          today: "text-[#113254] font-bold relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:size-1 after:rounded-full after:bg-[#113254] aria-selected:!text-white aria-selected:after:!bg-white",
          outside: "text-slate-300 opacity-40",
          disabled: "text-slate-200 opacity-30 cursor-not-allowed hover:bg-transparent",
          hidden: "invisible",
        }}
        components={{
          Chevron: ChevronComponent,
        }}
      />
    </div>
  );
}