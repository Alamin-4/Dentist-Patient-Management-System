"use client";

import { useState, useMemo, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import dynamic from "next/dynamic";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useStateContext } from "@/providers/StateProvider";

import DentistCard from "./DentistCard";
import DentistCardSkeleton from "./DentistCardSkeleton";
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

const PAGE_SIZE = 20;

function getPages(page: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

  const pages: (number | "...")[] = [1];
  if (page > 3) pages.push("...");

  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (page < totalPages - 2) pages.push("...");
  pages.push(totalPages);

  return pages;
}

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  return (
    <div className="mt-8 flex items-center justify-center gap-1.5">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronLeft className="size-4" />
      </button>

      {getPages(page, totalPages).map((p, i) =>
        p === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="flex h-9 w-9 items-center justify-center text-[13px] text-slate-400"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p as number)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg border text-[13px] font-medium transition-all",
              page === p
                ? "border-[#003366] bg-[#003366] text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50",
            )}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}

export default function FindDentist() {
  // --- Server-side filter state (name, country, city) ---
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("All Countries");
  const [city, setCity] = useState("All Cities");
  const [page, setPage] = useState(1);

  // --- UI-only filter state (client-side applied) ---
  const [procedure, setProcedure] = useState("All Procedures");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1800]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [selectedScoreRanges, setSelectedScoreRanges] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedAvailabilityDate, setSelectedAvailabilityDate] = useState<string | null>(null);
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);

  const [viewMode, setViewMode] = useState<"list" | "map" | "filter">("list");
  const [activeDentistId, setActiveDentistId] = useState<string | null>(null);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [compareList, setCompareList] = useState<Dentist[]>([]);
  const [showMapFilters, setShowMapFilters] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Debounce search — resets page on new query
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [query]);

  // Reset page when server-side filters change
  useEffect(() => { setPage(1); }, [country, city]);

  // Fetch with server-side params: name search + country + city + pagination
  const { data: directoryResponse, isLoading: isDirLoading } = useDentistDirectory({
    page,
    limit: PAGE_SIZE,
    search: debouncedQuery || undefined,
    city: city !== "All Cities" ? city : undefined,
    country: country !== "All Countries" ? country : undefined,
  });

  // Map API response to Dentist shape
  const apiDentists = useMemo<Dentist[]>(() => {
    const apiList = directoryResponse?.data || [];
    return apiList.map((d: any) => ({
      id: d.id,
      name: d.name,
      slug: d.slug,
      specialty: d.specialty || "General Dentist",
      rating: d.googleRating ?? d.doctoraliaRating ?? d.rating ?? 5.0,
      reviewCount: d.googleReviewCount ?? d.doctoraliaReviewCount ?? d.reviewCount ?? 0,
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

  // Apply client-side filters on top of current page results
  const filteredDentists = useMemo<Dentist[]>(() => {
    return apiDentists.filter((dentist) => {
      const matchesProcedure =
        procedure === "All Procedures" ||
        dentist.procedures.some((p) =>
          p.toLowerCase().includes(procedure.toLowerCase()),
        );
      const matchesPrice =
        dentist.price >= priceRange[0] && dentist.price <= priceRange[1];
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
      const matchesVerified = !showVerifiedOnly || dentist.verified;

      return (
        matchesProcedure &&
        matchesPrice &&
        matchesRating &&
        matchesScore &&
        matchesLanguages &&
        matchesVerified
      );
    });
  }, [
    apiDentists,
    procedure,
    priceRange,
    selectedRatings,
    selectedScoreRanges,
    selectedLanguages,
    showVerifiedOnly,
  ]);

  const meta = directoryResponse?.meta;
  const totalCount: number = meta?.total ?? meta?.totalCount ?? 0;
  const totalPages: number =
    meta?.totalPages ?? (totalCount > 0 ? Math.ceil(totalCount / PAGE_SIZE) : 0);

  const { user } = useMe();
  const { setShowSignupModal, setDentistsToCompare, setShowPersonalizeModal, setShowCompareModal } =
    useStateContext();

  const toggleRating = (rating: number) =>
    setSelectedRatings((prev) =>
      prev.includes(rating) ? prev.filter((v) => v !== rating) : [...prev, rating],
    );

  const toggleScore = (range: string) =>
    setSelectedScoreRanges((prev) =>
      prev.includes(range) ? prev.filter((v) => v !== range) : [...prev, range],
    );

  const toggleLanguage = (lang: string) =>
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((v) => v !== lang) : [...prev, lang],
    );

  const resetAll = () => {
    setQuery("");
    setCountry("All Countries");
    setCity("All Cities");
    setProcedure("All Procedures");
    setPriceRange([0, 1800]);
    setSelectedRatings([]);
    setSelectedScoreRanges([]);
    setSelectedLanguages([]);
    setSelectedAvailabilityDate(null);
    setShowVerifiedOnly(false);
    setPage(1);
  };

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
    resetAll();
    setCompareList([]);
    setIsCompareMode(false);
  };

  const sharedFilterProps = {
    procedure,
    onProcedureChange: setProcedure,
    country,
    onCountryChange: setCountry,
    city,
    onCityChange: setCity,
    priceRange,
    onPriceRangeChange: setPriceRange,
    selectedRatings,
    onRatingToggle: toggleRating,
    selectedScoreRanges,
    onScoreToggle: toggleScore,
    selectedLanguages,
    onLanguageToggle: toggleLanguage,
    selectedAvailabilityDate,
    onAvailabilityDateChange: setSelectedAvailabilityDate,
    showVerifiedOnly,
    onShowVerifiedOnlyChange: setShowVerifiedOnly,
    onClear: handleClearAllFilters,
    availableProcedures: procedureOptions,
    availableCountries: countryOptions,
    availableCities: cityOptions,
  };

  return (
    <div className="min-h-screen text-slate-900">
      <TopBar
        query={query}
        onQueryChange={setQuery}
        viewMode={viewMode}
        onViewModeChange={(mode) => {
          setViewMode(mode);
          setShowMapFilters(false);
        }}
        showMapFilters={showMapFilters}
        onToggleMapFilters={() => setShowMapFilters((prev) => !prev)}
        onOpenMobileFilters={() => setIsMobileFilterOpen(true)}
      />

      <FilterSheet
        open={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        {...sharedFilterProps}
      />

      <main className="pb-16">
        <div className="flex gap-4">
          <AnimatePresence initial={false}>
            {(viewMode === "list" || (viewMode === "map" && showMapFilters)) && (
              <motion.aside
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                className="hidden lg:block max-w-80 w-full"
              >
                <FilterSidebar {...sharedFilterProps} />
              </motion.aside>
            )}
          </AnimatePresence>

          <section className="max-w-full w-full min-w-0">
            <div
              className={cn(
                "grid gap-6",
                viewMode === "list" || showMapFilters
                  ? "grid-cols-1"
                  : "grid-cols-1 xl:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)]",
              )}
            >
              <div className={`min-w-0 ${showMapFilters ? "hidden" : "block"}`}>
                {/* Result count + compare toggle */}
                <div className="mb-4 flex flex-row gap-4 lg:items-center lg:justify-between">
                  <h2 className="text-xs font-medium leading-5 text-slate-500">
                    {isDirLoading ? (
                      <span className="inline-block h-4 w-48 animate-pulse rounded bg-slate-200" />
                    ) : (
                      <>
                        <span className="font-semibold text-slate-700">
                          {filteredDentists.length}
                        </span>{" "}
                        Verified Dentists
                        {city !== "All Cities"
                          ? ` in ${city}`
                          : country !== "All Countries"
                          ? ` in ${country}`
                          : ""}{" "}
                        | ${priceRange[0]} – $
                        {priceRange[1] >= 1800 ? "1,800+" : priceRange[1].toLocaleString()}
                      </>
                    )}
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

                {/* Dentist cards / skeletons / empty state */}
                <div className="grid gap-4">
                  {isDirLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <DentistCardSkeleton key={i} />
                    ))
                  ) : filteredDentists.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-[18px] border border-slate-200 bg-[#f8f9fb] py-20 text-center">
                      <p className="text-[16px] font-semibold text-slate-700">
                        No dentists found
                      </p>
                      <p className="mt-1 text-[13px] text-slate-400">
                        Try adjusting your search or filters
                      </p>
                      <button
                        type="button"
                        onClick={handleClearAllFilters}
                        className="mt-4 rounded-lg bg-[#003366] px-5 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
                      >
                        Clear filters
                      </button>
                    </div>
                  ) : (
                    filteredDentists.map((dentist) => (
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
                    ))
                  )}
                </div>

                {/* Server-side pagination */}
                {!isDirLoading && totalPages > 1 && (
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={(p) => {
                      setPage(p);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  />
                )}
              </div>

              {viewMode === "map" && (
                <div className="max-w-full w-full h-screen">
                  <div className="sticky top-24 h-full w-full overflow-hidden rounded-lg border border-slate-100 shadow">
                    <DentistMap
                      dentists={filteredDentists}
                      activeDentistId={activeDentistId}
                      onMarkerClick={(dentist) => setActiveDentistId(dentist.id)}
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
