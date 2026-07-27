"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";
import { useStateContext } from "@/providers/StateProvider";
import { useMe } from "@/hooks/auth/useAuth";
import { useDentistDirectory } from "@/hooks/dentist/useDentistDirectory";

import TopBar from "../find-dentists-page-components/TopBar";
import FilterSheet from "../find-dentists-page-components/FilterSheet";
import CompareStickyBar from "../find-dentists-page-components/CompareStickyBar";
import ResultsHeader from "./ResultsHeader";
import DentistList from "./DentistList";
import Pagination from "./Pagination";
import { useDentistFilters } from "./use-dentist-filters";
import { useDentistCompare } from "./use-dentist-compare";
import { Dentist } from "../find-dentists-page-components/types";
import { PAGE_SIZE } from "./constants";
import FilterSidebar from "../find-dentists-page-components/SideBar";

// Extracted Components
import AddDentistModal from "./AddDentistModal";
import MobileMapDialog from "./MobileMapDialog";
import MapSection from "./MapSection";

export default function FindDentistComponents() {
    const router = useRouter();
    const filters = useDentistFilters();
    const compare = useDentistCompare();
    const { user } = useMe();
    const { setShowSignupModal, setDentistsToCompare, setShowPersonalizeModal, setShowCompareModal } = useStateContext();

    // UI State
    const [viewMode, setViewMode] = useState<"list" | "map" | "filter">("list");
    const [activeDentistId, setActiveDentistId] = useState<string | null>(null);
    const [showMapFilters, setShowMapFilters] = useState(false);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isAddDentistOpen, setIsAddDentistOpen] = useState(false);

    // Responsive check
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1280);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Redirect for claim/cancelled flows
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get("claim") === "true" || params.get("cancelled") === "true") {
            // Note: Assuming dentist list has at least one item or slug is passed differently. 
            // If this needs a specific slug, ensure it's available in context or URL.
            router.push(`/find-dentists/claim`);
        }
    }, [router]);

    // Data Fetching
    const { data: directoryResponse, isLoading: isDirLoading } = useDentistDirectory(filters.serverParams);

    const apiDentists = useMemo<Dentist[]>(() => {
        return (directoryResponse?.data ?? []).map((d: any): Dentist => {
            const google = d.googleRating ?? null;
            const doctoralia = d.doctoraliaRating ?? null;
            const combined = (google != null && doctoralia != null) ? (google + doctoralia) / 2 : (google ?? doctoralia ?? null);

            const accountType: Dentist["accountType"] =
                d.isClaimable === false ? "REGISTERED" : d.status === "CLAIMED" || d.status === "VERIFIED" ? "CLAIMED" : "CLAIMABLE";

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

    const filteredDentists = useMemo<Dentist[]>(() => {
        if (filters.selectedLanguages.length === 0) return apiDentists;
        return apiDentists.filter((d) =>
            filters.selectedLanguages.every((lang) => d.languages?.includes(lang))
        );
    }, [apiDentists, filters.selectedLanguages]);

    // Pagination & Meta
    const meta = directoryResponse?.meta;
    const totalCount = meta?.total ?? meta?.totalCount ?? 0;
    const totalPages = meta?.totalPages ?? (totalCount > 0 ? Math.ceil(totalCount / PAGE_SIZE) : 0);

    // Handlers
    const handleViewOnMap = (dentist: Dentist) => {
        setActiveDentistId(dentist.id);
        setViewMode("map");
    };

    const handleCompareSubmit = () => {
        if (compare.compareList.length < 2) return;
        setDentistsToCompare(compare.compareList);

        const hasProfileDetails = !!(user?.first_name || user?.name || user?.firstName);
        if (user && hasProfileDetails) {
            setShowCompareModal(true);
        } else {
            user ? setShowPersonalizeModal(true) : setShowSignupModal(true);
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

            <FilterSheet
                open={isMobileFilterOpen}
                onClose={() => setIsMobileFilterOpen(false)}
                {...filters.sharedFilterProps}
                availableLanguages={directoryResponse?.meta?.facets?.languages}
            />

            <main className="pb-16">
                <div className="flex gap-4">
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
                                    availableLanguages={directoryResponse?.meta?.facets?.languages}
                                />
                            </motion.aside>
                        )}
                    </AnimatePresence>

                    <section className="min-w-0 w-full">
                        <div
                            className={cn(
                                "grid gap-6",
                                viewMode === "list" || showMapFilters
                                    ? "grid-cols-1"
                                    : "grid-cols-1 xl:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)]"
                            )}
                        >
                            <div className={cn("min-w-0", showMapFilters && "hidden")}>
                                <ResultsHeader
                                    totalCount={totalCount}
                                    city={filters.city}
                                    country={filters.country}
                                    priceRange={filters.debouncedPrice}
                                    isLoading={isDirLoading}
                                    isCompareMode={compare.isCompareMode}
                                    onCompareToggle={compare.toggleCompareMode}
                                />

                                {compare.isCompareMode && (
                                    <CompareStickyBar
                                        compareList={compare.compareList}
                                        removeSelectedDentist={compare.removeSelectedDentist}
                                        onCompareSubmit={handleCompareSubmit}
                                    />
                                )}

                                <DentistList
                                    dentists={filteredDentists}
                                    isLoading={isDirLoading}
                                    isCompareMode={compare.isCompareMode}
                                    compareList={compare.compareList}
                                    onCompareToggle={compare.handleCompareToggle}
                                    onCardClick={setActiveDentistId}
                                    onClearFilters={handleClearAllFilters}
                                    onViewOnMap={handleViewOnMap}
                                    hasActiveFilters={filters.hasActiveFilters}
                                />

                                {!isDirLoading && totalPages > 1 && filteredDentists.length > 0 && (
                                    <Pagination page={filters.page} totalPages={totalPages} onPageChange={handlePageChange} />
                                )}
                            </div>

                            {!isMobile && viewMode === "map" && (
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

            <AddDentistModal open={isAddDentistOpen} onOpenChange={setIsAddDentistOpen} />

            {isMobile && (
                <MobileMapDialog
                    open={viewMode === "map"}
                    onOpenChange={(open) => {
                        if (!open) {
                            setViewMode("list");
                            setActiveDentistId(null);
                        }
                    }}
                    dentists={filteredDentists}
                    activeDentistId={activeDentistId}
                    onMarkerClick={(dentist) => setActiveDentistId(dentist.id)}
                    onCloseCard={() => setActiveDentistId(null)}
                />
            )}
        </div>
    );
}