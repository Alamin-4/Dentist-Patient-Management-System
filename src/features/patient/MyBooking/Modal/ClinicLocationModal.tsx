"use client";

import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ClinicLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
  lat: number;
  lng: number;
}

export default function ClinicLocationModal({
  isOpen,
  onClose,
  address,
  lat,
  lng,
}: ClinicLocationModalProps) {
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.08}%2C${lat - 0.04}%2C${lng + 0.08}%2C${lat + 0.04}&layer=mapnik&marker=${lat}%2C${lng}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/30"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.18 }}
            className="relative bg-white rounded-lg p-6 w-full max-w-[520px] shadow-2xl z-10"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <h2 className="text-xl font-bold text-[#1A1A2E]">Clinic Location</h2>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-slate-100 rounded-full transition-colors text-slate-500 cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Address */}
            <p className="text-sm text-[#475569] mb-4">{address}</p>

            {/* Map */}
            <div className="w-full h-64 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
              <iframe
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                title="Clinic location map"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
