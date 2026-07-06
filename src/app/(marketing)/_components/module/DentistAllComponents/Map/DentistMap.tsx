"use client";

import { useEffect, useMemo } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import MapDentistCard from "./MapDentistCard";
import type { Dentist } from "../types";

type DentistMapProps = {
  dentists: Dentist[];
  activeDentistId: string | null;
  onMarkerClick: (dentist: Dentist) => void;
  onCloseCard: () => void;
};

function RecenterMap({ coords }: { coords: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(coords, 13);
  }, [coords, map]);

  return null;
}

function CenterMapOnList({ dentists }: { dentists: Dentist[] }) {
  const map = useMap();

  useEffect(() => {
    const validCoords = dentists
      .filter((d) => d.coords)
      .map((d) => L.latLng(d.coords!.lat, d.coords!.lng));

    if (validCoords.length > 0) {
      const bounds = L.latLngBounds(validCoords);
      map.fitBounds(bounds, { maxZoom: 13, padding: [50, 50] });
    }
  }, [dentists, map]);

  return null;
}

export default function DentistMap({
  dentists,
  activeDentistId,
  onMarkerClick,
  onCloseCard,
}: DentistMapProps) {
  const defaultPosition: [number, number] = [19.4326, -99.1332];
  const activeDentist = dentists.find((d) => d.id === activeDentistId);

  const customIcon = useMemo(() => {
    return new L.Icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });
  }, []);

  const totalDentists = dentists.length;
  const dentistsWithCoords = dentists.filter((d) => d.coords).length;
  const missingCoordsCount = totalDentists - dentistsWithCoords;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg border border-slate-200 bg-[#f8fafc] shadow">
      {missingCoordsCount > 0 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-1000 bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3 py-2 rounded-md shadow-md flex items-center gap-1.5 font-medium whitespace-nowrap">
          <span>⚠️</span>
          <span>
            {missingCoordsCount} dentist{missingCoordsCount > 1 ? "s" : ""} missing coordinates; not shown on map
          </span>
        </div>
      )}
      <MapContainer
        center={defaultPosition}
        zoom={13}
        scrollWheelZoom
        className="z-10 h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <CenterMapOnList dentists={dentists} />

        {dentists.filter((d) => d.coords).map((dentist) => (
          <Marker
            key={dentist.id}
            position={[dentist.coords!.lat, dentist.coords!.lng]}
            icon={customIcon}
            eventHandlers={{
              click: () => onMarkerClick(dentist),
            }}
          >
            <Popup minWidth={280} maxWidth={380} className="custom-popup">
              <div className="bg-transparent p-0">
                <MapDentistCard
                  dentist={dentist}
                  onConsult={onCloseCard}
                  onViewProfile={onCloseCard}
                />
              </div>
            </Popup>
          </Marker>
        ))}

        {activeDentist?.coords && (
          <RecenterMap
            coords={[activeDentist.coords.lat, activeDentist.coords.lng]}
          />
        )}
      </MapContainer>
    </div>
  );
}
