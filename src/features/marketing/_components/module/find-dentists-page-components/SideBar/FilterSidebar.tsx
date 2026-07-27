"use client";

import * as React from "react";
import { ChevronDown, Star } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import SearchableDropdown from "@/components/ui/SearchableDropdown";
import { getCountries, getCities, getAllCities, type CSCCountry, type CSCCity } from "@/lib/countryApi";
import MiniCalendar from "@/app/(marketing)/schedule/_components/MiniCalendar";

export interface FilterSidebarProps {
  procedure: string;
  onProcedureChange: (value: string) => void;
  country: string;
  onCountryChange: (value: string) => void;
  city: string;
  onCityChange: (value: string) => void;
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
  availableLanguages?: string[];
}

const scoreRanges = ["0-25", "25-50", "50-75", "75-100"];
const languages = ["English", "Spanish", "Turkish"];

function FilterSection({ title, children, defaultOpen = true }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  return (
    <div className="border-b border-slate-100 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left py-1 group"
      >
        <h3 className="text-[13px] font-bold uppercase tracking-wide text-slate-500 group-hover:text-slate-700 transition-colors">
          {title}
        </h3>
        <ChevronDown className={cn("size-4 text-slate-400 transition-transform", isOpen && "rotate-180")} />
      </button>
      <div className={cn("grid transition-all duration-200 ease-out", isOpen ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0")}>
        <div className={cn(isOpen ? "overflow-visible" : "overflow-hidden")}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function FilterSidebar({
  procedure, onProcedureChange,
  country, onCountryChange,
  city, onCityChange,
  selectedRatings, onRatingToggle,
  selectedScoreRanges, onScoreToggle,
  selectedLanguages, onLanguageToggle,
  selectedAvailabilityDate, onAvailabilityDateChange,
  showVerifiedOnly, onShowVerifiedOnlyChange,
  onClear,
  availableProcedures,
  availableLanguages,
}: FilterSidebarProps) {
  const languagesList = availableLanguages && availableLanguages.length > 0 ? availableLanguages : languages;
  const [countriesList, setCountriesList] = React.useState<CSCCountry[]>([]);
  const [citiesList, setCitiesList] = React.useState<CSCCity[]>([]);

  React.useEffect(() => {
    async function loadCountries() {
      const list = await getCountries();
      setCountriesList(list);
    }
    loadCountries();
  }, []);

  React.useEffect(() => {
    async function loadCities() {
      if (!country || country === "All Countries") {
        const list = await getAllCities();
        setCitiesList(list);
      } else {
        const countryObj = countriesList.find(
          (c) => c.name.toLowerCase() === country.toLowerCase()
        );
        if (countryObj) {
          const list = await getCities(countryObj.iso2);
          setCitiesList(list);
        } else {
          setCitiesList([]);
        }
      }
    }
    loadCities();
  }, [country, countriesList]);

  return (
    <aside className="flex w-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:min-h-[calc(100vh-8rem)] lg:sticky lg:top-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-extrabold tracking-tight text-slate-900">Filters</h2>
        <button
          type="button"
          onClick={onClear}
          className="text-[13px] font-bold text-[#003366] transition-colors hover:text-[#002244] underline underline-offset-4 cursor-pointer"
        >
          Clear All
        </button>
      </div>

      <div
        className={cn(
          "flex-1 overflow-y-auto pr-2 -mr-1 lg:max-h-[calc(100vh-12rem)]",
          "[&::-webkit-scrollbar]:w-1",
          "[&::-webkit-scrollbar-track]:bg-transparent",
          "[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200",
          "[&::-webkit-scrollbar-thumb:hover]:bg-slate-300",
          "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200"
        )}
      >

        {/* Procedure */}
        <FilterSection title="Procedure">
          <SearchableDropdown
            value={procedure}
            onChange={onProcedureChange}
            options={availableProcedures}
            placeholder="Select Procedure"
            clearValue="All Procedures"
          />
        </FilterSection>

        {/* Country */}
        <FilterSection title="Country">
          <SearchableDropdown
            value={country}
            onChange={(val) => {
              onCountryChange(val);
              onCityChange("All Cities");
            }}
            options={["All Countries", ...countriesList.map((c) => c.name)]}
            placeholder="Select Country"
            clearValue="All Countries"
          />
        </FilterSection>

        {/* City */}
        <FilterSection title="City">
          <SearchableDropdown
            value={city}
            onChange={onCityChange}
            options={["All Cities", ...citiesList.map((c) => c.name)]}
            placeholder="Select City"
            clearValue="All Cities"
          />
        </FilterSection>

        {/* RDV Score */}
        <FilterSection title="RDV Score">
          <div className="space-y-3">
            {scoreRanges.map((range) => (
              <div key={range} className="flex cursor-pointer items-center gap-3">
                <Checkbox
                  id={range}
                  checked={selectedScoreRanges.includes(range)}
                  onCheckedChange={() => onScoreToggle(range)}
                  className="size-4 rounded border-slate-300 data-[state=checked]:border-[#003366] data-[state=checked]:bg-[#003366]"
                />
                <label htmlFor={range} className="cursor-pointer select-none text-[13px] font-medium text-slate-600">
                  {range}
                </label>
              </div>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Rating">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((stars) => (
              <div key={stars} className="flex cursor-pointer items-center gap-3">
                <Checkbox
                  id={`star-${stars}`}
                  checked={selectedRatings.includes(stars)}
                  onCheckedChange={() => onRatingToggle(stars)}
                  className="size-4 rounded border-slate-300 data-[state=checked]:border-[#003366] data-[state=checked]:bg-[#003366]"
                />
                <label htmlFor={`star-${stars}`} className="flex cursor-pointer gap-0.5">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      className={cn(
                        "size-3.5 transition-colors",
                        index < stars ? "fill-amber-400 text-amber-400" : "text-slate-200"
                      )}
                    />
                  ))}
                </label>
              </div>
            ))}
          </div>
        </FilterSection>

        {/* Show */}
        <FilterSection title="Show">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Checkbox
                id="all"
                checked={!showVerifiedOnly}
                onCheckedChange={() => onShowVerifiedOnlyChange(false)}
                className="size-4 rounded border-slate-300 data-[state=checked]:border-[#003366] data-[state=checked]:bg-[#003366]"
              />
              <label htmlFor="all" className="cursor-pointer select-none text-[13px] font-medium text-slate-600">
                All Dentists
              </label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                id="verified"
                checked={showVerifiedOnly}
                onCheckedChange={() => onShowVerifiedOnlyChange(true)}
                className="size-4 rounded border-slate-300 data-[state=checked]:border-[#003366] data-[state=checked]:bg-[#003366]"
              />
              <label htmlFor="verified" className="cursor-pointer select-none text-[13px] font-medium text-slate-600">
                Only Verified
              </label>
            </div>
          </div>
        </FilterSection>

        {/* Languages */}
        <FilterSection title="Languages">
          <div className="space-y-3">
            {languagesList.map((language) => (
              <div key={language} className="flex items-center gap-3">
                <Checkbox
                  id={language}
                  checked={selectedLanguages.includes(language)}
                  onCheckedChange={() => onLanguageToggle(language)}
                  className="size-4 rounded border-slate-300 data-[state=checked]:border-[#003366] data-[state=checked]:bg-[#003366]"
                />
                <label htmlFor={language} className="cursor-pointer select-none text-[13px] font-medium text-slate-600">
                  {language}
                </label>
              </div>
            ))}
          </div>
        </FilterSection>

        {/* Availability */}
        <FilterSection title="Availability" defaultOpen={false}>
          <MiniCalendar
            selected={selectedAvailabilityDate ? new Date(selectedAvailabilityDate) : null}
            onSelect={(date) => onAvailabilityDateChange(date ? date.toISOString() : null)}
            fullWidth
          />
        </FilterSection>
      </div>
    </aside>
  );
}