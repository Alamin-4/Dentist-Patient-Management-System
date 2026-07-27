"use client";

import * as React from "react";
import { ChevronDown, Search, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DropdownOption {
  value: string;
  label: string;
}

interface SearchableDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<string | DropdownOption>;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  allowClear?: boolean;
  clearValue?: string;
  position?: "top" | "bottom";
  showSearch?: boolean;
}

export default function SearchableDropdown({
  value,
  onChange,
  options = [],
  placeholder = "Select option",
  disabled = false,
  className,
  triggerClassName,
  allowClear = true,
  clearValue = "",
  position = "bottom",
  showSearch = true,
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Normalize options to DropdownOption format
  const normalizedOptions = React.useMemo(() => {
    return options.map((opt) => {
      if (typeof opt === "string") {
        return { value: opt, label: opt };
      }
      return opt;
    });
  }, [options]);

  // Filter options based on search query
  const filteredOptions = React.useMemo(() => {
    if (!showSearch || !searchQuery.trim()) return normalizedOptions;
    const query = searchQuery.toLowerCase();
    return normalizedOptions.filter((opt) =>
      opt.label.toLowerCase().includes(query)
    );
  }, [searchQuery, normalizedOptions, showSearch]);

  // Find the selected option's label
  const selectedLabel = React.useMemo(() => {
    const selected = normalizedOptions.find((opt) => opt.value === value);
    return selected ? selected.label : "";
  }, [value, normalizedOptions]);

  // Close dropdown on click outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(clearValue);
    setSearchQuery("");
  };

  const showClear = value && value !== clearValue && !disabled && allowClear;

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full text-slate-800", className)}
    >
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() =>
          setIsOpen((prev) => {
            if (prev) setSearchQuery("");
            return !prev;
          })
        }
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 text-[13px] font-medium text-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-[#003366]/10 focus:border-[#003366] disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60",
          isOpen && "border-[#003366] ring-2 ring-[#003366]/10",
          triggerClassName
        )}
      >
        <span className={cn("truncate", !selectedLabel && "text-slate-400 font-normal")}>
          {selectedLabel || placeholder}
        </span>
        <div className="flex items-center gap-1.5 text-slate-400">
          {showClear && (
            <X
              size={14}
              onClick={handleClear}
              className="hover:text-slate-600 cursor-pointer transition-colors"
            />
          )}
          <ChevronDown
            size={16}
            className={cn("transition-transform duration-200", isOpen && "rotate-180")}
          />
        </div>
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div
          className={cn(
            "absolute z-50 w-full rounded-lg border border-slate-100 bg-white p-1.5 shadow-lg animate-in fade-in-50 duration-150",
            position === "top"
              ? "bottom-full mb-1.5 slide-in-from-bottom-1"
              : "top-full mt-1.5 slide-in-from-top-1"
          )}
        >
          {/* Search Box */}
          {showSearch && (
            <div className="relative flex items-center border-b border-slate-100 pb-1.5 mb-1 px-1">
              <Search size={14} className="absolute left-2.5 text-slate-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 w-full rounded-md bg-slate-50 pl-8 pr-3 text-[12px] text-slate-700 placeholder-slate-400 focus:outline-none focus:bg-slate-100"
              />
            </div>
          )}

          {/* Options List */}
          <div className="max-h-56 overflow-y-auto pr-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-[13px] font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:bg-slate-50",
                      isSelected && "bg-[#003366]/5 text-[#003366] hover:bg-[#003366]/8"
                    )}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && <Check size={14} className="text-[#003366] shrink-0 ml-2" />}
                  </button>
                );
              })
            ) : (
              <div className="py-4 text-center text-[12px] text-slate-400">
                No options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
