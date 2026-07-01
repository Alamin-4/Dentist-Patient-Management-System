// modules/find-dentist/hooks/use-dentist-filters.ts

import { useState, useMemo, useEffect } from "react";
import { DEFAULT_FILTERS, DEFAULT_PRICE_RANGE, DEBOUNCE_DELAYS } from "./constants";
import { cityOptions, countryOptions, procedureOptions } from "../DentistAllComponents/types"; // ✅ Import করুন

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
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [city, setCity] = useState<string>(DEFAULT_FILTERS.city);
    const [country, setCountry] = useState<string>(DEFAULT_FILTERS.country);
    const [procedure, setProcedure] = useState<string>(DEFAULT_FILTERS.procedure);
    const [priceRange, setPriceRange] = useState<[number, number]>(DEFAULT_PRICE_RANGE);
    const [debouncedPrice, setDebouncedPrice] = useState<[number, number]>(DEFAULT_PRICE_RANGE);
    const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
    const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
    const [selectedScoreRanges, setSelectedScoreRanges] = useState<string[]>([]);
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
    const [selectedAvailabilityDate, setSelectedAvailabilityDate] = useState<string | null>(null);
    const [page, setPage] = useState(1);

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
        if (debouncedPrice[0] > 0 || debouncedPrice[1] < DEFAULT_PRICE_RANGE[1]) {
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