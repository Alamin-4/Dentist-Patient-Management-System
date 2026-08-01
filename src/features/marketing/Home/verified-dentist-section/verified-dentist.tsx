"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import Link from "next/link";
import Sidebar from "./sidebar";
import DentistCard from "./dentist-card";
import { Button } from "@/components/ui/button";
import { useStateContext } from "@/providers/StateProvider";
import { useMe } from "@/hooks/auth/useAuth";
import { useDentistDirectory } from "@/hooks/dentist/useDentistDirectory";
import { mapApiDentist, type Dentist } from "@/features/marketing/find-dentists-page-components/types";
import CustomSectionHeading from "@/features/shared/custom-section-heading";
import CustomDesText from "@/features/shared/custom-des-text";

const SkeletonCard = () => (
  <div className="animate-pulse rounded-md border-2 border-slate-100 bg-white p-4 sm:p-6">
    <div className="flex w-full flex-row items-start justify-between gap-4">
      <div className="h-16 w-16 shrink-0 rounded-full bg-slate-200 sm:h-20 sm:w-20" />
      <div className="min-w-0 flex-1 space-y-2.5 py-1">
        <div className="h-4 w-3/4 rounded bg-slate-200" />
        <div className="h-3 w-1/2 rounded bg-slate-200" />
        <div className="h-3 w-1/4 rounded bg-slate-200" />
      </div>
      <div className="h-4 w-16 shrink-0 rounded bg-slate-200" />
    </div>
  </div>
);

export default function VerifiedDentists() {
  const [procedure, setProcedure] = useState("");
  const [compareMode, setCompareMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { setShowSignupModal, setShowPersonalizeModal, setDentistsToCompare, setShowCompareModal, searchQuery } = useStateContext();
  const { user } = useMe();

  const { data: directoryResponse, isLoading } = useDentistDirectory({
    search: searchQuery || undefined,
    procedure: procedure && procedure !== "All Procedures" ? procedure : undefined,
    limit: 6,
  });

  const dentists = useMemo<Dentist[]>(() => {
    return (directoryResponse?.data || []).map((d: any) => mapApiDentist(d));
  }, [directoryResponse]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : prev.length < 3 ? [...prev, id] : prev));
  };

  const selectedDentists = useMemo(() => dentists.filter((doc) => selectedIds.includes(doc.id)), [dentists, selectedIds]);

  const handleCompare = () => {
    if (selectedDentists.length < 2) return;
    const mapped = selectedDentists.map((doc) => {
      const raw = directoryResponse?.data?.find((item: any) => item.id === doc.id);
      return raw ? mapApiDentist(raw) : null;
    }).filter(Boolean) as Dentist[];

    setDentistsToCompare(mapped);
    if (user?.firstName || user?.name || user?.first_name) setShowCompareModal(true);
    else if (user) setShowPersonalizeModal(true);
    else setShowSignupModal(true);
  };

  const verifiedDentists = dentists?.map((d) => d.status === "VERIFIED")


  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="mx-auto mb-10 md:mb-12 w-11/12 max-w-400 space-y-3 text-center lg:text-left">
        <CustomSectionHeading value="Verified Dentists" />
        <CustomDesText value="Every dentist is trusted. Every review is from a real patient." />
      </div>

      <div className="mx-auto flex w-11/12 max-w-400 flex-col rounded-md border border-stroke lg:flex-row">
        <Sidebar active={procedure} onChange={setProcedure} />

        <div className="flex-1 p-4 lg:p-6">
          <header className="mb-6 flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sec-text text-sm lg:text-base">
              Showing {isLoading ? "..." : dentists.length} dentist{dentists.length !== 1 && "s"} for{" "}
              <span className="font-bold text-primary">"{procedure || "All Procedures"}"</span>
            </p>

            {verifiedDentists && verifiedDentists.length >= 2 && (
              <div className="flex items-center gap-4">
                <div className="*:text-left">
                  <p className="text-sm font-medium text-primary">Compare</p>
                  <p className="text-xs text-sec-text">up to 3</p>
                </div>
                <button
                  onClick={() => { setCompareMode(!compareMode); setSelectedIds([]); }}
                  className={cn("relative flex h-6 w-11 cursor-pointer items-center rounded-full px-1 transition-all", compareMode ? "bg-primary" : "bg-gray-300")}
                >
                  <div className={cn("h-4 w-4 rounded-full bg-white shadow-sm transition-all", compareMode ? "translate-x-5" : "translate-x-0")} />
                </button>
              </div>
            )}

          </header>

          {selectedDentists.length > 0 && (
            <div className="mb-6 flex w-full flex-row items-center justify-center gap-4 rounded-lg border border-slate-100 bg-slate-50 p-4">
              <div className="flex flex-row items-center justify-center gap-2">
                {selectedDentists.map((dentist, i) => (
                  <div key={dentist.id} className="group relative">
                    <span
                      onClick={() => setSelectedIds((prev) => prev.filter((id) => id !== dentist.id))}
                      className="absolute -right-1.5 -top-1.5 z-10 cursor-pointer rounded-full bg-red-100 p-0.5 text-red-600 shadow-sm transition-colors hover:bg-red-200"
                    >
                      <X className="h-3.5 w-3.5" />
                    </span>
                    <img src={dentist.image || ""} alt={`Selected ${i + 1}`} className="h-12 w-12 rounded-full border-2 border-white object-cover shadow-sm" />
                  </div>
                ))}
              </div>
              <Button
                disabled={selectedDentists.length < 2}
                onClick={handleCompare}
                className="h-11 cursor-pointer rounded-lg bg-primary px-6 font-bold text-white transition-colors hover:bg-[#092b47] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Compare
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:grid-cols-2">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            ) : dentists.length === 0 ? (
              <div className="col-span-2 rounded-lg border border-slate-100 bg-slate-50 py-20 text-center">
                <p className="font-semibold text-slate-500">No dentists found matching the criteria.</p>
                <p className="mt-1 text-sm text-slate-400">Try selecting another procedure or searching in the navbar.</p>
              </div>
            ) : (
              dentists.map((doc) => (
                <DentistCard
                  key={doc.id}
                  dentist={doc}
                  isCompareMode={compareMode}
                  isSelectedForCompare={selectedIds.includes(doc.id)}
                  onCompareToggle={() => toggleSelect(doc.id)}
                  isButtonShow={false}
                />
              ))
            )}
          </div>

          <div className="mt-12 text-center">
            <Link href="/find-dentists" className="text-sm font-bold text-primary underline-offset-4 hover:underline decoration-2">
              View all specialties
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}