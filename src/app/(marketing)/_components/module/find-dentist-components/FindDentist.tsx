// modules/find-dentist/components/FindDentist.tsx

"use client";

import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";
import { useStateContext } from "@/providers/StateProvider";
import { useMe } from "@/hooks/auth/useAuth";
import { useDentistDirectory, useDirectoryCountries } from "@/hooks/dentist/useDentistDirectory";


import TopBar from "../DentistAllComponents/TopBar";
import FilterSheet from "../DentistAllComponents/FilterSheet";
import CompareStickyBar from "../DentistAllComponents/CompareStickyBar";
import ResultsHeader from "./ResultsHeader";
import DentistList from "./DentistList";
import MapSection from "./MapSection";
import Pagination from "./Pagination";
import { useDentistFilters } from "./use-dentist-filters";
import { useDentistCompare } from "./use-dentist-compare";
import { Dentist } from "../DentistAllComponents/types";
import { PAGE_SIZE } from "./constants";
import FilterSidebar from "../DentistAllComponents/SideBar";

export default function FindDentistComponents() {
    // ── Hooks ──────────────────────────────────────────────────────────────
    const filters = useDentistFilters();
    const compare = useDentistCompare();

    // ── Local UI state ─────────────────────────────────────────────────────
    const [viewMode, setViewMode] = useState<"list" | "map" | "filter">("list");
    const [activeDentistId, setActiveDentistId] = useState<string | null>(null);
    const [showMapFilters, setShowMapFilters] = useState(false);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // ── Data fetching ──────────────────────────────────────────────────────
    const { data: directoryResponse, isLoading: isDirLoading } = useDentistDirectory(
        filters.serverParams,
    );
    const { data: countryOptions } = useDirectoryCountries();

    // ── Map API response to Dentist shape ──────────────────────────────────
    const apiDentists = useMemo<Dentist[]>(() => {
        return (directoryResponse?.data ?? []).map((d: any): Dentist => {
            const google: number | null = d.googleRating ?? null;
            const doctoralia: number | null = d.doctoraliaRating ?? null;
            const combined: number | null =
                google != null && doctoralia != null
                    ? (google + doctoralia) / 2
                    : google ?? doctoralia ?? null;

            const accountType: Dentist["accountType"] =
                d.isClaimable === false
                    ? "REGISTERED"
                    : d.status === "CLAIMED" || d.status === "VERIFIED"
                        ? "CLAIMED"
                        : "CLAIMABLE";

            const hasCoords = typeof d.latitude === "number" && typeof d.longitude === "number";

            return {
                ...d,
                coords: hasCoords ? { lat: d.latitude, lng: d.longitude } : undefined,
                rating: {
                    google,
                    googleReviewCount: d.googleReviewCount ?? null,
                    doctoralia,
                    doctoraliaReviewCount: d.doctoraliaReviewCount ?? null,
                    combined,
                },
                location: {
                    city: d.city ?? null,
                    country: d.country ?? "",
                    fullAddress: d.fullAddress ?? null,
                    googleMapsUrl: d.googleMapsUrl ?? null,
                },
                accountType,
                isClaimed: d.status === "CLAIMED" || d.status === "VERIFIED",
                isVerified: d.status === "VERIFIED",
                surpriseGuarantee: d.surpriseGuarantee ?? false,
                verificationPhase: d.verificationPhase ?? null,
            };
        });
    }, [directoryResponse]);

    // Client-side language filter
    const filteredDentists = useMemo<Dentist[]>(() => {
        if (filters.selectedLanguages.length === 0) return apiDentists;
        return apiDentists.filter((d) =>
            filters.selectedLanguages.every((lang) => d.languages.includes(lang)),
        );
    }, [apiDentists, filters.selectedLanguages]);

    // ── Meta info ──────────────────────────────────────────────────────────
    const meta = directoryResponse?.meta;
    const totalCount: number = meta?.total ?? meta?.totalCount ?? 0;
    const totalPages: number =
        meta?.totalPages ?? (totalCount > 0 ? Math.ceil(totalCount / PAGE_SIZE) : 0);

    // ── Context & auth ─────────────────────────────────────────────────────
    const { user } = useMe();
    const { setShowSignupModal, setDentistsToCompare, setShowPersonalizeModal, setShowCompareModal } =
        useStateContext();

    // ── Handlers ───────────────────────────────────────────────────────────
    const handleCompareSubmit = () => {
        setDentistsToCompare(compare.compareList);
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
        compare.clearCompare();
    };

    const handlePageChange = (p: number) => {
        filters.setPage(p);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="min-h-screen">
            {/* Top Bar */}
            <TopBar
                query={filters.query}
                onQueryChange={filters.setQuery}
                viewMode={viewMode}
                onViewModeChange={(mode) => {
                    setViewMode(mode);
                    setShowMapFilters(false);
                }}
                showMapFilters={showMapFilters}
                onToggleMapFilters={() => setShowMapFilters((prev) => !prev)}
                onOpenMobileFilters={() => setIsMobileFilterOpen(true)}
            />

            {/* Mobile Filter Sheet */}
            <FilterSheet
                open={isMobileFilterOpen}
                onClose={() => setIsMobileFilterOpen(false)}
                {...filters.sharedFilterProps}
                availableCountries={countryOptions ?? filters.sharedFilterProps.availableCountries}
            />

            {/* Main Content */}
            <main className="pb-16">
                <div className="flex gap-4">
                    {/* Desktop Sidebar */}
                    <AnimatePresence initial={false}>
                        {(viewMode === "list" || (viewMode === "map" && showMapFilters)) && (
                            <motion.aside
                                initial={{ opacity: 0, x: -24 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -24 }}
                                className="hidden w-full max-w-80 lg:block"
                            >
                                <FilterSidebar
                                    {...filters.sharedFilterProps}
                                    availableCountries={countryOptions ?? filters.sharedFilterProps.availableCountries}
                                />
                            </motion.aside>
                        )}
                    </AnimatePresence>

                    {/* Results Section */}
                    <section className="min-w-0 w-full">
                        <div
                            className={cn(
                                "grid gap-6",
                                viewMode === "list" || showMapFilters
                                    ? "grid-cols-1"
                                    : "grid-cols-1 xl:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)]",
                            )}
                        >
                            {/* Left: List / Right: Map */}
                            <div className={cn("min-w-0", showMapFilters && "hidden")}>
                                {/* Results Header */}
                                <ResultsHeader
                                    totalCount={totalCount}
                                    city={filters.city}
                                    country={filters.country}
                                    priceRange={filters.debouncedPrice}
                                    isLoading={isDirLoading}
                                    isCompareMode={compare.isCompareMode}
                                    onCompareToggle={compare.toggleCompareMode}
                                />

                                {/* Compare Bar */}
                                {compare.isCompareMode && (
                                    <CompareStickyBar
                                        compareList={compare.compareList}
                                        removeSelectedDentist={compare.removeSelectedDentist}
                                        onCompareSubmit={handleCompareSubmit}
                                    />
                                )}

                                {/* Dentist List */}
                                <DentistList
                                    dentists={filteredDentists}
                                    isLoading={isDirLoading}
                                    isCompareMode={compare.isCompareMode}
                                    compareList={compare.compareList}
                                    onCompareToggle={compare.handleCompareToggle}
                                    onCardClick={setActiveDentistId}
                                    onClearFilters={handleClearAllFilters}
                                />

                                {/* Pagination */}
                                {!isDirLoading && totalPages > 1 && (
                                    <Pagination
                                        page={filters.page}
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange}
                                    />
                                )}
                            </div>

                            {/* Map View */}
                            {viewMode === "map" && (
                                <MapSection
                                    dentists={filteredDentists}
                                    activeDentistId={activeDentistId}
                                    onMarkerClick={(dentist) => setActiveDentistId(dentist.id)}
                                    onCloseCard={() => setActiveDentistId(null)}
                                />
                            )}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}