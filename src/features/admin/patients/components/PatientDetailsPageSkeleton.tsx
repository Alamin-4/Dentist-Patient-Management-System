// src/app/(admin-dashboard)/modules/patients/components/patient-detail-skeleton.tsx

export function PatientDetailSkeleton() {
    return (
        <div className="flex flex-col gap-5">
            {/* ── Breadcrumb + Edit ──────────────────────────────────────── */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                </div>
                <div className="h-9 w-20 animate-pulse rounded-lg bg-gray-200" />
            </div>

            {/* ── Hero card ─────────────────────────────────────────────── */}
            <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    {/* Left: avatar + info */}
                    <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className="h-14 w-14 shrink-0 animate-pulse rounded-full bg-gray-200 sm:h-16 sm:w-16" />

                        {/* Name + badges + meta */}
                        <div className="flex-1 space-y-3">
                            {/* Name + badges */}
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="h-7 w-48 animate-pulse rounded bg-gray-200" />
                                <div className="h-5 w-16 animate-pulse rounded-full bg-gray-200" />
                                <div className="h-5 w-16 animate-pulse rounded-full bg-gray-200" />
                            </div>

                            {/* Meta row */}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
                                <div className="flex items-center gap-1.5">
                                    <div className="h-3.5 w-3.5 animate-pulse rounded bg-gray-200" />
                                    <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="h-3.5 w-3.5 animate-pulse rounded bg-gray-200" />
                                    <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="h-3.5 w-3.5 animate-pulse rounded bg-gray-200" />
                                    <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="h-3.5 w-3.5 animate-pulse rounded bg-gray-200" />
                                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="h-3.5 w-3.5 animate-pulse rounded bg-gray-200" />
                                    <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Referral credits */}
                    <div className="shrink-0 text-right">
                        <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
                        <div className="mt-1 h-8 w-16 animate-pulse rounded bg-gray-200" />
                    </div>
                </div>
            </div>

            {/* ── Detail Stats ───────────────────────────────────────────── */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div
                        key={i}
                        className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm"
                    >
                        <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
                        <div className="mt-2 h-7 w-16 animate-pulse rounded bg-gray-200" />
                        <div className="mt-2 h-3 w-24 animate-pulse rounded bg-gray-200" />
                    </div>
                ))}
            </div>

            {/* ── Main Tabs ─────────────────────────────────────────────── */}
            <div>
                {/* Tab headers */}
                <div className="rounded-t-xl border-b border-gray-100 bg-white px-4 pt-1 shadow-sm">
                    <div className="flex gap-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="pb-3">
                                <div className="h-5 w-24 animate-pulse rounded bg-gray-200" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tab content area */}
                <div className="mt-0">
                    <div className="rounded-b-xl border border-gray-100 bg-white p-5 shadow-sm">
                        {/* Overview tab skeleton */}
                        <div className="space-y-6">
                            {/* Section 1 */}
                            <div className="space-y-3">
                                <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <div key={i} className="space-y-2">
                                            <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
                                            <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Section 2 */}
                            <div className="space-y-3">
                                <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />
                                <div className="space-y-2">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="h-16 animate-pulse rounded-lg bg-gray-200" />
                                    ))}
                                </div>
                            </div>

                            {/* Section 3 */}
                            <div className="space-y-3">
                                <div className="h-5 w-36 animate-pulse rounded bg-gray-200" />
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="h-24 animate-pulse rounded-lg bg-gray-200" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}