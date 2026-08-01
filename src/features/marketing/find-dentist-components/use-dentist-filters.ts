import { useCallback, useMemo, useRef, useTransition, useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { DEFAULT_FILTERS, DEFAULT_PRICE_RANGE, DEBOUNCE_DELAYS } from "./constants";
import { useGlobalProcedures } from "@/hooks/procedures/useProcedures";
import { getCountries, type CSCCountry } from "@/lib/countryApi";

// ─── Helpers ────────────────────────────────────────────────────────────────

function parseIntList(raw: string | null): number[] {
    if (!raw) return [];
    return raw.split(",").map(Number).filter((n) => !isNaN(n) && n > 0);
}

function parseStrList(raw: string | null): string[] {
    if (!raw) return [];
    return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

function serializeList(list: (string | number)[]): string {
    return list.join(",");
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export const useDentistFilters = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const [, startTransition] = useTransition();

    // Ref-based debounce timers — write directly to URL, never to state
    const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const priceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ── Country lookup (name ↔ ISO2) ─────────────────────────────────────────
    // We store ISO2 codes in the URL (e.g. "US") so the backend can match
    // the `country` column which also stores ISO2 codes. The sidebar displays
    // full names, so we need a two-way lookup.
    const [countriesMap, setCountriesMap] = useState<CSCCountry[]>([]);
    useEffect(() => {
        getCountries().then(setCountriesMap);
    }, []);

    /** Convert full name → ISO2 for API/URL storage */
    const nameToIso2 = useCallback(
        (name: string): string => {
            if (!name || name === DEFAULT_FILTERS.country) return name;
            const found = countriesMap.find(
                (c) => c.name.toLowerCase() === name.toLowerCase()
            );
            return found ? found.iso2 : name; // fall back to raw value
        },
        [countriesMap]
    );

    /** Convert ISO2 → full name for display */
    const iso2ToName = useCallback(
        (iso2: string): string => {
            if (!iso2 || iso2 === DEFAULT_FILTERS.country) return iso2;
            const found = countriesMap.find(
                (c) => c.iso2.toLowerCase() === iso2.toLowerCase()
            );
            return found ? found.name : iso2; // fall back to raw value
        },
        [countriesMap]
    );

    const { data: globalProcedures } = useGlobalProcedures();
    const procedureOptions = useMemo(() => {
        if (!globalProcedures) return ["All Procedures"];
        const list = Array.isArray(globalProcedures)
            ? globalProcedures
            : (globalProcedures as any).data || [];
        const names = list.map((p: any) => p.name).filter(Boolean) as string[];
        return ["All Procedures", ...names];
    }, [globalProcedures]);

    // ── Derived filter values — read directly from URL on every render ───────
    const query = searchParams.get("search") ?? "";
    const city = searchParams.get("city") ?? DEFAULT_FILTERS.city;
    const country = searchParams.get("country") ?? DEFAULT_FILTERS.country;
    const procedure = searchParams.get("procedure") ?? DEFAULT_FILTERS.procedure;
    const showVerifiedOnly = searchParams.get("verified") === "true";
    const page = Number(searchParams.get("page") ?? "1") || 1;

    const priceMinRaw = searchParams.get("price[min]");
    const priceMaxRaw = searchParams.get("price[max]");
    const priceMin = priceMinRaw !== null ? Number(priceMinRaw) : DEFAULT_PRICE_RANGE[0];
    const priceMax = priceMaxRaw !== null ? Number(priceMaxRaw) : DEFAULT_PRICE_RANGE[1];
    const priceRange: [number, number] = [
        isNaN(priceMin) ? DEFAULT_PRICE_RANGE[0] : priceMin,
        isNaN(priceMax) ? DEFAULT_PRICE_RANGE[1] : priceMax,
    ];

    const selectedRatings = parseIntList(searchParams.get("ratings"));
    const selectedScoreRanges = parseStrList(searchParams.get("rdv"));
    const selectedLanguages = parseStrList(searchParams.get("langs"));
    const selectedAvailabilityDate = searchParams.get("date") ?? null;

    // ── URL writer ───────────────────────────────────────────────────────────
    /**
     * Merges patch into current search params and replaces the URL.
     * Pass `null` as a value to delete that key.
     */
    const setParams = useCallback(
        (patch: Record<string, string | null>) => {
            const next = new URLSearchParams(searchParams.toString());
            for (const [key, value] of Object.entries(patch)) {
                if (value === null || value === "") {
                    next.delete(key);
                } else {
                    next.set(key, value);
                }
            }
            // Reset page when any filter changes (unless page itself is being set)
            if (!("page" in patch)) next.delete("page");
            const qs = next.toString();
            startTransition(() => {
                router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
            });
        },
        [searchParams, router, pathname],
    );

    // ── Individual setters ───────────────────────────────────────────────────

    const setQuery = useCallback(
        (value: string, src?: string) => {
            if (searchTimer.current) clearTimeout(searchTimer.current);
            searchTimer.current = setTimeout(() => {
                setParams({ 
                    search: value || null,
                    src: value && src ? src : null
                });
            }, DEBOUNCE_DELAYS.SEARCH);
        },
        [setParams],
    );

    const setPriceRange = useCallback(
        (range: [number, number]) => {
            if (priceTimer.current) clearTimeout(priceTimer.current);
            priceTimer.current = setTimeout(() => {
                setParams({
                    "price[min]": range[0] !== DEFAULT_PRICE_RANGE[0] ? String(range[0]) : null,
                    "price[max]": range[1] !== DEFAULT_PRICE_RANGE[1] ? String(range[1]) : null,
                });
            }, DEBOUNCE_DELAYS.PRICE);
        },
        [setParams],
    );

    const setCity = useCallback(
        (value: string) => setParams({ city: value !== DEFAULT_FILTERS.city ? value : null }),
        [setParams],
    );

    const setCountry = useCallback(
        (value: string) => {
            // Translate full name → ISO2 before storing in URL so the backend
            // country column (which stores ISO2 codes like "US") matches correctly.
            const iso2 = nameToIso2(value);
            setParams({
                country: iso2 !== DEFAULT_FILTERS.country ? iso2 : null,
            });
        },
        [setParams, nameToIso2],
    );

    const setProcedure = useCallback(
        (value: string) =>
            setParams({ procedure: value !== DEFAULT_FILTERS.procedure ? value : null }),
        [setParams],
    );

    const setShowVerifiedOnly = useCallback(
        (value: boolean) => setParams({ verified: value ? "true" : null }),
        [setParams],
    );

    const setPage = useCallback(
        (p: number) => {
            const next = new URLSearchParams(searchParams.toString());
            if (p > 1) {
                next.set("page", String(p));
            } else {
                next.delete("page");
            }
            startTransition(() => {
                router.replace(`${pathname}?${next.toString()}`, { scroll: false });
            });
        },
        [searchParams, router, pathname],
    );

    const toggleRating = useCallback(
        (rating: number) => {
            const next = selectedRatings.includes(rating)
                ? selectedRatings.filter((v) => v !== rating)
                : [...selectedRatings, rating];
            setParams({ ratings: next.length ? serializeList(next) : null });
        },
        [selectedRatings, setParams],
    );

    const toggleScore = useCallback(
        (range: string) => {
            const next = selectedScoreRanges.includes(range)
                ? selectedScoreRanges.filter((v) => v !== range)
                : [...selectedScoreRanges, range];
            setParams({ rdv: next.length ? serializeList(next) : null });
        },
        [selectedScoreRanges, setParams],
    );

    const toggleLanguage = useCallback(
        (lang: string) => {
            const next = selectedLanguages.includes(lang)
                ? selectedLanguages.filter((v) => v !== lang)
                : [...selectedLanguages, lang];
            setParams({ langs: next.length ? serializeList(next) : null });
        },
        [selectedLanguages, setParams],
    );

    const setAvailabilityDate = useCallback(
        (value: string | null) => setParams({ date: value }),
        [setParams],
    );

    const resetAll = useCallback(() => {
        startTransition(() => {
            router.replace(pathname, { scroll: false });
        });
    }, [router, pathname]);

    // ── RDV score min (derived from selected ranges) ─────────────────────────
    const rdvScoreMin = useMemo(() => {
        if (selectedScoreRanges.length === 0) return undefined;
        const min = Math.min(
            ...selectedScoreRanges.map((r) => parseInt(r.split("-")[0], 10)),
        );
        return min > 0 ? min : undefined;
    }, [selectedScoreRanges]);

    // ── Server params (passed directly to API) ───────────────────────────────
    const serverParams = useMemo(() => {
        const params: Record<string, any> = { page };
        if (query) params.search = query;
        if (city !== DEFAULT_FILTERS.city) params.city = city;
        if (country !== DEFAULT_FILTERS.country) params.country = country;
        if (procedure !== DEFAULT_FILTERS.procedure) params.procedure = procedure;
        if (showVerifiedOnly) params.verified = "true";
        if (rdvScoreMin !== undefined) params.rdvScoreMin = rdvScoreMin;
        if (selectedRatings.length > 0) params.ratings = selectedRatings.join(",");
        if (selectedLanguages.length > 0) params.languages = selectedLanguages.join(",");
        if (priceRange[0] > DEFAULT_PRICE_RANGE[0] || priceRange[1] < DEFAULT_PRICE_RANGE[1]) {
            params.price = { min: priceRange[0], max: priceRange[1] };
        }
        return params;
    }, [
        page,
        query,
        city,
        country,
        procedure,
        showVerifiedOnly,
        rdvScoreMin,
        selectedRatings,
        selectedLanguages,
        priceRange,
    ]);

    // ── hasActiveFilters ─────────────────────────────────────────────────────
    const hasActiveFilters = useMemo(
        () =>
            query.trim() !== "" ||
            city !== DEFAULT_FILTERS.city ||
            country !== DEFAULT_FILTERS.country ||
            procedure !== DEFAULT_FILTERS.procedure ||
            priceRange[0] !== DEFAULT_PRICE_RANGE[0] ||
            priceRange[1] !== DEFAULT_PRICE_RANGE[1] ||
            showVerifiedOnly ||
            selectedRatings.length > 0 ||
            selectedScoreRanges.length > 0 ||
            selectedLanguages.length > 0 ||
            selectedAvailabilityDate !== null,
        [
            query,
            city,
            country,
            procedure,
            priceRange,
            showVerifiedOnly,
            selectedRatings,
            selectedScoreRanges,
            selectedLanguages,
            selectedAvailabilityDate,
        ],
    );

    // ── Shared props for FilterSidebar / FilterSheet ─────────────────────────
    const sharedFilterProps = {
        procedure,
        onProcedureChange: setProcedure,
        country: iso2ToName(country), // display full name in sidebar
        onCountryChange: setCountry,
        city,
        onCityChange: setCity,
        priceRange,
        onPriceRangeChange: setPriceRange,
        selectedRatings,
        onRatingToggle: toggleRating,
        selectedScoreRanges,
        onScoreToggle: toggleScore,
        selectedLanguages,
        onLanguageToggle: toggleLanguage,
        selectedAvailabilityDate,
        onAvailabilityDateChange: setAvailabilityDate,
        showVerifiedOnly,
        onShowVerifiedOnlyChange: setShowVerifiedOnly,
        onClear: resetAll,
        availableProcedures: procedureOptions,
        // kept for interface compat with FilterSheet
        availableCountries: [] as string[],
        availableCities: [] as string[],
    };

    return {
        // derived values (read from URL)
        query,
        city,
        country,
        procedure,
        priceRange,
        debouncedPrice: priceRange, // no separate debounced copy needed
        showVerifiedOnly,
        selectedRatings,
        selectedScoreRanges,
        selectedLanguages,
        selectedAvailabilityDate,
        page,
        // setters
        setQuery,
        setPage,
        resetAll,
        // computed
        serverParams,
        hasActiveFilters,
        procedureOptions,
        sharedFilterProps,
    };
};