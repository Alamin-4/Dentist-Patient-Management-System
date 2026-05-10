"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { X } from "lucide-react";

import DentistCard from "../_components/module/DentistAllComponents/DentistCard";
import DentistMap from "../_components/module/DentistAllComponents/Map/DentistMap";
import TopBar from "../_components/module/DentistAllComponents/TopBar";
import FilterSidebar from "../_components/module/DentistAllComponents/SideBar/FilterSidebar";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  dentists,
  procedureOptions,
  type Dentist,
} from "../_components/module/DentistAllComponents/types";

const defaultPriceRange: [number, number] = [900, 1800];

export default function FindDentist() {
  // States
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [procedure, setProcedure] = useState("All Procedures");
  const [priceRange, setPriceRange] =
    useState<[number, number]>(defaultPriceRange);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [activeDentistId, setActiveDentistId] = useState<string | null>(null);

  // Compare States (Image 8 logic)
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [compareList, setCompareList] = useState<Dentist[]>([]);

  // Filtering Logic
  const filteredDentists = useMemo(() => {
    return dentists.filter((dentist) => {
      const matchesQuery =
        !query || dentist.name.toLowerCase().includes(query.toLowerCase());
      const matchesProcedure =
        procedure === "All Procedures" ||
        dentist.procedures.includes(procedure);
      const matchesPrice =
        dentist.price >= priceRange[0] && dentist.price <= priceRange[1];
      const matchesRating =
        selectedRatings.length === 0 ||
        selectedRatings.includes(Math.round(dentist.rating));
      return matchesQuery && matchesProcedure && matchesPrice && matchesRating;
    });
  }, [priceRange, procedure, query, selectedRatings]);

  const handleCompareToggle = (dentist: Dentist) => {
    setCompareList((prev) => {
      const exists = prev.find((d) => d.id === dentist.id);
      if (exists) return prev.filter((d) => d.id !== dentist.id);
      if (prev.length < 3) return [...prev, dentist];
      return prev;
    });
  };

  return (
    <div className="min-h-screen text-slate-900 pb-20">
      <TopBar
        query={query}
        onQueryChange={setQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        resultCount={filteredDentists.length}
      />

      <main className="max-w-360 mx-auto w-11/12 py-8">
        <div
          className={cn(
            "grid gap-8 transition-all duration-500",
            viewMode === "list"
              ? "lg:grid-cols-[280px_1fr]"
              : "lg:grid-cols-[1fr_1.2fr]",
          )}
        >
          {/* ১. Sidebar Section - Only show in list mode */}
          <AnimatePresence mode="wait">
            {viewMode === "list" && (
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="hidden lg:block sticky top-24 h-fit"
              >
                <FilterSidebar
                  procedure={procedure}
                  onProcedureChange={setProcedure}
                  priceRange={priceRange}
                  onPriceRangeChange={setPriceRange}
                  selectedRatings={selectedRatings}
                  onRatingToggle={(r) =>
                    setSelectedRatings((prev) =>
                      prev.includes(r)
                        ? prev.filter((x) => x !== r)
                        : [...prev, r],
                    )
                  }
                  onClear={() => {
                    setQuery("");
                    setProcedure("All Procedures");
                    setPriceRange(defaultPriceRange);
                    setSelectedRatings([]);
                  }}
                  availableProcedures={procedureOptions}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col gap-6">
            <div className="">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[#6B7280] font-medium text-sm md:text-base">
                    {filteredDentists.length} Verified Dentists in{" "}
                    <span className="text-[#1A1A2E]">
                      Mexico City | $900 - $1,400
                    </span>
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-800 block">
                      Compare
                    </span>
                    <span className="text-[10px] font-medium text-slate-400 block uppercase">
                      up to 3
                    </span>
                  </div>
                  <Switch
                    checked={isCompareMode}
                    onCheckedChange={(val) => {
                      setIsCompareMode(val);
                      if (!val) setCompareList([]);
                    }}
                    className="data-[state=checked]:bg-[#003366]"
                  />
                </div>
              </div>

              <AnimatePresence>
                {isCompareMode && compareList.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="flex items-center justify-center gap-8 mt-8 pt-6 border-t border-slate-50"
                  >
                    <div className="flex items-center gap-4">
                      {compareList.map((d) => (
                        <DentistCard dentist={d} />
                      ))}
                    </div>
                    <button className="px-8 py-3 bg-[#003366] text-white text-sm font-bold rounded-xl shadow-lg hover:bg-[#00284d] transition-transform active:scale-95">
                      Compare
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div
              className={cn(
                "grid gap-6",
                viewMode === "map" &&
                  "lg:max-h-[70vh] lg:overflow-y-auto lg:pr-2 custom-scrollbar",
              )}
            >
              {filteredDentists.map((dentist) => (
                <DentistCard
                  key={dentist.id}
                  dentist={dentist}
                  isCompareMode={isCompareMode}
                  isSelectedForCompare={compareList.some(
                    (d) => d.id === dentist.id,
                  )}
                  onCompareToggle={() => handleCompareToggle(dentist)}
                  onPrimaryAction={() => setActiveDentistId(dentist.id)}
                />
              ))}
            </div>
          </div>

          <AnimatePresence>
            {viewMode === "map" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="hidden lg:block sticky top-24 h-[calc(100vh-12rem)] rounded-[32px] overflow-hidden shadow-2xl border border-white"
              >
                <DentistMap
                  dentists={filteredDentists}
                  activeDentistId={activeDentistId}
                  onMarkerClick={(d) => setActiveDentistId(d.id)}
                  onCloseCard={() => setActiveDentistId(null)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
