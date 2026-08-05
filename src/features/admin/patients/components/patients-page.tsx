"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ErrorState } from "@/components/shared/error-state";
import usePatients from "@/hooks/admin/patients/usePatients";
import { CustomStats } from "@/app/(admin-dashboard)/modules/shared/custom-stats";

import type { StatusFilter } from "./types";
import { PatientsHeader } from "./patients-header";
import { Tabs, TabItem } from "@/components/ui/tabs/Tabs";
import { useUrlTab } from "@/components/ui/tabs/useUrlTab";
import { PatientsFilters } from "./patients-filters";
import { PatientsTable } from "./patients-table";
import { PatientsPagination } from "./patients-pagination";

const PAGE_SIZE = 8;

export default function PatientsPage() {
    const router = useRouter();

    const [headerSearch, setHeaderSearch] = useState("");
    const [tableSearch, setTableSearch] = useState("");
    const [cityFilter, setCityFilter] = useState("all");
    const [page, setPage] = useState(1);

    const [activeTab, setActiveTab] = useUrlTab<StatusFilter>(
        "tab",
        "all",
        ["all", "Active", "Inactive"]
    );

    // Call the backend API using our React Query hook
    const { patientslist, patientslistData, isPatientslistLoading, isPatientslistError } = usePatients({
        status: activeTab === "all" ? undefined : activeTab,
        city: cityFilter === "all" ? undefined : cityFilter,
        search: tableSearch || headerSearch || undefined,
        page,
        limit: PAGE_SIZE,
    });

    const meta = patientslistData?.data?.meta || {
        total_patients: 0,
        weekly_growth: 0,
        active_90d: 0,
        active_engagement_pct: "0%",
        new_today: 0,
        avg_per_day: 0,
        inactive_today: 0,
        inactive_pct: "0%",
        active_count: 0,
        inactive_count: 0,
    };

    const stats = [
        { label: "Total Patients", value: meta.total_patients.toLocaleString(), sub: `+${meta.weekly_growth} this week` },
        { label: "Active (90D)", value: meta.active_90d.toLocaleString(), sub: `${meta.active_engagement_pct} engagement` },
        { label: "New Today", value: meta.new_today.toString(), sub: `vs avg ${meta.avg_per_day}/day` },
        { label: "Inactive", value: meta.inactive_today.toString(), sub: meta.inactive_pct },
    ];

    const tabs: TabItem<StatusFilter>[] = [
        { id: "all", label: "All patients", count: meta.total_patients },
        { id: "Active", label: "Active", count: meta.active_count },
        { id: "Inactive", label: "Inactive", count: meta.inactive_count },
    ];

    const allCities = useMemo(() => {
        const dbCities = patientslistData?.data?.cities || [];
        return ["all", ...dbCities];
    }, [patientslistData]);

    const totalPages = Math.max(1, Math.ceil((patientslistData?.data?.total || 0) / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const pageData = patientslistData?.data?.patients || [];

    const handleRowClick = (id: string) => router.push(`/admin/patients/${id}`);

    const handleTabChange = (key: string) => {
        setActiveTab(key as StatusFilter);
        setPage(1);
    };

    const handleCityChange = (city: string) => {
        setCityFilter(city);
        setPage(1);
    };

    const handleSearchChange = (query: string) => {
        setTableSearch(query);
        setPage(1);
    };
    console.log(patientslistData)
    return (
        <div className="flex flex-col gap-5">
            <PatientsHeader headerSearch={headerSearch} setHeaderSearch={(val) => {
                setHeaderSearch(val);
                setPage(1);
            }} />

            <CustomStats stats={stats} />

            <div className="rounded-lg border border-gray-100 bg-white shadow-sm">
                <div className="px-4 overflow-x-auto pt-1">
                    <Tabs
                        tabs={tabs}
                        value={activeTab}
                        onChange={handleTabChange}
                        ariaLabel="Admin Patients Tabs"
                    />
                </div>

                <PatientsFilters
                    tableSearch={tableSearch}
                    setTableSearch={handleSearchChange}
                    cityFilter={cityFilter}
                    setCityFilter={handleCityChange}
                    allCities={allCities}
                    setPage={setPage}
                />

                {isPatientslistError ? (
                    <div className="py-8">
                        <ErrorState
                            title="Patients List Unavailable"
                            message="Could not load the patients list. Please check your connection and try again."
                            onRetry={() => patientslist.refetch()}
                        />
                    </div>
                ) : (
                    <PatientsTable pageData={pageData} isLoading={isPatientslistLoading} onRowClick={handleRowClick} />
                )}

                <PatientsPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    filteredLength={patientslistData?.data?.total || 0}
                    pageSize={PAGE_SIZE}
                    onPageChange={setPage}
                />
            </div>
        </div>
    );
}