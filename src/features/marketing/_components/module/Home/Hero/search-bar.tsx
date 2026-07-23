"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Stethoscope, DollarSign, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGlobalProcedures } from "@/hooks/procedures/useProcedures";
import { proceduresLists } from "@/lib/location-data";

export default function SearchBar() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProcedure, setSelectedProcedure] = useState("");
  const [budget, setBudget] = useState({ min: "", max: "" });
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const { data: procedures = proceduresLists, isLoading: proceduresLoading } = useGlobalProcedures(debouncedSearch);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (selectedProcedure && selectedProcedure !== "All Procedures") {
      params.append("procedure", selectedProcedure);
    }

    const minPrice = budget.min ? Number(budget.min) : undefined;
    const maxPrice = budget.max ? Number(budget.max) : undefined;

    if (minPrice !== undefined && !isNaN(minPrice) && minPrice >= 0) {
      params.append("price[min]", minPrice.toString());
    }
    if (maxPrice !== undefined && !isNaN(maxPrice) && maxPrice >= 0) {
      params.append("price[max]", maxPrice.toString());
    }

    router.push(`/find-dentists?${params.toString()}`);
  };

  return (
    <div className="relative flex w-full flex-row *:flex-1 lg:flex-col gap-2 rounded-md border border-blue-50 bg-[#F4F9FD] p-2 shadow-sm flex-wrap xl:flex-row md:gap-0">

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center gap-3 px-5 py-3 transition-all hover:bg-white/50 md:rounded-l-full md:border-r md:border-gray-200"
        >
          <Stethoscope size={20} className="shrink-0 text-[#10436B]" />
          <div className="flex flex-1 items-center justify-between overflow-hidden">
            <span className={cn(
              "truncate text-sm font-medium",
              selectedProcedure ? "text-[#10436B]" : "text-gray-500"
            )}>
              {selectedProcedure || "Select procedures"}
            </span>
            <ChevronDown
              size={16}
              className={cn("text-gray-400 transition-transform", isOpen && "rotate-180")}
            />
          </div>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 z-50 mt-2 w-full rounded-lg border border-gray-100 bg-white p-2 shadow animate-in fade-in zoom-in duration-150 max-h-60 overflow-y-auto">
            <div className="sticky top-0 bg-white pb-2 pt-1 px-1">
              <input
                type="text"
                placeholder="Search procedure..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-md border border-gray-200 px-3 py-1.5 text-xs outline-none focus:border-[#10436B] focus:ring-1 focus:ring-[#10436B] text-slate-700 font-medium"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            {proceduresLoading ? (
              <div className="px-4 py-3 text-sm text-gray-500">Loading...</div>
            ) : procedures?.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500">No procedures found</div>
            ) : (
              <>
                <button
                  onClick={() => {
                    setSelectedProcedure("");
                    setIsOpen(false);
                  }}
                  className="w-full rounded-lg px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-[#F4F9FD] hover:text-[#10436B] transition-colors font-medium border-b border-gray-50"
                >
                  All Procedures
                </button>
                {procedures?.map((p: { name: string, slug: string }) => (
                  <button
                    key={p.slug}
                    onClick={() => {
                      setSelectedProcedure(p.name);
                      setIsOpen(false);
                    }}
                    className="w-full rounded-lg px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-[#F4F9FD] hover:text-[#10436B] transition-colors"
                  >
                    {p.name}
                  </button>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 px-5 py-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E3A32A]/15 text-[#E3A32A]">
          <DollarSign size={14} strokeWidth={3} />
        </div>
        <div className="flex flex-1 items-center gap-2">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Min"
            value={budget.min}
            className="w-16 bg-transparent text-sm font-semibold text-[#10436B] outline-none placeholder:text-gray-300"
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "");
              setBudget({ ...budget, min: val });
            }}
          />
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">to</span>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Max"
            value={budget.max}
            className="w-16 bg-transparent text-sm font-semibold text-[#10436B] outline-none placeholder:text-gray-300"
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "");
              setBudget({ ...budget, max: val });
            }}
          />
        </div>
      </div>

      <button
        onClick={handleSearch}
        className="group flex w-full items-center justify-center gap-2 rounded-md bg-[#10436B] py-3.5 px-6 text-sm font-bold text-white transition-all active:scale-95 md:w-auto md:px-8 hover:bg-[#0D3658] hover:shadow-lg"
      >
        <Search size={18} className="transition-transform group-hover:scale-110" />
        <span className="truncate">Find a Dentist</span>
      </button>
    </div>
  );
}