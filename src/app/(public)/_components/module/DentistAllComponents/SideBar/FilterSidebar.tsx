"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Star } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

// ১. Props Interface (এরর এড়াতে এটি জরুরি)
interface FilterSidebarProps {
  procedure: string;
  onProcedureChange: (value: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (value: [number, number]) => void;
  selectedRatings: number[];
  onRatingToggle: (rating: number) => void;
  onClear: () => void;
  availableProcedures: string[];
}

const styles = {
  label:
    "text-[13px] font-semibold text-slate-500 mb-2 block uppercase tracking-tight",
  sectionBorder: "border-b border-slate-100 pb-2 mb-2",
  selectBox:
    "flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 font-medium cursor-pointer hover:border-slate-300 transition-all",
  checkboxLabel:
    "text-[13px] text-slate-600 leading-none cursor-pointer select-none font-medium",
  groupTitle: "text-[14px] font-bold text-slate-800 mb-4 block",
};

export default function FilterSidebar({
  procedure,
  onProcedureChange,
  priceRange,
  onPriceRangeChange,
  selectedRatings,
  onRatingToggle,
  onClear,
  availableProcedures,
}: FilterSidebarProps) {
  return (
    <aside className="w-full bg-[#f8f9fb] border rounded-lg border-slate-200 min-h-screen p-5 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Filters
        </h2>
        <button
          onClick={onClear}
          className="text-sm font-bold text-[#3b5998] hover:text-[#2d4373] transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Procedure Type */}
      <div className={styles.sectionBorder}>
        <label className={styles.label}>Procedure Type</label>
        <div className={styles.selectBox}>
          <span className="truncate">{procedure || "All Procedures"}</span>
          <ChevronDown className="size-4 text-slate-400 shrink-0" />
        </div>
      </div>

      {/* Country */}
      <div className={styles.sectionBorder}>
        <label className={styles.label}>Country</label>
        <div className={styles.selectBox}>
          <span>Select Country</span>
          <ChevronDown className="size-4 text-slate-400" />
        </div>
      </div>

      {/* City */}
      <div className={styles.sectionBorder}>
        <label className={styles.label}>City</label>
        <div className={styles.selectBox}>
          <span>Select City</span>
          <ChevronDown className="size-4 text-slate-400" />
        </div>
      </div>

      {/* Price Range - Exact Visual Match */}
      <div className={styles.sectionBorder}>
        <label className={styles.groupTitle}>Price Range (USD)</label>
        <div className="mt-6 mb-5 px-2 relative">
          <div className="h-1.5 w-full bg-slate-200 rounded-full">
            <div
              className="absolute h-full bg-[#003366] rounded-full"
              style={{ left: "10%", right: "30%" }}
            ></div>
            {/* Handles */}
            <div className="absolute left-[10%] top-1/2 -translate-y-1/2 size-4 bg-white border-2 border-[#003366] rounded-full shadow-md cursor-pointer hover:scale-110 transition-transform"></div>
            <div className="absolute right-[30%] top-1/2 -translate-y-1/2 size-4 bg-white border-2 border-[#003366] rounded-full shadow-md cursor-pointer hover:scale-110 transition-transform"></div>
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <div className="flex-1 bg-white border border-slate-200 rounded-xl py-2 text-center text-sm font-bold text-slate-700 shadow-sm">
            {priceRange[0]}
          </div>
          <div className="flex-1 bg-white border border-slate-200 rounded-xl py-2 text-center text-sm font-bold text-slate-700 shadow-sm">
            {priceRange[1] >= 1800 ? "Any" : priceRange[1]}
          </div>
        </div>
      </div>

      {/* RDV Score */}
      <div className={styles.sectionBorder}>
        <label className={styles.groupTitle}>RDV Score</label>
        <div className="space-y-3.5">
          {["0-25", "25-50", "50-75", "75-100"].map((range) => (
            <div
              key={range}
              className="flex items-center space-x-3 group cursor-pointer"
            >
              <Checkbox
                id={range}
                className="size-4.5 rounded border-slate-300 data-[state=checked]:bg-[#003366] data-[state=checked]:border-[#003366]"
              />
              <label htmlFor={range} className={styles.checkboxLabel}>
                {range}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div className={styles.sectionBorder}>
        <label className={styles.groupTitle}>Rating</label>
        <div className="space-y-3.5">
          {[5, 4, 3, 2, 1].map((stars) => (
            <div
              key={stars}
              className="flex items-center space-x-3 group cursor-pointer"
            >
              <Checkbox
                id={`star-${stars}`}
                checked={selectedRatings.includes(stars)}
                onCheckedChange={() => onRatingToggle(stars)}
                className="size-4.5 rounded border-slate-300 data-[state=checked]:bg-[#003366] data-[state=checked]:border-[#003366]"
              />
              <label htmlFor={`star-${stars}`} className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "size-3.5 transition-colors",
                      i < stars
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

      {/* Show Options */}
      <div className={styles.sectionBorder}>
        <label className={styles.groupTitle}>Show</label>
        <div className="space-y-3.5">
          <div className="flex items-center space-x-3">
            <Checkbox id="all" className="size-4.5 rounded border-slate-300" />
            <label htmlFor="all" className={styles.checkboxLabel}>
              All
            </label>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox
              id="verified"
              defaultChecked
              className="size-4.5 rounded border-slate-300 data-[state=checked]:bg-[#003366] data-[state=checked]:border-[#003366]"
            />
            <label htmlFor="verified" className={styles.checkboxLabel}>
              Verified Providers
            </label>
          </div>
        </div>
      </div>

      {/* Languages */}
      <div className="pb-12">
        <label className={styles.groupTitle}>Languages</label>
        <div className="space-y-3.5">
          {["English", "Spanish", "Turkish"].map((lang) => (
            <div key={lang} className="flex items-center space-x-3">
              <Checkbox
                id={lang}
                className="size-4.5 rounded border-slate-300"
              />
              <label htmlFor={lang} className={styles.checkboxLabel}>
                {lang}
              </label>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
