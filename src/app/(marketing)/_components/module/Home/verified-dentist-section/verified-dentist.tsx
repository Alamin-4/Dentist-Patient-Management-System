"use client";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import Sidebar from "./sidebar";
import DentistCard from "./dentist-card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useStateContext } from "@/providers/StateProvider";
import Link from "next/link";
import { useMe } from "@/hooks/auth/useAuth";
import { useDentistDirectory } from "@/hooks/dentist/useDentistDirectory";

const SkeletonCard = () => (
  <div className="rounded-md p-4 sm:p-6 flex flex-col items-start gap-4 border-2 border-slate-100 bg-white animate-pulse">
    <div className="flex flex-row items-start gap-4 w-full justify-between">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-200 shrink-0" />
      <div className="flex-1 space-y-2.5 py-1 min-w-0">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-200 rounded w-1/2" />
        <div className="h-3 bg-slate-200 rounded w-1/4" />
      </div>
      <div className="h-4 bg-slate-200 rounded w-16 shrink-0" />
    </div>
  </div>
);

export default function VerifiedDentists() {
  const [procedure, setProcedure] = useState("");
  const [compareMode, setCompareMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const {
    setShowSignupModal,
    setShowPersonalizeModal,
    setDentistsToCompare,
    setShowCompareModal,
    searchQuery,
  } = useStateContext();

  const { user } = useMe();

  const { data: directoryResponse, isLoading } = useDentistDirectory({
    search: searchQuery || undefined,
    specialty: procedure !== "All Procedures" ? procedure : undefined,
    limit: 6,
  });

  const dentists = useMemo(() => {
    const apiList = directoryResponse?.data || [];
    return apiList.map((d: any) => ({
      id: d.id,
      name: d.name,
      slug: d.slug,
      specialty: d.specialty,
      rating: d.googleRating,
      reviewCount: d.googleReviewCount,
      image: d.image,
      location: d.fullAddress,
      city: d.city,
      country: d.country,
      price: d.price,
      rdvScore: d.rdvScore,
      verified: d.status,
      status: d.status,
      isClaimable: d.isClaimable,
      procedures: d.procedures,
      languages: d.languages,
      experience: d.experience,
    }));
  }, [directoryResponse]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : prev.length < 3
          ? [...prev, id]
          : prev,
    );
  };

  const removeSelectedDentist = (id: string) => {
    setSelectedIds((prev) => prev.filter((i) => i !== id));
  };

  const selectedDentists = useMemo(() => {
    return dentists.filter((doc: any) => selectedIds.includes(doc.id));
  }, [dentists, selectedIds]);



  return (
    <section className="py-20">
      <div className="max-w-400 w-11/12 mx-auto mb-10 text-center lg:text-left">
        <h2 className="text-4xl font-black text-[#10436B]">
          Verified Dentists
        </h2>
        <p className="text-gray-400 mt-2 text-lg">
          Every dentist is trusted. Every review is from a real patient.
        </p>
      </div>

      <div className="max-w-400 w-11/12 mx-auto border border-[#E9EDEE] rounded-md flex flex-col lg:flex-row">
        <Sidebar active={procedure} onChange={setProcedure} />

        <div className="flex-1 p-6 md:p-10">
          <header className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <p className="text-[#6B7280]">
              Showing {isLoading ? "..." : dentists.length} dentist{dentists.length !== 1 && "s"} for{" "}
              <span className="text-[#10436B] font-bold">"{procedure}"</span>
            </p>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[11px] text-[#10436B] font-bold uppercase leading-none">
                  Compare
                </p>
                <p className="text-[10px] text-gray-400">up to 3</p>
              </div>
              <button
                onClick={() => {
                  setCompareMode(!compareMode);
                  setSelectedIds([]);
                }}
                className={cn(
                  "w-11 h-6 rounded-full transition-all relative flex items-center px-1",
                  compareMode ? "bg-[#10436B]" : "bg-gray-300",
                )}
              >
                <div
                  className={cn(
                    "w-4 h-4 bg-white rounded-full transition-all shadow-sm",
                    compareMode ? "translate-x-5" : "translate-x-0",
                  )}
                />
              </button>
            </div>
          </header>

          {selectedDentists.length > 0 && (
            <div className="w-full mb-6 flex flex-row gap-4 items-center justify-center bg-slate-50 p-4 rounded-lg border border-slate-100">
              <div className="flex flex-row gap-2 items-center justify-center">
                {selectedDentists.map((dentist: any, i: number) => (
                  <div key={dentist.id} className="relative group">
                    <span
                      onClick={() => removeSelectedDentist(dentist.id)}
                      className="absolute -top-1.5 -right-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-full p-0.5 cursor-pointer shadow-sm z-10 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </span>
                    <img
                      src={dentist.image}
                      alt={`Selected Dentist ${i + 1}`}
                      className="rounded-full w-12 h-12 object-cover border-2 border-white shadow-sm"
                    />
                  </div>
                ))}
              </div>
              <div>
                <Button
                  onClick={() => {
                    setDentistsToCompare(selectedDentists);
                    if (user) {
                      const hasProfileDetails = !!(user?.firstName || user?.name || user?.first_name);
                      if (hasProfileDetails) {
                        setShowCompareModal(true);
                      } else {
                        setShowPersonalizeModal(true);
                      }
                    } else {
                      setShowSignupModal(true);
                    }
                  }}
                  className="bg-[#0E3E65] hover:bg-[#092b47] text-white h-11 px-6 rounded-lg cursor-pointer font-bold transition-colors"
                >
                  Compare
                </Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            ) : dentists.length === 0 ? (
              <div className="col-span-2 text-center py-20 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-slate-500 font-semibold">No dentists found matching the criteria.</p>
                <p className="text-slate-400 text-sm mt-1">Try selecting another procedure or searching in the navbar.</p>
              </div>
            ) : (
              dentists.map((doc: any) => (
                <DentistCard
                  key={doc.id}
                  dentist={doc}
                  isCompareMode={compareMode}
                  isSelected={selectedIds.includes(doc.id)}
                  onSelect={toggleSelect}
                />
              ))
            )}
          </div>

          <div className="mt-12 text-center">
            <Link href={"/find-dentist"} className="text-[#10436B] font-bold text-sm hover:underline decoration-2 underline-offset-4">
              View all specialties
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
