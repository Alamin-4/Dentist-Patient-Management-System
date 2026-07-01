// modules/find-dentist/constants.ts

export const PAGE_SIZE = 20;

export const DEFAULT_PRICE_RANGE: [number, number] = [0, 1800];
export const MAX_PRICE = 1800;

export const DEBOUNCE_DELAYS = {
    SEARCH: 400,
    PRICE: 600,
} as const;

export const DEFAULT_FILTERS = {
    city: "All Cities",
    country: "All Countries",
    procedure: "All Procedures",
    priceRange: DEFAULT_PRICE_RANGE,
    showVerifiedOnly: false,
    selectedRatings: [] as number[],
    selectedScoreRanges: [] as string[],
    selectedLanguages: [] as string[],
    selectedAvailabilityDate: null as string | null,
} as const;