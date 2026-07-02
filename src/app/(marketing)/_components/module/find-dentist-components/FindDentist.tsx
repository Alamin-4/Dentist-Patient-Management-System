// modules/find-dentist/components/FindDentist.tsx

"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";
import { useStateContext } from "@/providers/StateProvider";
import { useMe } from "@/hooks/auth/useAuth";
import {
    useDentistDirectory,
    useDirectoryCountries,
    useAddDentistToDirectory,
} from "@/hooks/dentist/useDentistDirectory";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";


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

    // ── Add a Dentist state & mutation ──────────────────────────────────────
    const router = useRouter();
    const addDentistMutation = useAddDentistToDirectory();
    const [isAddDentistOpen, setIsAddDentistOpen] = useState(false);
    const [addForm, setAddForm] = useState({
        fullName: "",
        clinicName: "",
        city: "",
        country: "",
        specialty: "",
        phone: "",
    });

    const handleAddDentistSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!addForm.fullName.trim()) {
            toast.error("Dentist full name is required.");
            return;
        }

        const toastId = toast.loading("Adding dentist to directory...");
        addDentistMutation.mutate(
            addForm,
            {
                onSuccess: (res: any) => {
                    const slug = res?.data?.slug;
                    if (slug) {
                        toast.success(res.message || "Dentist profile ready for claim!", { id: toastId });
                        setIsAddDentistOpen(false);
                        // Reset form
                        setAddForm({
                            fullName: "",
                            clinicName: "",
                            city: "",
                            country: "",
                            specialty: "",
                            phone: "",
                        });
                        // Redirect to the newly created profile with claim dialog active
                        router.push(`/find-dentist/${slug}?claim=true`);
                    } else {
                        toast.error("Failed to process dentist profile. Please try again.", { id: toastId });
                    }
                },
                onError: (err: any) => {
                    const errMsg = err?.response?.data?.message || err?.message || "Failed to add dentist profile.";
                    toast.error(errMsg, { id: toastId });
                },
            }
        );
    };


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

                                <DentistList
                                    dentists={filteredDentists}
                                    isLoading={isDirLoading}
                                    isCompareMode={compare.isCompareMode}
                                    compareList={compare.compareList}
                                    onCompareToggle={compare.handleCompareToggle}
                                    onCardClick={setActiveDentistId}
                                    onClearFilters={handleClearAllFilters}
                                    onAddDentistClick={() => setIsAddDentistOpen(true)}
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

            <Dialog open={isAddDentistOpen} onOpenChange={setIsAddDentistOpen}>
                <DialogContent className="sm:max-w-md bg-white border border-slate-200 shadow-xl rounded-lg">
                    <DialogHeader>
                        <DialogTitle className="text-[#0E3E65] font-bold text-xl">Add a Dentist Profile</DialogTitle>
                        <DialogDescription className="text-slate-500">
                            Enter details to add a dentist who isn't already in the RatedDocs database directory, then proceed to claim it.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleAddDentistSubmit} className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="fullName" className="font-semibold text-slate-700 text-sm">Full Name *</Label>
                            <Input
                                id="fullName"
                                value={addForm.fullName}
                                onChange={(e) => setAddForm({ ...addForm, fullName: e.target.value })}
                                placeholder="Dr. John Smith"
                                required
                                className="border-slate-200 focus:border-[#0E3E65] h-10 text-sm"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="clinicName" className="font-semibold text-slate-700 text-sm">Clinic Name</Label>
                                <Input
                                    id="clinicName"
                                    value={addForm.clinicName}
                                    onChange={(e) => setAddForm({ ...addForm, clinicName: e.target.value })}
                                    placeholder="Bright Smile Clinic"
                                    className="border-slate-200 focus:border-[#0E3E65] h-10 text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="specialty" className="font-semibold text-slate-700 text-sm">Specialty</Label>
                                <Input
                                    id="specialty"
                                    value={addForm.specialty}
                                    onChange={(e) => setAddForm({ ...addForm, specialty: e.target.value })}
                                    placeholder="Implantology"
                                    className="border-slate-200 focus:border-[#0E3E65] h-10 text-sm"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="city" className="font-semibold text-slate-700 text-sm">City</Label>
                                <Input
                                    id="city"
                                    value={addForm.city}
                                    onChange={(e) => setAddForm({ ...addForm, city: e.target.value })}
                                    placeholder="Tijuana"
                                    className="border-slate-200 focus:border-[#0E3E65] h-10 text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="country" className="font-semibold text-slate-700 text-sm">Country</Label>
                                <Input
                                    id="country"
                                    value={addForm.country}
                                    onChange={(e) => setAddForm({ ...addForm, country: e.target.value })}
                                    placeholder="Mexico"
                                    className="border-slate-200 focus:border-[#0E3E65] h-10 text-sm"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="font-semibold text-slate-700 text-sm">Phone Number</Label>
                            <Input
                                id="phone"
                                value={addForm.phone}
                                onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                                placeholder="+1 234 567 890"
                                className="border-slate-200 focus:border-[#0E3E65] h-10 text-sm"
                            />
                        </div>

                        <DialogFooter className="pt-4 border-t border-slate-100 mt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsAddDentistOpen(false)}
                                className="border-slate-200 text-slate-600 hover:bg-slate-50 h-10 text-sm"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={addDentistMutation.isPending}
                                className="bg-[#0E3E65] hover:bg-[#002850] text-white font-bold h-10 text-sm px-6"
                            >
                                {addDentistMutation.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Adding...
                                    </>
                                ) : (
                                    "Add & Claim Profile"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}