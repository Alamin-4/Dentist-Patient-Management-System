

function VerificationSkeleton() {
    return (
        <div>
            <div className="flex flex-col gap-5">
                {/* Header Skeleton */}
                <div>
                    <div className="h-8 w-64 bg-slate-200 rounded animate-pulse" />
                    <div className="mt-2 h-4 w-96 bg-slate-100 rounded animate-pulse" />
                </div>

                {/* Stat Cards Skeleton */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex flex-col gap-3 rounded-lg border border-gray-100 bg-white p-4 shadow-sm sm:p-5"
                        >
                            <div className="h-11 w-11 rounded-full bg-slate-200 animate-pulse" />
                            <div className="space-y-2 mt-1">
                                <div className="h-4 w-28 bg-slate-200 rounded animate-pulse" />
                                <div className="h-8 w-16 bg-slate-200 rounded animate-pulse" />
                                <div className="h-3 w-36 bg-slate-100 rounded animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="rounded-lg border border-gray-100 bg-white shadow-sm">
                    <div className="border-b border-gray-100 px-6 py-4 flex gap-8">
                        <div className="h-4 w-16 bg-slate-200 rounded animate-pulse" />
                        <div className="h-4 w-16 bg-slate-200 rounded animate-pulse" />
                        <div className="h-4 w-16 bg-slate-200 rounded animate-pulse" />
                    </div>

                    <div className="space-y-3 p-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div
                                key={i}
                                className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm sm:p-5"
                            >
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-start gap-3 sm:gap-4 w-full">
                                        <div className="h-10 w-10 sm:h-11 sm:w-11 shrink-0 rounded-full bg-slate-200 animate-pulse" />
                                        <div className="flex-1 space-y-2 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <div className="h-4 w-40 bg-slate-200 rounded animate-pulse" />
                                                <div className="h-4 w-16 bg-slate-100 rounded-full animate-pulse" />
                                            </div>
                                            <div className="flex gap-3 mt-1">
                                                <div className="h-3.5 w-32 bg-slate-100 rounded animate-pulse" />
                                                <div className="h-3.5 w-24 bg-slate-100 rounded animate-pulse" />
                                            </div>
                                            <div className="h-3 w-48 bg-slate-100 rounded mt-1.5 animate-pulse" />
                                        </div>
                                    </div>

                                    {/* Button Skeleton */}
                                    <div className="shrink-0 self-start sm:self-center">
                                        <div className="h-9 w-36 bg-slate-200 rounded-lg animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VerificationSkeleton