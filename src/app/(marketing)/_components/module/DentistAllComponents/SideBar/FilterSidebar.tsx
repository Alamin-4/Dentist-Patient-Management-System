"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface FilterSidebarProps {
  procedure: string;
  onProcedureChange: (value: string) => void;
  country: string;
  onCountryChange: (value: string) => void;
  city: string;
  onCityChange: (value: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (value: [number, number]) => void;
  selectedRatings: number[];
  onRatingToggle: (rating: number) => void;
  selectedScoreRanges: string[];
  onScoreToggle: (range: string) => void;
  selectedLanguages: string[];
  onLanguageToggle: (language: string) => void;
  selectedAvailabilityDate: string | null;
  onAvailabilityDateChange: (value: string | null) => void;
  showVerifiedOnly: boolean;
  onShowVerifiedOnlyChange: (value: boolean) => void;
  onClear: () => void;
  availableProcedures: string[];
  availableCountries: string[];
  availableCities: string[];
}

const styles = {
  label:
    "mb-2 block text-[13px] font-semibold uppercase tracking-tight text-slate-500",
  sectionBorder: "mb-2 border-b border-slate-100 pb-2",
  selectBox:
    "flex h-[42px] w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 text-[13px] font-medium text-slate-700 transition-all hover:border-slate-300",
  checkboxLabel:
    "cursor-pointer select-none text-[13px] font-medium leading-none text-slate-600",
  groupTitle: "mb-4 block text-[14px] font-bold text-slate-800",
};

const scoreRanges = ["0-25", "25-50", "50-75", "75-100"];
const languages = ["English", "Spanish", "Turkish"];

function formatMonth(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function buildCalendar(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDaysInMonth = new Date(year, month, 0).getDate();

  const cells: { day: number; muted: boolean; date: Date }[] = [];

  for (let index = firstDay - 1; index >= 0; index -= 1) {
    const day = prevDaysInMonth - index;
    cells.push({ day, muted: true, date: new Date(year, month - 1, day) });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ day, muted: false, date: new Date(year, month, day) });
  }

  while (cells.length < 42) {
    const day = cells.length - (firstDay + daysInMonth) + 1;
    cells.push({ day, muted: true, date: new Date(year, month + 1, day) });
  }

  return cells;
}

export default function FilterSidebar({
  procedure,
  onProcedureChange,
  country,
  onCountryChange,
  city,
  onCityChange,
  priceRange,
  onPriceRangeChange,
  selectedRatings,
  onRatingToggle,
  selectedScoreRanges,
  onScoreToggle,
  selectedLanguages,
  onLanguageToggle,
  selectedAvailabilityDate,
  onAvailabilityDateChange,
  showVerifiedOnly,
  onShowVerifiedOnlyChange,
  onClear,
  availableProcedures,
  availableCountries,
  availableCities,
}: FilterSidebarProps) {
  const [calendarMonth, setCalendarMonth] = React.useState(
    () => new Date(2026, 9, 1),
  );

  const calendarCells = React.useMemo(
    () => buildCalendar(calendarMonth),
    [calendarMonth],
  );

  const minPrice = 0;
  const maxPrice = 1800;
  const lowerPercent =
    ((priceRange[0] - minPrice) / (maxPrice - minPrice)) * 100;
  const upperPercent =
    ((priceRange[1] - minPrice) / (maxPrice - minPrice)) * 100;

  return (
    <aside className="flex w-full flex-col rounded-[18px] border border-slate-200 bg-[#f8f9fb] p-5 shadow-sm lg:min-h-[calc(100vh-8rem)]">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-[20px] font-extrabold tracking-[-0.03em] text-slate-900">
          Filters
        </h2>
        <button
          type="button"
          onClick={onClear}
          className="text-[14px] font-bold text-[#3B5998] transition-colors hover:text-[#2d4373]"
        >
          Clear All
        </button>
      </div>

      <div className={styles.sectionBorder}>
        <label className={styles.label}>Procedure Type</label>
        <Select value={procedure} onValueChange={onProcedureChange}>
          <SelectTrigger className={styles.selectBox}>
            <SelectValue placeholder="All Procedures" />
          </SelectTrigger>
          <SelectContent>
            {availableProcedures.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className={styles.sectionBorder}>
        <label className={styles.label}>Country</label>
        <Select value={country} onValueChange={onCountryChange}>
          <SelectTrigger className={styles.selectBox}>
            <SelectValue placeholder="Select Country" />
          </SelectTrigger>
          <SelectContent>
            {availableCountries.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className={styles.sectionBorder}>
        <label className={styles.label}>City</label>
        <Select value={city} onValueChange={onCityChange}>
          <SelectTrigger className={styles.selectBox}>
            <SelectValue placeholder="Select City" />
          </SelectTrigger>
          <SelectContent>
            {availableCities.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className={styles.sectionBorder}>
        <label className={styles.groupTitle}>Price Range (USD)</label>
        <div className="relative mt-6 mb-5 px-2">
          <div className="relative h-1.5 w-full rounded-full bg-slate-200">
            <div
              className="absolute h-full rounded-full bg-[#003366]"
              style={{
                left: `${lowerPercent}%`,
                right: `${100 - upperPercent}%`,
              }}
            />
            <div
              className="absolute top-1/2 size-4 -translate-y-1/2 rounded-full border-2 border-[#003366] bg-white shadow-md"
              style={{ left: `calc(${lowerPercent}% - 8px)` }}
            />
            <div
              className="absolute top-1/2 size-4 -translate-y-1/2 rounded-full border-2 border-[#003366] bg-white shadow-md"
              style={{ left: `calc(${upperPercent}% - 8px)` }}
            />
          </div>
          <div className="absolute inset-x-2 -top-2 h-6">
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              value={priceRange[0]}
              onChange={(event) =>
                onPriceRangeChange([
                  Math.min(Number(event.target.value), priceRange[1]),
                  priceRange[1],
                ])
              }
              className="absolute inset-0 h-6 w-full appearance-none bg-transparent"
            />
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              value={priceRange[1]}
              onChange={(event) =>
                onPriceRangeChange([
                  priceRange[0],
                  Math.max(Number(event.target.value), priceRange[0]),
                ])
              }
              className="absolute inset-0 h-6 w-full appearance-none bg-transparent"
            />
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <div className="flex-1 rounded-lg border border-slate-200 bg-white py-2 text-center text-[14px] font-bold text-slate-700 shadow-sm">
            {priceRange[0]}
          </div>
          <div className="flex-1 rounded-lg border border-slate-200 bg-white py-2 text-center text-[14px] font-bold text-slate-700 shadow-sm">
            {priceRange[1] >= maxPrice ? "Any" : priceRange[1]}
          </div>
        </div>
      </div>

      <div className={styles.sectionBorder}>
        <label className={styles.groupTitle}>RDV Score</label>
        <div className="space-y-3.5">
          {scoreRanges.map((range) => (
            <div key={range} className="flex cursor-pointer items-center gap-3">
              <Checkbox
                id={range}
                checked={selectedScoreRanges.includes(range)}
                onCheckedChange={() => onScoreToggle(range)}
                className="size-4.5 rounded border-slate-300 data-[state=checked]:border-[#003366] data-[state=checked]:bg-[#003366]"
              />
              <label htmlFor={range} className={styles.checkboxLabel}>
                {range}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.sectionBorder}>
        <label className={styles.groupTitle}>Rating</label>
        <div className="space-y-3.5">
          {[1, 2, 3, 4, 5].map((stars) => (
            <div key={stars} className="flex cursor-pointer items-center gap-3">
              <Checkbox
                id={`star-${stars}`}
                checked={selectedRatings.includes(stars)}
                onCheckedChange={() => onRatingToggle(stars)}
                className="size-4.5 rounded border-slate-300 data-[state=checked]:border-[#003366] data-[state=checked]:bg-[#003366]"
              />
              <label htmlFor={`star-${stars}`} className="flex gap-0.5">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className={cn(
                      "size-3.5 transition-colors",
                      index < stars
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-200",
                    )}
                  />
                ))}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.sectionBorder}>
        <label className={styles.groupTitle}>Show</label>
        <div className="space-y-3.5">
          <div className="flex items-center gap-3">
            <Checkbox
              id="all"
              checked={!showVerifiedOnly}
              onCheckedChange={() => onShowVerifiedOnlyChange(false)}
              className="size-4.5 rounded border-slate-300 data-[state=checked]:border-[#003366] data-[state=checked]:bg-[#003366]"
            />
            <label htmlFor="all" className={styles.checkboxLabel}>
              All
            </label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox
              id="verified"
              checked={showVerifiedOnly}
              onCheckedChange={() => onShowVerifiedOnlyChange(true)}
              className="size-4.5 rounded border-slate-300 data-[state=checked]:border-[#003366] data-[state=checked]:bg-[#003366]"
            />
            <label htmlFor="verified" className={styles.checkboxLabel}>
              Only Verified
            </label>
          </div>
        </div>
      </div>

      <div className={styles.sectionBorder}>
        <label className={styles.groupTitle}>Languages</label>
        <div className="space-y-3.5">
          {languages.map((language) => (
            <div key={language} className="flex items-center gap-3">
              <Checkbox
                id={language}
                checked={selectedLanguages.includes(language)}
                onCheckedChange={() => onLanguageToggle(language)}
                className="size-4.5 rounded border-slate-300 data-[state=checked]:border-[#003366] data-[state=checked]:bg-[#003366]"
              />
              <label htmlFor={language} className={styles.checkboxLabel}>
                {language}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="pb-2">
        <label className={styles.groupTitle}>Availability</label>
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() =>
              setCalendarMonth(
                new Date(
                  calendarMonth.getFullYear(),
                  calendarMonth.getMonth() - 1,
                  1,
                ),
              )
            }
            className="grid size-6 place-items-center rounded-full bg-[#0E3E65] text-white transition-transform hover:scale-105"
          >
            <ChevronLeft className="size-4" />
          </button>
          <div className="text-[14px] font-medium text-slate-800">
            {formatMonth(calendarMonth)}
          </div>
          <button
            type="button"
            onClick={() =>
              setCalendarMonth(
                new Date(
                  calendarMonth.getFullYear(),
                  calendarMonth.getMonth() + 1,
                  1,
                ),
              )
            }
            className="grid size-6 place-items-center rounded-full bg-[#0E3E65] text-white transition-transform hover:scale-105"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-y-3 text-center text-[11px] font-medium text-slate-400">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div key={day}>{day}</div>
          ))}
          {calendarCells.map((cell, index) => {
            const isSelected =
              selectedAvailabilityDate &&
              new Date(selectedAvailabilityDate).toDateString() ===
              cell.date.toDateString();

            return (
              <button
                key={`${cell.date.toISOString()}-${index}`}
                type="button"
                onClick={() =>
                  onAvailabilityDateChange(
                    cell.muted ? null : cell.date.toISOString(),
                  )
                }
                className={cn(
                  "mx-auto grid size-7 place-items-center rounded-full text-[12px] transition-all",
                  cell.muted && "text-slate-300",
                  !cell.muted && "text-slate-700 hover:bg-slate-100",
                  isSelected && "bg-[#003366] text-white hover:bg-[#003366]",
                )}
              >
                {cell.day}
              </button>
            );
          })}
        </div>

        <div className="mt-4 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] font-medium text-slate-700">
          {selectedAvailabilityDate
            ? new Date(selectedAvailabilityDate).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })
            : "Any date"}
        </div>
      </div>
    </aside>
  );
}
