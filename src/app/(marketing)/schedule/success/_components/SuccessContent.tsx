"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getDentistsFromStorage } from "@/lib/storage/dentistData";

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dentistIdsParam = searchParams.get("dentistIds") || "";
  const [dentists, setDentists] = useState<any[]>([]);

  useEffect(() => {
    const all = getDentistsFromStorage();
    if (dentistIdsParam) {
      const ids = dentistIdsParam.split(",").map((s) => s.trim());
      const found = all.filter((d: any) => ids.includes(d.id));
      setDentists(found);
    }
  }, [dentistIdsParam]);

  const handleGoToBookings = () => {
    router.push("/dashboard/patient/bookings");
  };

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl text-center">
        <div className="w-16 h-16 rounded-full bg-[#113254] text-white mx-auto flex items-center justify-center mb-6">
          ✓
        </div>
        <h2 className="text-2xl font-semibold mb-2">
          You're booked{dentists.length ? " with " : ""}
          {dentists.map((d, idx) => (
            <span key={d.id}>
              {idx > 0 ? " and " : ""}
              {d.name}
            </span>
          ))}
        </h2>
        <p className="text-gray-600 mb-6">
          Your dentist will review your details before the consultation. Please
          have your photos, any X-rays, and a list of questions ready.
        </p>

        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          {dentists.map((d) => (
            <div
              key={d.id}
              className="flex items-center justify-between py-3 border-b last:border-b-0"
            >
              <div className="flex items-center gap-4">
                <img
                  src={d.image}
                  alt={d.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold">{d.name}</div>
                  <div className="text-sm text-gray-500">{d.specialty}</div>
                </div>
              </div>
              <div className="text-right text-sm text-gray-600">
                Tuesday, 29 April 2025
                <div className="text-gray-400">
                  10:30 AM EST · 15-minute video call
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={handleGoToBookings}
            className="px-6 py-3 bg-[#113254] text-white rounded-xl"
          >
            Go to my Bookings
          </button>
        </div>
      </div>
    </div>
  );
}
