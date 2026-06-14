"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dentist } from "./types";

interface CompareStickyBarProps {
  compareList: Dentist[];
  removeSelectedDentist: (id: string) => void;
  onCompareSubmit: () => void;
}

export default function CompareStickyBar({
  compareList,
  removeSelectedDentist,
  onCompareSubmit,
}: CompareStickyBarProps) {
  if (compareList.length === 0) return null;

  return (
    <div className="w-full mb-6 flex flex-row gap-4 items-center justify-center bg-slate-50 p-4 rounded-xl border border-slate-100">
      <div className="flex flex-row gap-4 items-center justify-center">
        {compareList.map((dentist, i) => (
          <div key={dentist.id || i} className="relative group cursor-pointer">
            <span
              onClick={() => removeSelectedDentist(dentist.id)}
              className="absolute hidden group-hover:flex inset-0 bg-black/40 rounded-full items-center justify-center transition-all"
            >
              <X className="text-red-500 size-5" />
            </span>
            <Image
              src={dentist.image || "/images/dentist.png"}
              alt={`Selected Dentist ${i + 1}`}
              width={48}
              height={48}
              className="rounded-full w-12 h-12 object-cover border-2 border-white shadow-sm"
            />
          </div>
        ))}
      </div>
      <div>
        <Button
          onClick={onCompareSubmit}
          className="bg-[#0E3E65] text-white h-12 px-6 rounded-lg font-medium hover:bg-[#0d2844] transition-colors"
        >
          Compare Profiles
        </Button>
      </div>
    </div>
  );
}
