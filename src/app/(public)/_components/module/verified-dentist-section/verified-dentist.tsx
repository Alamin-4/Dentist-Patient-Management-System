"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Sidebar from "./sidebar";
import DentistCard from "./dentist-card";

const DENTISTS = [
  { id: "1", name: "Dr. Sarah Thompson", specialty: "Orthodontist", price: "1,500", rating: 5, image: "https://i.pravatar.cc/150?u=1" },
  { id: "2", name: "Dr. Kevin Brown", specialty: "Orthodontist", price: "1,500", rating: 5, image: "https://i.pravatar.cc/150?u=2" },
  { id: "3", name: "Dr. David Martinez", specialty: "Orthodontist", price: "1,500", rating: 5, image: "https://i.pravatar.cc/150?u=3" },
  { id: "4", name: "Dr. Michael Anderson", specialty: "Orthodontist", price: "1,500", rating: 5, image: "https://i.pravatar.cc/150?u=4" },
];

export default function VerifiedDentists() {
  const [procedure, setProcedure] = useState("Orthodontist");
  const [compareMode, setCompareMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  return (
    <section className="py-20">
      <div className="max-w-360 w-11/12 mx-auto mb-10 text-center lg:text-left">
        <h2 className="text-4xl font-black text-[#10436B]">Verified Dentists</h2>
        <p className="text-gray-400 mt-2 text-lg">Every dentist is trusted. Every review is from a real patient.</p>
      </div>

      <div className="max-w-360 w-11/12 mx-auto border border-[#E9EDEE] rounded-md flex flex-col lg:flex-row">
        <Sidebar active={procedure} onChange={setProcedure} />

        <div className="flex-1 p-6 md:p-10">
          <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
            <p className="text-[#6B7280]">
              Showing 24 dentist for <span className="text-[#10436B] font-bold">"{procedure}"</span>
            </p>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[11px] text-[#10436B] font-bold uppercase leading-none">Compare</p>
                <p className="text-[10px] text-gray-400">up to 3</p>
              </div>
              <button 
                onClick={() => { setCompareMode(!compareMode); setSelectedIds([]); }}
                className={cn(
                  "w-11 h-6 rounded-full transition-all relative flex items-center px-1",
                  compareMode ? "bg-[#10436B]" : "bg-gray-300"
                )}
              >
                <div className={cn("w-4 h-4 bg-white rounded-full transition-all shadow-sm", compareMode ? "translate-x-5" : "translate-x-0")} />
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {DENTISTS.map((doc) => (
              <DentistCard 
                key={doc.id} 
                dentist={doc} 
                isCompareMode={compareMode}
                isSelected={selectedIds.includes(doc.id)}
                onSelect={toggleSelect}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <button className="text-[#10436B] font-bold text-sm hover:underline decoration-2 underline-offset-4">
              View all specialties
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}