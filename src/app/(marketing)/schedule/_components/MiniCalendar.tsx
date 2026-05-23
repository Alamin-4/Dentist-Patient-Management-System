"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface MiniCalendarProps {
  selected: Date | null;
  onSelect: (date: Date) => void;
}

interface Cell {
  day: number;
  type: "prev" | "current" | "next";
}

export default function MiniCalendar({ selected, onSelect }: MiniCalendarProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const goToPrev = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goToNext = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // Build 42-cell grid
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const cells: Cell[] = [];

  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, type: "prev" });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, type: "current" });
  }
  let nextDay = 1;
  while (cells.length < 42) {
    cells.push({ day: nextDay++, type: "next" });
  }
  // Remove last row if entirely from next month
  if (cells.length === 42 && cells.slice(35).every((c) => c.type === "next")) {
    cells.splice(35);
  }

  const getDate = (cell: Cell): Date | null => {
    if (cell.type !== "current") return null;
    return new Date(viewYear, viewMonth, cell.day);
  };

  const isToday = (cell: Cell): boolean => {
    const d = getDate(cell);
    return d !== null && d.getTime() === today.getTime();
  };

  const isSelected = (cell: Cell): boolean => {
    if (!selected || cell.type !== "current") return false;
    const d = getDate(cell)!;
    const s = new Date(selected);
    s.setHours(0, 0, 0, 0);
    return d.getTime() === s.getTime();
  };

  const isPast = (cell: Cell): boolean => {
    if (cell.type !== "current") return true;
    const d = getDate(cell)!;
    return d < today;
  };

  const handleClick = (cell: Cell) => {
    if (cell.type !== "current" || isPast(cell)) return;
    onSelect(getDate(cell)!);
  };

  return (
    <div className="select-none w-full">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={goToPrev}
          className="p-1.5 rounded-full hover:bg-[#F3F4F6] transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4 text-[#113254]" />
        </button>
        <span className="text-[14px] font-semibold text-[#1A1A2E]">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          onClick={goToNext}
          className="p-1.5 rounded-full hover:bg-[#F3F4F6] transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-4 text-[#113254]" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_LABELS.map((label) => (
          <div
            key={label}
            className="flex items-center justify-center text-[11px] font-medium text-[#9CA3AF] py-1"
          >
            {label}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7">
        {cells.map((cell, i) => {
          const today_ = isToday(cell);
          const selected_ = isSelected(cell);
          const past = isPast(cell);
          const other = cell.type !== "current";

          let cls =
            "relative flex items-center justify-center mx-auto size-8 rounded-full text-[13px] transition-all";

          if (other || past) {
            cls += " text-[#D1D5DB] cursor-default";
          } else if (today_) {
            cls += " bg-[#113254] text-white font-semibold cursor-pointer";
          } else if (selected_) {
            cls +=
              " border-2 border-[#113254] text-[#113254] font-semibold cursor-pointer";
          } else {
            cls +=
              " text-[#374151] cursor-pointer hover:bg-[#F3F4F6] font-medium";
          }

          return (
            <div key={i} className="flex items-center justify-center py-0.5">
              <button
                type="button"
                className={cls}
                onClick={() => handleClick(cell)}
                disabled={other || past}
                aria-label={
                  cell.type === "current"
                    ? `${cell.day} ${MONTH_NAMES[viewMonth]} ${viewYear}`
                    : undefined
                }
              >
                {cell.day}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
