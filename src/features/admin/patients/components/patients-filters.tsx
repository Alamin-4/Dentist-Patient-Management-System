import { Search, ChevronDown } from "lucide-react";

interface Props {
    tableSearch: string; setTableSearch: (val: string) => void;
    cityFilter: string; setCityFilter: (val: string) => void;
    allCities: string[]; setPage: (val: number) => void;
}

export function PatientsFilters({ tableSearch, setTableSearch, cityFilter, setCityFilter, allCities, setPage }: Props) {
    return (
        <div className="flex flex-col gap-2 border-b border-gray-100 px-4 py-3 sm:flex-row sm:items-center sm:gap-3">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                    value={tableSearch} onChange={(e) => { setTableSearch(e.target.value); setPage(1); }}
                    placeholder="Search by name, email, phone..."
                    className="h-9 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none placeholder:text-gray-400 focus:border-[#1A1A2E] focus:ring-1 focus:ring-[#1A1A2E]"
                />
            </div>
            <div className="relative">
                <select value={cityFilter} onChange={(e) => { setCityFilter(e.target.value); setPage(1); }}
                    className="h-9 appearance-none rounded-lg border border-gray-200 bg-white pl-3 pr-8 text-sm text-gray-700 outline-none focus:border-[#1A1A2E] focus:ring-1 focus:ring-[#1A1A2E]">
                    {allCities.map((c) => <option key={c} value={c}>{c === "all" ? "All cities" : c}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            </div>
            <div className="relative">
                <select className="h-9 appearance-none rounded-lg border border-gray-200 bg-white pl-3 pr-8 text-sm text-gray-700 outline-none focus:border-[#1A1A2E]">
                    <option>All time</option><option>Last 7 days</option><option>Last 30 days</option><option>Last 90 days</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            </div>
        </div>
    );
}