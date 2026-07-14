import { env } from "@/config/env";

const API_KEY = env.NEXT_PUBLIC_COUNTRY_API_KEY;
const BASE_URL = "https://api.countrystatecity.in/v1";

export interface CSCCountry {
  id: number;
  name: string;
  iso2: string;
}

export interface CSCCity {
  id: number;
  name: string;
}

const FALLBACK_COUNTRIES: CSCCountry[] = [
  { id: 1, name: "United States", iso2: "US" },
  { id: 2, name: "France", iso2: "FR" },
  { id: 3, name: "Germany", iso2: "DE" },
  { id: 4, name: "Saudi Arabia", iso2: "SA" },
  { id: 5, name: "Spain", iso2: "ES" },
  { id: 6, name: "Turkey", iso2: "TR" },
  { id: 7, name: "Albania", iso2: "AL" },
  { id: 8, name: "Portugal", iso2: "PT" },
  { id: 9, name: "Mexico", iso2: "MX" },
  { id: 10, name: "Costa Rica", iso2: "CR" },
  { id: 11, name: "Colombia", iso2: "CO" },
  { id: 12, name: "Thailand", iso2: "TH" },
  { id: 13, name: "Hungary", iso2: "HU" },
  { id: 14, name: "Poland", iso2: "PL" },
  { id: 15, name: "India", iso2: "IN" },
  { id: 16, name: "Vietnam", iso2: "VN" },
  { id: 17, name: "Philippines", iso2: "PH" },
];

const FALLBACK_CITIES: Record<string, CSCCity[]> = {
  US: [
    { id: 101, name: "New York" },
    { id: 102, name: "Los Angeles" },
    { id: 103, name: "Chicago" },
    { id: 104, name: "Houston" },
    { id: 105, name: "Phoenix" },
  ],
  FR: [
    { id: 201, name: "Paris" },
    { id: 202, name: "Marseille" },
    { id: 203, name: "Lyon" },
    { id: 204, name: "Toulouse" },
    { id: 205, name: "Nice" },
  ],
  DE: [
    { id: 301, name: "Berlin" },
    { id: 302, name: "Hamburg" },
    { id: 303, name: "Munich" },
    { id: 304, name: "Cologne" },
    { id: 305, name: "Frankfurt" },
  ],
  SA: [
    { id: 401, name: "Riyadh" },
    { id: 402, name: "Jeddah" },
    { id: 403, name: "Mecca" },
    { id: 404, name: "Medina" },
    { id: 405, name: "Dammam" },
  ],
  ES: [
    { id: 501, name: "Madrid" },
    { id: 502, name: "Barcelona" },
    { id: 503, name: "Valencia" },
    { id: 504, name: "Seville" },
    { id: 505, name: "Zaragoza" },
  ],
  TR: [
    { id: 601, name: "Istanbul" },
    { id: 602, name: "Ankara" },
    { id: 603, name: "Izmir" },
    { id: 604, name: "Bursa" },
    { id: 605, name: "Antalya" },
  ],
  AL: [
    { id: 701, name: "Tirana" },
    { id: 702, name: "Durrës" },
    { id: 703, name: "Vlorë" },
    { id: 704, name: "Shkodër" },
    { id: 705, name: "Elbasan" },
  ],
  PT: [
    { id: 801, name: "Lisbon" },
    { id: 802, name: "Porto" },
    { id: 803, name: "Amadora" },
    { id: 804, name: "Braga" },
    { id: 805, name: "Setúbal" },
  ],
  MX: [
    { id: 901, name: "Mexico City" },
    { id: 902, name: "Cancun" },
    { id: 903, name: "Guadalajara" },
    { id: 904, name: "Monterrey" },
    { id: 905, name: "Tijuana" },
  ],
  CR: [
    { id: 1001, name: "San Jose" },
    { id: 1002, name: "Alajuela" },
  ],
  CO: [
    { id: 1101, name: "Bogota" },
    { id: 1102, name: "Medellin" },
    { id: 1103, name: "Cali" },
  ],
  TH: [
    { id: 1201, name: "Bangkok" },
    { id: 1202, name: "Phuket" },
    { id: 1203, name: "Chiang Mai" },
  ],
  HU: [
    { id: 1301, name: "Budapest" },
    { id: 1302, name: "Debrecen" },
  ],
  PL: [
    { id: 1401, name: "Warsaw" },
    { id: 1402, name: "Krakow" },
  ],
  IN: [
    { id: 1501, name: "Mumbai" },
    { id: 1502, name: "Delhi" },
    { id: 1503, name: "Bangalore" },
  ],
  VN: [
    { id: 1601, name: "Ho Chi Minh City" },
    { id: 1602, name: "Hanoi" },
  ],
  PH: [
    { id: 1701, name: "Manila" },
    { id: 1702, name: "Quezon City" },
  ],
};

/**
 * Fetches all countries from CSC API and caches them in localStorage.
 */
export async function getCountries(): Promise<CSCCountry[]> {
  if (typeof window === "undefined") return FALLBACK_COUNTRIES;

  const cached = localStorage.getItem("csc_countries");
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      // Ignore parse error
    }
  }

  try {
    const res = await fetch(`${BASE_URL}/countries`, {
      headers: {
        "X-CSCAPI-KEY": API_KEY,
      },
    });
    if (!res.ok) {
      console.warn("Countries API not accessible, returning fallback list");
      return FALLBACK_COUNTRIES;
    }
    const data: CSCCountry[] = await res.json();
    
    // Cache the result
    localStorage.setItem("csc_countries", JSON.stringify(data));
    return data;
  } catch (error) {
    console.warn("Error calling Country API, returning fallback list");
    return FALLBACK_COUNTRIES;
  }
}

/**
 * Fetches cities of a specific country by its ISO2 code and caches them.
 */
export async function getCities(countryIso2: string): Promise<CSCCity[]> {
  if (!countryIso2) return [];
  if (typeof window === "undefined") return FALLBACK_CITIES[countryIso2] || [];

  const cacheKey = `csc_cities_${countryIso2}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      // Ignore parse error
    }
  }

  try {
    const res = await fetch(`${BASE_URL}/countries/${countryIso2}/cities`, {
      headers: {
        "X-CSCAPI-KEY": API_KEY,
      },
    });
    if (!res.ok) {
      console.warn(`Cities API not accessible for ${countryIso2}, returning fallback list`);
      return FALLBACK_CITIES[countryIso2] || [];
    }
    const data: CSCCity[] = await res.json();

    // Cache the result
    localStorage.setItem(cacheKey, JSON.stringify(data));
    return data;
  } catch (error) {
    console.warn(`Error calling Cities API for ${countryIso2}, returning fallback list`);
    return FALLBACK_CITIES[countryIso2] || [];
  }
}
