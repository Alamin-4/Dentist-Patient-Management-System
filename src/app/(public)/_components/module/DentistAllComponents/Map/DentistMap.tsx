"use client";

import { useEffect } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import DentistCard from "../DentistCard";
import type { Dentist } from "../types";

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

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

export default function DentistMap({
  dentists,
  activeDentistId,
  onMarkerClick,
  onCloseCard,
}: DentistMapProps) {
  const defaultPosition: [number, number] = [19.4326, -99.1332];
  const activeDentist = dentists.find((d) => d.id === activeDentistId);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[32px] border border-slate-200 bg-[#f8fafc] shadow-xl">
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

        {dentists.map((dentist) => (
          <Marker
            key={dentist.id}
            position={[dentist.coords.lat, dentist.coords.lng]}
            icon={customIcon}
            eventHandlers={{
              click: () => onMarkerClick(dentist),
            }}
          >
            <Popup minWidth={280} className="custom-popup">
              <div className="bg-transparent p-0">
                <DentistCard
                  dentist={dentist}
                  floating
                  viewMode="map"
                  onPrimaryAction={onCloseCard}
                />
              </div>
            </Popup>
          </Marker>
        ))}

        {activeDentist && (
          <RecenterMap
            coords={[activeDentist.coords.lat, activeDentist.coords.lng]}
          />
        )}
      </MapContainer>
    </div>
  );
}
