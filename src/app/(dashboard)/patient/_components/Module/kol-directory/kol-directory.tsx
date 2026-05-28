"use client";

import toast from "react-hot-toast";
import patientKolData, { type PatientKol } from "@/lib/patient-kol-data";
import { KolHeroBanner } from "./kol-hero-banner";
import { KolCard } from "./kol-card";

export default function KOLDirectory() {
  const handleAsk = (kol: PatientKol) => {
    toast.success(`Your question will be sent to ${kol.name}.`);
  };

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Page heading */}
      <h1 className="text-2xl font-bold tracking-tight text-[#1A1A2E]">
        KOL Directory
      </h1>

      {/* Hero banner */}
      <KolHeroBanner />

      {/* KOL grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {patientKolData.map((kol) => (
          <KolCard key={kol.id} kol={kol} onAsk={handleAsk} />
        ))}
      </div>
    </div>
  );
}
