import { Search, Download, ChevronDown } from "lucide-react";

interface Props {
    headerSearch: string;
    setHeaderSearch: (val: string) => void;
}

export function PatientsHeader({ headerSearch, setHeaderSearch }: Props) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-[#1A1A2E]">Patients</h1>
                <p className="mt-0.5 text-sm text-gray-500">View and manage all registered patients across the platform.</p>
            </div>
            <div className="flex items-center gap-2">
                <div className="relative hidden sm:block">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        value={headerSearch} onChange={(e) => setHeaderSearch(e.target.value)}
                        placeholder="Search patients..."
                        className="h-9 w-52 rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none placeholder:text-gray-400 focus:border-[#1A1A2E] focus:ring-1 focus:ring-[#1A1A2E]"
                    />
                </div>
                <button className="flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Status <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                </button>
                <button className="flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    City <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                </button>
                <button className="flex h-9 items-center gap-2 rounded-lg bg-[#1A1A2E] px-4 text-sm font-semibold text-white hover:bg-[#1A1A2E]/90 transition-colors">
                    <Download className="h-4 w-4" /> Export
                </button>
            </div>
        </div>
    );
}