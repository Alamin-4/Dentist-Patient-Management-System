"use client";

import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { Search, MapPin, X, Loader2, Navigation, Check } from "lucide-react";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default marker icon issues in Next.js
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (location: { address: string; lat: string; lng: string }) => void;
  initialLocation?: { address: string; lat: string; lng: string } | null;
}

function MapEventsHandler({
  center,
  onMapMoveStart,
  onMapMoveEnd,
}: {
  center: [number, number] | null;
  onMapMoveStart: () => void;
  onMapMoveEnd: (lat: number, lng: number) => void;
}) {
  const map = useMap();

  // Handle center changes from external search/geolocation
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom() || 15);
    }
  }, [center, map]);

  useMapEvents({
    movestart() {
      onMapMoveStart();
    },
    dragstart() {
      onMapMoveStart();
    },
    moveend() {
      const c = map.getCenter();
      onMapMoveEnd(c.lat, c.lng);
    },
  });

  return null;
}

export default function MapPickerModal({
  isOpen,
  onClose,
  onConfirm,
  initialLocation,
}: MapPickerModalProps) {
  const defaultCenter: [number, number] = [40.7128, -74.006]; // New York default
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(defaultCenter);
  const [address, setAddress] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isMapMoving, setIsMapMoving] = useState(false);
  const [searchError, setSearchError] = useState("");

  const hasInitialized = useRef(false);
  const clickTimeout = useRef<NodeJS.Timeout | null>(null);

  // Initialize position and map center from initialLocation
  useEffect(() => {
    if (isOpen && !hasInitialized.current) {
      if (initialLocation && initialLocation.lat && initialLocation.lng) {
        const lat = parseFloat(initialLocation.lat);
        const lng = parseFloat(initialLocation.lng);
        if (!isNaN(lat) && !isNaN(lng)) {
          setPosition([lat, lng]);
          setMapCenter([lat, lng]);
          setAddress(initialLocation.address || "");
          hasInitialized.current = true;
          return;
        }
      }

      // Fallback: try user geolocation
      detectUserLocation();
      hasInitialized.current = true;
    }
  }, [isOpen, initialLocation]);

  // Reset initialization ref when modal closes
  useEffect(() => {
    if (!isOpen) {
      hasInitialized.current = false;
      setSearchResults([]);
      setShowSuggestions(false);
      setSearchError("");
    }
  }, [isOpen]);

  const detectUserLocation = () => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
          setMapCenter([latitude, longitude]);
          setIsLocating(false);
          const addr = await reverseGeocode(latitude, longitude);
          setAddress(addr);
        },
        () => {
          setIsLocating(false);
          // Keep default center if geolocation fails or is denied
        },
        { enableHighAccuracy: true, timeout: 5000 },
      );
    }
  };

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
        {
          headers: {
            "Accept-Language": "en",
          },
        },
      );
      const data = await response.json();
      return data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    }
  };

  const handleMapMoveStart = () => {
    setIsMapMoving(true);
  };

  const handleMapMoveEnd = async (lat: number, lng: number) => {
    setIsMapMoving(false);
    setPosition([lat, lng]);

    // Debounce/delay geocoding slightly to avoid hitting Nominatim rate limits while dragging
    if (clickTimeout.current) clearTimeout(clickTimeout.current);
    clickTimeout.current = setTimeout(async () => {
      const addr = await reverseGeocode(lat, lng);
      setAddress(addr);
    }, 400);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchError("");
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
          searchQuery,
        )}&limit=5`,
        {
          headers: {
            "Accept-Language": "en",
          },
        },
      );
      const data = await response.json();
      if (data && data.length > 0) {
        setSearchResults(data);
        setShowSuggestions(true);
      } else {
        setSearchError("No locations found. Try a different search.");
        setSearchResults([]);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error("Geocoding search error:", error);
      setSearchError("Failed to search location. Please try again.");
      setShowSuggestions(true);
    } finally {
      setIsSearching(false);
    }
  };

  const selectSuggestion = (item: any) => {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);
    if (!isNaN(lat) && !isNaN(lng)) {
      setPosition([lat, lng]);
      setMapCenter([lat, lng]);
      setAddress(item.display_name);
      setSearchQuery(item.display_name);
      setShowSuggestions(false);
    }
  };

  const handleConfirm = () => {
    if (!position) return;
    onConfirm({
      address:
        address || `${position[0].toFixed(5)}, ${position[1].toFixed(5)}`,
      lat: position[0].toString(),
      lng: position[1].toString(),
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full sm:max-w-3xl h-[92vh] sm:h-[80vh] max-h-[850px] bg-white rounded-t-3xl sm:rounded-2xl border border-slate-100 shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-300">
        {/* Drag handle for mobile bottom sheet */}
        <div className="flex justify-center py-2.5 sm:hidden">
          <div className="w-12 h-1 bg-slate-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 pb-4 pt-1 sm:py-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-extrabold text-[#0A2533]">
              Select Clinic Location
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Drag map under pin or search to select location.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search Bar & Auto-suggestions */}
        <div className="px-5 sm:px-6 py-3.5 bg-slate-50 border-b border-slate-100 relative z-40">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (showSuggestions) setShowSuggestions(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
                placeholder="Search for address, city, or clinic..."
                className="w-full pl-10 pr-20 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E3E65] focus:border-transparent transition-all"
              />
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />

              <div className="absolute right-2 top-1.5 flex items-center gap-1.5">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSearchResults([]);
                      setShowSuggestions(false);
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="px-3.5 py-1.5 bg-[#0E3E65] hover:bg-[#082842] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50"
                >
                  {isSearching ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    "Search"
                  )}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={detectUserLocation}
              disabled={isLocating}
              className="p-2.5 bg-white border border-slate-200 rounded-xl text-gray-600 hover:text-[#0E3E65] hover:bg-slate-100 transition-all flex items-center justify-center shrink-0 disabled:opacity-50"
              title="Use current location"
            >
              {isLocating ? (
                <Loader2 className="h-4 w-4 animate-spin text-[#0E3E65]" />
              ) : (
                <Navigation className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Suggestions Dropdown Overlay */}
          {showSuggestions && (
            <div className="absolute left-5 right-5 sm:left-6 sm:right-6 mt-1.5 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150">
              {searchError ? (
                <div className="p-4 text-center text-sm text-gray-500">
                  {searchError}
                </div>
              ) : (
                searchResults.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => selectSuggestion(item)}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-slate-50 border-b border-slate-50 last:border-b-0 flex gap-3 items-start transition-colors"
                  >
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-800 line-clamp-1">
                        {item.name || item.display_name.split(",")[0]}
                      </p>
                      <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
                        {item.display_name}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Map Container Area with Interactive Center Pin Overlay */}
        <div className="flex-1 relative bg-slate-100 z-10 overflow-hidden">
          <MapContainer
            center={mapCenter}
            zoom={15}
            scrollWheelZoom
            className="h-full w-full z-10"
            zoomControl={false} // Disable default top-left controls for custom positioning
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapEventsHandler
              center={mapCenter}
              onMapMoveStart={handleMapMoveStart}
              onMapMoveEnd={handleMapMoveEnd}
            />
          </MapContainer>

          {/* Interactive Bouncing Center Pin */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="flex flex-col items-center">
              <div
                className={`transition-all duration-300 ease-out transform ${
                  isMapMoving
                    ? "-translate-y-4 scale-105"
                    : "translate-y-0 scale-100"
                }`}
              >
                {/* Custom modern map pin SVG */}
                <svg
                  width="46"
                  height="46"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="filter drop-shadow-[0_8px_8px_rgba(14,62,101,0.25)]"
                >
                  <path
                    d="M12 2C7.58 2 4 5.58 4 10C4 15.25 12 22 12 22C12 22 20 15.25 20 10C20 5.58 16.42 2 12 2Z"
                    fill="#0E3E65"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="10" r="3.5" fill="#ffffff" />
                </svg>
              </div>
              {/* Animated pin shadow */}
              <div
                className={`w-3.5 h-1 bg-slate-950/20 rounded-full blur-[1px] transition-all duration-300 ${
                  isMapMoving
                    ? "scale-50 opacity-40 blur-[2px]"
                    : "scale-100 opacity-100"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Footer Area with Selected Details & Actions */}
        <div className="px-5 sm:px-6 py-4.5 border-t border-slate-100 bg-white flex flex-col gap-4 relative z-30">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-slate-50 text-[#0E3E65] rounded-xl shrink-0 mt-0.5">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">
                Selected Location Address
              </p>
              <p className="text-sm font-bold text-gray-900 line-clamp-2 mt-0.5 leading-relaxed">
                {address || "Locating your clinic..."}
              </p>
              {position && (
                <p className="text-[10px] font-mono text-slate-400 mt-1">
                  Lat: {position[0].toFixed(6)} | Lng: {position[1].toFixed(6)}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3 w-full shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-5 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-gray-700 text-sm font-bold rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!position || isMapMoving}
              className="flex-1 px-6 py-3 bg-[#0E3E65] hover:bg-[#082842] disabled:bg-slate-100 disabled:text-slate-400 text-white text-sm font-bold rounded-xl transition-all disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center gap-1.5"
            >
              <Check className="h-4 w-4" />
              Confirm Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
