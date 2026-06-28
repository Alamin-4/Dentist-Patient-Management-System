"use client";

import { useState, useMemo, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import dynamic from "next/dynamic";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useStateContext } from "@/providers/StateProvider";

import DentistCard from "./DentistCard";
import FilterSidebar from "./SideBar";
import FilterSheet from "./FilterSheet";
import TopBar from "./TopBar";
import CompareStickyBar from "./CompareStickyBar";

import {
  Dentist,
  cityOptions,
  countryOptions,
  procedureOptions,
} from "./types";
import { useMe } from "@/hooks/auth/useAuth";
import { useDentistDirectory } from "@/hooks/dentist/useDentistDirectory";

const DentistMap = dynamic(() => import("./Map/DentistMap"), { ssr: false });

export default function FindDentist() {
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "map" | "filter">("list");
  const [procedure, setProcedure] = useState("All Procedures");
  const [country, setCountry] = useState("All Countries");
  const [city, setCity] = useState("All Cities");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1800]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [selectedScoreRanges, setSelectedScoreRanges] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedAvailabilityDate, setSelectedAvailabilityDate] = useState<string | null>(null);
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);

  // Debounce search query to prevent excessive API requests
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  // Fetch from backend using these filters
  const { data: directoryResponse, isLoading: isDirLoading } = useDentistDirectory({
    limit: 100, // Safe limit to prevent backend crashes
    search: debouncedQuery || undefined,
    city: city !== "All Cities" ? city : undefined,
    country: country !== "All Countries" ? country : undefined,
    specialty: procedure !== "All Procedures" ? procedure : undefined,
    status: showVerifiedOnly ? "VERIFIED" : undefined,
  });

  const mappedDentists = useMemo(() => {
    const apiList = directoryResponse?.data || [];
    return apiList.map((d: any) => ({
      id: d.id,
      name: d.name,
      slug: d.slug,
      specialty: d.specialty || "General Dentist",
      rating: d.googleRating || d.doctoraliaRating || d.rating || 5.0,
      reviewCount: d.googleReviewCount || d.doctoraliaReviewCount || d.reviewCount || 0,
      image: d.image || "/placeholder-avatar.png",
      location: d.fullAddress || d.city || "Mexico",
      city: d.city || "",
      country: "Mexico",
      price: d.price || 0,
      rdvScore: d.rdvScore || 0,
      verified: d.status === "VERIFIED",
      status: d.status,
      isClaimable: d.isClaimable,
      procedures: d.specialty ? [d.specialty] : [],
      languages: d.languages || ["English", "Spanish"],
      coords: { lat: 19.4326, lng: -99.1332 },
    }));
  }, [directoryResponse]);

  const toggleRating = (rating: number) => {
    setSelectedRatings((prev) =>
      prev.includes(rating) ? prev.filter((v) => v !== rating) : [...prev, rating]
    );
  };

  const toggleScore = (range: string) => {
    setSelectedScoreRanges((prev) =>
      prev.includes(range) ? prev.filter((v) => v !== range) : [...prev, range]
    );
  };

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((v) => v !== lang) : [...prev, lang]
    );
  };

  const resetAll = () => {
    setQuery("");
    setProcedure("All Procedures");
    setCountry("All Countries");
    setCity("All Cities");
    setPriceRange([0, 1800]);
    setSelectedRatings([]);
    setSelectedScoreRanges([]);
    setSelectedLanguages([]);
    setSelectedAvailabilityDate(null);
    setShowVerifiedOnly(false);
  };

  // Perform remaining client-side filtering on price, rating, score, language
  const filteredDentists = useMemo(() => {
    return mappedDentists.filter((dentist: Dentist) => {
      const matchesPrice = dentist.price >= priceRange[0] && dentist.price <= priceRange[1];
      const matchesRating =
        selectedRatings.length === 0 ||
        selectedRatings.includes(Math.round(dentist.rating));
      const matchesScore =
        selectedScoreRanges.length === 0 ||
        selectedScoreRanges.some((range) => {
          if (range === "0-25") return dentist.rdvScore >= 0 && dentist.rdvScore <= 25;
          if (range === "25-50") return dentist.rdvScore > 25 && dentist.rdvScore <= 50;
          if (range === "50-75") return dentist.rdvScore > 50 && dentist.rdvScore <= 75;
          if (range === "75-100") return dentist.rdvScore > 75 && dentist.rdvScore <= 100;
          return true;
        });
      const matchesLanguages =
        selectedLanguages.length === 0 ||
        selectedLanguages.every((lang) => dentist.languages.includes(lang));

      return matchesPrice && matchesRating && matchesScore && matchesLanguages;
    });
  }, [mappedDentists, priceRange, selectedRatings, selectedScoreRanges, selectedLanguages]);

  const filters = {
    query,
    setQuery,
    viewMode,
    setViewMode,
    procedure,
    setProcedure,
    country,
    setCountry,
    city,
    setCity,
    priceRange,
    setPriceRange,
    selectedRatings,
    toggleRating,
    selectedScoreRanges,
    toggleScore,
    selectedLanguages,
    toggleLanguage,
    selectedAvailabilityDate,
    setSelectedAvailabilityDate,
    showVerifiedOnly,
    setShowVerifiedOnly,
    filteredDentists,
    resetAll,
  };

  const [activeDentistId, setActiveDentistId] = useState<string | null>(null);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [compareList, setCompareList] = useState<Dentist[]>([]);
  const [showMapFilters, setShowMapFilters] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // session user 
  const { user } = useMe();
  // App global state context
  const { setShowSignupModal, setDentistsToCompare, setShowPersonalizeModal, setShowCompareModal } =
    useStateContext();

  // loading state
  if (isDirLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#003366]"></div>
      </div>
    );
  }

  const handleCompareToggle = (dentist: Dentist) => {
    const exists = compareList.some((item) => item.id === dentist.id);
    if (exists) {
      setCompareList((prev) => prev.filter((item) => item.id !== dentist.id));
      return;
    }
    if (compareList.length < 3) {
      setCompareList((prev) => [...prev, dentist]);
    }
  };

  const removeSelectedDentist = (id: string) => {
    setCompareList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCompareSubmit = () => {
    setDentistsToCompare(compareList);
    if (user) {
      const hasProfileDetails = !!(user?.first_name || user?.name || user?.firstName);
      if (hasProfileDetails) {
        setShowCompareModal(true);
      } else {
        setShowPersonalizeModal(true);
      }
    } else {
      setShowSignupModal(true);
    }
  };

  const handleClearAllFilters = () => {
    filters.resetAll();
    setCompareList([]);
    setIsCompareMode(false);
  };

  return (
    <div className="min-h-screen text-slate-900">
      <TopBar
        query={filters.query}
        onQueryChange={filters.setQuery}
        viewMode={filters.viewMode}
        onViewModeChange={(mode) => {
          filters.setViewMode(mode);
          setShowMapFilters(false);
        }}
        showMapFilters={showMapFilters}
        onToggleMapFilters={() => setShowMapFilters((prev) => !prev)}
        onOpenMobileFilters={() => setIsMobileFilterOpen(true)}
      />

      <FilterSheet
        open={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        procedure={filters.procedure}
        onProcedureChange={filters.setProcedure}
        country={filters.country}
        onCountryChange={filters.setCountry}
        city={filters.city}
        onCityChange={filters.setCity}
        priceRange={filters.priceRange}
        onPriceRangeChange={filters.setPriceRange}
        selectedRatings={filters.selectedRatings}
        onRatingToggle={filters.toggleRating}
        selectedScoreRanges={filters.selectedScoreRanges}
        onScoreToggle={filters.toggleScore}
        selectedLanguages={filters.selectedLanguages}
        onLanguageToggle={filters.toggleLanguage}
        selectedAvailabilityDate={filters.selectedAvailabilityDate}
        onAvailabilityDateChange={filters.setSelectedAvailabilityDate}
        showVerifiedOnly={filters.showVerifiedOnly}
        onShowVerifiedOnlyChange={filters.setShowVerifiedOnly}
        onClear={handleClearAllFilters}
        availableProcedures={procedureOptions}
        availableCountries={countryOptions}
        availableCities={cityOptions}
      />

      <main className="pb-16">
        <div className="flex gap-4">
          <AnimatePresence initial={false}>
            {(filters.viewMode === "list" ||
              (filters.viewMode === "map" && showMapFilters)) && (
                <motion.aside
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  className="hidden lg:block max-w-80 w-full"
                >
                  <FilterSidebar
                    procedure={filters.procedure}
                    onProcedureChange={filters.setProcedure}
                    country={filters.country}
                    onCountryChange={filters.setCountry}
                    city={filters.city}
                    onCityChange={filters.setCity}
                    priceRange={filters.priceRange}
                    onPriceRangeChange={filters.setPriceRange}
                    selectedRatings={filters.selectedRatings}
                    onRatingToggle={filters.toggleRating}
                    selectedScoreRanges={filters.selectedScoreRanges}
                    onScoreToggle={filters.toggleScore}
                    selectedLanguages={filters.selectedLanguages}
                    onLanguageToggle={filters.toggleLanguage}
                    selectedAvailabilityDate={filters.selectedAvailabilityDate}
                    onAvailabilityDateChange={filters.setSelectedAvailabilityDate}
                    showVerifiedOnly={filters.showVerifiedOnly}
                    onShowVerifiedOnlyChange={filters.setShowVerifiedOnly}
                    onClear={handleClearAllFilters}
                    availableProcedures={procedureOptions}
                    availableCountries={countryOptions}
                    availableCities={cityOptions}
                  />
                </motion.aside>
              )}
          </AnimatePresence>

          <section className="max-w-full w-full">
            <div
              className={cn(
                "grid gap-6",
                filters.viewMode === "list" || showMapFilters
                  ? "grid-cols-1"
                  : "grid-cols-1 xl:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)]",
              )}
            >
              <div className={`min-w-0 ${showMapFilters ? "hidden" : "block"}`}>
                <div className="mb-4 flex flex-row gap-4 lg:items-center lg:justify-between">
                  <h2 className="text-xs font-medium leading-5 text-slate-500">
                    {filters.filteredDentists.length} Verified Dentists in
                    Mexico City | ${filters.priceRange[0]} - $
                    {filters.priceRange[1] >= 1800
                      ? "1,800"
                      : filters.priceRange[1].toLocaleString()}
                  </h2>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="block text-[12px] font-bold text-[#003366]">
                        Compare
                      </span>
                      <span className="block text-[10px] font-medium uppercase text-slate-400">
                        up to 3
                      </span>
                    </div>
                    <Switch
                      checked={isCompareMode}
                      onCheckedChange={(value) => {
                        setIsCompareMode(value);
                        if (!value) setCompareList([]);
                      }}
                      className="data-[state=checked]:bg-[#003366]"
                    />
                  </div>
                </div>

                {isCompareMode && (
                  <CompareStickyBar
                    compareList={compareList}
                    removeSelectedDentist={removeSelectedDentist}
                    onCompareSubmit={handleCompareSubmit}
                  />
                )}

                <div className="grid gap-4">
                  {filters.filteredDentists.map((dentist: Dentist) => (
                    <DentistCard
                      key={dentist.id}
                      dentist={dentist}
                      isCompareMode={isCompareMode}
                      isSelectedForCompare={compareList.some(
                        (item) => item.id === dentist.id,
                      )}
                      onCompareToggle={() => handleCompareToggle(dentist)}
                      onPrimaryAction={() => setActiveDentistId(dentist.id)}
                    />
                  ))}
                </div>
              </div>

              {filters.viewMode === "map" && (
                <div className="max-w-full w-full h-screen">
                  <div className="sticky top-24 h-full w-full overflow-hidden rounded-lg border border-slate-100 shadow">
                    <DentistMap
                      dentists={filters.filteredDentists}
                      activeDentistId={activeDentistId}
                      onMarkerClick={(dentist) =>
                        setActiveDentistId(dentist.id)
                      }
                      onCloseCard={() => setActiveDentistId(null)}
                    />
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
