"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, X } from "lucide-react";

export const AVAILABLE_LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Arabic",
  "Italian",
  "Portuguese",
  "Turkish",
  "Albanian",
  "Russian",
  "Chinese",
  "Japanese",
  "Korean",
  "Hindi",
  "Dutch",
  "Swedish",
  "Polish",
  "Vietnamese",
  "Greek",
  "Hebrew",
];

interface LanguageMultiSelectProps {
  selectedLanguages: string[];
  onChange: (languages: string[]) => void;
  error?: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export function LanguageMultiSelect({
  selectedLanguages = [],
  onChange,
  error,
  label,
  required = false,
  placeholder = "Select spoken languages",
  disabled = false,
}: LanguageMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredLanguages = AVAILABLE_LANGUAGES.filter((lang) =>
    lang.toLowerCase().includes(search.toLowerCase().trim())
  );

  const toggleLanguage = (lang: string) => {
    if (disabled) return;
    if (selectedLanguages.includes(lang)) {
      onChange(selectedLanguages.filter((item) => item !== lang));
    } else {
      onChange([...selectedLanguages, lang]);
    }
  };

  const handleClearAll = () => {
    if (disabled) return;
    onChange([]);
  };

  return (
    <div className="grid gap-2 text-left relative" ref={dropdownRef}>
      {label && (
        <label className="text-sm font-medium text-sec-text">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center justify-between w-full h-10 md:h-11 px-3.5 bg-white border rounded-md text-sm transition-all focus:outline-none cursor-pointer ${
          error ? "border-red-400" : "border-border hover:border-slate-300"
        } ${disabled ? "bg-slate-50 cursor-not-allowed text-slate-400" : ""}`}
      >
        <div className="flex items-center gap-1.5 overflow-hidden truncate max-w-[85%]">
          {selectedLanguages.length === 0 ? (
            <span className="text-gray-400">{placeholder}</span>
          ) : (
            <span className="font-medium text-gray-900 truncate">
              {selectedLanguages.join(", ")}
            </span>
          )}
        </div>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Error Message */}
      {error && <p className="text-xs text-red-500">{error}</p>}

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-xl p-3 animate-in fade-in-50 zoom-in-95 duration-150">
          {/* Search Box */}
          <div className="relative mb-2">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search language..."
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm border border-gray-200 rounded-md outline-none focus:border-brand-medium-navy focus:ring-1 focus:ring-brand-medium-navy"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Scrollable Language List with Checkboxes */}
          <div className="max-h-48 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            {filteredLanguages.length === 0 ? (
              <p className="text-xs text-gray-400 py-3 text-center">No languages found</p>
            ) : (
              filteredLanguages.map((lang) => {
                const isSelected = selectedLanguages.includes(lang);
                return (
                  <label
                    key={lang}
                    onClick={() => toggleLanguage(lang)}
                    className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs sm:text-sm cursor-pointer select-none transition-colors ${
                      isSelected ? "bg-slate-50 font-medium text-gray-900" : "text-gray-700 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}} // Handled by container click
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer accent-primary"
                    />
                    <span>{lang}</span>
                  </label>
                );
              })
            )}
          </div>

          {/* Footer with Clear All button */}
          <div className="pt-2 mt-2 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[11px] text-gray-400 font-medium">
              {selectedLanguages.length} selected
            </span>
            {selectedLanguages.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs text-gray-500 hover:text-red-600 font-medium transition-colors cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
