import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { DEFAULT_FILTERS, DEFAULT_PRICE_RANGE, DEBOUNCE_DELAYS } from "./constants";
import { cityOptions, countryOptions } from "../DentistAllComponents/types"; // ✅ Import করুন
import { useGlobalProcedures } from "@/hooks/procedures/useProcedures";

export interface FilterState {
    query: string;
    city: string;
    country: string;
    procedure: string;
    priceRange: [number, number];
    showVerifiedOnly: boolean;
    selectedRatings: number[];
    selectedScoreRanges: string[];
    selectedLanguages: string[];
    selectedAvailabilityDate: string | null;
}

export const useDentistFilters = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const { data: globalProcedures } = useGlobalProcedures();

    const procedureOptions = useMemo(() => {
        if (!globalProcedures) return ["All Procedures"];
        const list = Array.isArray(globalProcedures) ? globalProcedures : (globalProcedures as any).data || [];
        const names = list.map((p: any) => p.name).filter((name: string) => !!name);
        return ["All Procedures", ...names];
    }, [globalProcedures]);

    // Read initial values from URL search params
    const initialQuery = searchParams.get("search") || "";
    const initialCity = searchParams.get("city") || DEFAULT_FILTERS.city;
    const initialCountry = searchParams.get("country") || DEFAULT_FILTERS.country;
    const initialProcedure = searchParams.get("procedure") || DEFAULT_FILTERS.procedure;
    
    const initialMinPrice = searchParams.get("price[min]") 
        ? Number(searchParams.get("price[min]")) 
        : DEFAULT_PRICE_RANGE[0];
    const initialMaxPrice = searchParams.get("price[max]") 
        ? Number(searchParams.get("price[max]")) 
        : DEFAULT_PRICE_RANGE[1];
        
    const initialVerified = searchParams.get("verified") === "true";
    const initialPage = searchParams.get("page") ? Number(searchParams.get("page")) : 1;

    const [query, setQuery] = useState(initialQuery);
    const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
    const [city, setCity] = useState<string>(initialCity);
    const [country, setCountry] = useState<string>(initialCountry);
    const [procedure, setProcedure] = useState<string>(initialProcedure);
    const [priceRange, setPriceRange] = useState<[number, number]>([initialMinPrice, initialMaxPrice]);
    const [debouncedPrice, setDebouncedPrice] = useState<[number, number]>([initialMinPrice, initialMaxPrice]);
    const [showVerifiedOnly, setShowVerifiedOnly] = useState(initialVerified);
    const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
    const [selectedScoreRanges, setSelectedScoreRanges] = useState<string[]>([]);
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
    const [selectedAvailabilityDate, setSelectedAvailabilityDate] = useState<string | null>(null);
    const [page, setPage] = useState(initialPage);

    // Sync from URL search params back to state (for external changes, e.g. navbar search)
    useEffect(() => {
        const urlSearch = searchParams.get("search") || "";
        const urlCity = searchParams.get("city") || DEFAULT_FILTERS.city;
        const urlCountry = searchParams.get("country") || DEFAULT_FILTERS.country;
        const urlProcedure = searchParams.get("procedure") || DEFAULT_FILTERS.procedure;
        const urlMinPrice = searchParams.get("price[min]") ? Number(searchParams.get("price[min]")) : DEFAULT_PRICE_RANGE[0];
        const urlMaxPrice = searchParams.get("price[max]") ? Number(searchParams.get("price[max]")) : DEFAULT_PRICE_RANGE[1];
        const urlVerified = searchParams.get("verified") === "true";
        const urlPage = searchParams.get("page") ? Number(searchParams.get("page")) : 1;

        if (urlSearch !== query) {
            setQuery(urlSearch);
            setDebouncedQuery(urlSearch);
        }
        if (urlCity !== city) setCity(urlCity);
        if (urlCountry !== country) setCountry(urlCountry);
        if (urlProcedure !== procedure) setProcedure(urlProcedure);
        if (urlMinPrice !== priceRange[0] || urlMaxPrice !== priceRange[1]) {
            setPriceRange([urlMinPrice, urlMaxPrice]);
            setDebouncedPrice([urlMinPrice, urlMaxPrice]);
        }
        if (urlVerified !== showVerifiedOnly) setShowVerifiedOnly(urlVerified);
        if (urlPage !== page) setPage(urlPage);
    }, [searchParams]);

    // Sync state changes to URL search params
    useEffect(() => {
        const params = new URLSearchParams();
        if (debouncedQuery) params.set("search", debouncedQuery);
        if (city !== DEFAULT_FILTERS.city) params.set("city", city);
        if (country !== DEFAULT_FILTERS.country) params.set("country", country);
        if (procedure !== DEFAULT_FILTERS.procedure) params.set("procedure", procedure);
        if (priceRange[0] > DEFAULT_PRICE_RANGE[0] || priceRange[1] < DEFAULT_PRICE_RANGE[1]) {
            params.set("price[min]", priceRange[0].toString());
            params.set("price[max]", priceRange[1].toString());
        }
        if (showVerifiedOnly) params.set("verified", "true");
        if (page > 1) params.set("page", page.toString());

        const queryStr = params.toString();
        const nextUrl = queryStr ? `${pathname}?${queryStr}` : pathname;
        
        router.replace(nextUrl, { scroll: false });
    }, [debouncedQuery, city, country, procedure, priceRange, showVerifiedOnly, page, router, pathname]);

    // Debounce search query
    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedQuery(query);
            setPage(1);
        }, DEBOUNCE_DELAYS.SEARCH);
        return () => clearTimeout(t);
    }, [query]);

    // Debounce price slider
    useEffect(() => {
        const t = setTimeout(() => setDebouncedPrice(priceRange), DEBOUNCE_DELAYS.PRICE);
        return () => clearTimeout(t);
    }, [priceRange]);

    // Reset page on filter change
    useEffect(() => {
        setPage(1);
    }, [city, country, procedure, showVerifiedOnly, selectedScoreRanges, selectedRatings]);

    // Derived numeric params
    const rdvScoreMin = useMemo(() => {
        if (selectedScoreRanges.length === 0) return undefined;
        const min = Math.min(...selectedScoreRanges.map((r) => parseInt(r.split("-")[0], 10)));
        return min > 0 ? min : undefined;
    }, [selectedScoreRanges]);

    const ratingMin = useMemo(
        () => (selectedRatings.length > 0 ? Math.min(...selectedRatings) : undefined),
        [selectedRatings],
    );

    // Build API params
    const serverParams = useMemo(() => {
        const params: Record<string, any> = { page };
        if (debouncedQuery) params.search = debouncedQuery;
        if (city !== DEFAULT_FILTERS.city) params.city = city;
        if (country !== DEFAULT_FILTERS.country) params.country = country;
        if (procedure !== DEFAULT_FILTERS.procedure) params.procedure = procedure;
        if (debouncedPrice[0] > DEFAULT_PRICE_RANGE[0] || debouncedPrice[1] < DEFAULT_PRICE_RANGE[1]) {
            params["price[min]"] = debouncedPrice[0];
            params["price[max]"] = debouncedPrice[1];
        }
        if (showVerifiedOnly) params.verified = "true";
        if (rdvScoreMin !== undefined) params.rdvScoreMin = rdvScoreMin;
        if (ratingMin !== undefined) params.ratingMin = ratingMin;
        return params;
    }, [page, debouncedQuery, city, country, procedure, debouncedPrice, showVerifiedOnly, rdvScoreMin, ratingMin]);

    // Toggle helpers
    const toggleRating = (rating: number) =>
        setSelectedRatings((prev) =>
            prev.includes(rating) ? prev.filter((v) => v !== rating) : [...prev, rating],
        );

    const toggleScore = (range: string) =>
        setSelectedScoreRanges((prev) =>
            prev.includes(range) ? prev.filter((v) => v !== range) : [...prev, range],
        );

    const toggleLanguage = (lang: string) =>
        setSelectedLanguages((prev) =>
            prev.includes(lang) ? prev.filter((v) => v !== lang) : [...prev, lang],
        );

    const resetAll = () => {
        setQuery("");
        setDebouncedQuery("");
        setCountry(DEFAULT_FILTERS.country);
        setCity(DEFAULT_FILTERS.city);
        setProcedure(DEFAULT_FILTERS.procedure);
        setPriceRange(DEFAULT_PRICE_RANGE);
        setDebouncedPrice(DEFAULT_PRICE_RANGE);
        setSelectedRatings([]);
        setSelectedScoreRanges([]);
        setSelectedLanguages([]);
        setSelectedAvailabilityDate(null);
        setShowVerifiedOnly(false);
        setPage(1);
        
        router.replace(pathname, { scroll: false });
    };

    // ✅ Shared props for filter components - এখানে available options যোগ করুন
    const sharedFilterProps = {
        procedure,
        onProcedureChange: (v: string) => setProcedure(v),
        country,
        onCountryChange: (v: string) => setCountry(v),
        city,
        onCityChange: (v: string) => setCity(v),
        priceRange,
        onPriceRangeChange: setPriceRange,
        selectedRatings,
        onRatingToggle: toggleRating,
        selectedScoreRanges,
        onScoreToggle: toggleScore,
        selectedLanguages,
        onLanguageToggle: toggleLanguage,
        selectedAvailabilityDate,
        onAvailabilityDateChange: setSelectedAvailabilityDate,
        showVerifiedOnly,
        onShowVerifiedOnlyChange: setShowVerifiedOnly,
        onClear: resetAll,
        // ✅ এই তিনটা যোগ করুন
        availableProcedures: procedureOptions,
        availableCountries: countryOptions,
        availableCities: cityOptions,
    };

    return {
        // State
        query,
        setQuery,
        debouncedQuery,
        city,
        country,
        procedure,
        priceRange,
        debouncedPrice,
        showVerifiedOnly,
        selectedLanguages,
        page,
        setPage,
        // API
        serverParams,
        // Helpers
        resetAll,
        sharedFilterProps,
    };
};