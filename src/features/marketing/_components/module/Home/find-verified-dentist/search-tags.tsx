"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useGlobalProcedures } from "@/hooks/procedures/useProcedures";
import { proceduresLists } from "@/lib/location-data";

export default function SearchTags() {
  const { data: globalProcedures } = useGlobalProcedures();

  const rawList = Array.isArray(globalProcedures)
    ? globalProcedures
    : (globalProcedures as any)?.data || [];

  const procedures = rawList.length > 0 ? rawList : proceduresLists;
  const displayProcedures = procedures.slice(0, 5);

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
      {displayProcedures.map((proc: any, index: number) => {
        const name = typeof proc === "string" ? proc : proc.name;
        const key = proc.id || proc.slug || name || index;
        return (
          <Link
            key={key}
            href={`/find-dentists?procedure=${encodeURIComponent(name)}`}
            className="px-6 py-2 rounded-full bg-white/20 backdrop-blur-md text-white text-sm font-medium hover:bg-white/30 transition-all border border-white/10"
          >
            {name}
          </Link>
        );
      })}
      <Link
        href="/find-dentists"
        className="flex items-center gap-2 text-[#E3A32A] text-sm font-bold hover:underline ml-2"
      >
        View all <ArrowRight size={16} />
      </Link>
    </div>
  );
}