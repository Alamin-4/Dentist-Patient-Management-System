"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getDentistsFromStorage } from "@/lib/storage/dentistData";

export default function Schedule() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dentistIdsParam = searchParams.get("dentistIds") || "";
  const [dentists, setDentists] = useState<any[]>([]);

  useEffect(() => {
    const all = getDentistsFromStorage();
    if (dentistIdsParam) {
      const ids = dentistIdsParam.split(",").map((s) => s.trim());
      const found = all.filter((d: any) => ids.includes(d.id));
      setDentists(found.length ? found : all.slice(0, 2));
    } else {
      setDentists(all.slice(0, 2));
    }
  }, [dentistIdsParam]);

  const handleConfirm = () => {
    // navigate to success page after confirming schedule, keep dentistIds in query
    const q = dentistIdsParam || dentists.map((d) => d.id).join(",");
    router.push(`/schedule/success?dentistIds=${encodeURIComponent(q)}`);
  };

  return (
    <div className="max-w-360 w-11/12 mx-auto py-20">
      <h1 className="text-2xl font-semibold mb-6">
        Book your free 15-minute video consultation
      </h1>
      <p className="text-gray-600 mb-6">
        Choose a time that works for you. All times shown in your timezone.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dentists.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-xl p-6 shadow-sm border"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={doc.image}
                  alt={doc.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-lg">{doc.name}</div>
                  <div className="text-sm text-gray-500">{doc.specialty}</div>
                  <div className="text-sm text-gray-400">{doc.location}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Estimate Budget</div>
                <div className="font-bold text-xl text-[#113254]">
                  ${doc.price}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-sm text-gray-600 mb-2">
                Select Availability
              </div>
              <div className="border rounded p-4 bg-gray-50 text-center text-gray-400">
                [Calendar placeholder]
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm text-gray-600">Select Time Zone</label>
              <select className="w-full mt-2 border rounded p-2">
                <option>Select Time Zone</option>
                <option>EST (UTC -5)</option>
                <option>PST (UTC -8)</option>
              </select>
            </div>

            <div className="mt-4">
              <div className="text-sm text-gray-600 mb-2">Select Time</div>
              <div className="flex flex-wrap gap-2">
                <button className="px-3 py-2 bg-white border rounded">
                  10:30 to 10:45
                </button>
                <button className="px-3 py-2 bg-white border rounded">
                  10:45 to 11:00
                </button>
                <button className="px-3 py-2 bg-white border rounded">
                  11:00 to 11:15
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-right">
        <button
          onClick={handleConfirm}
          className="px-6 py-3 bg-[#113254] text-white rounded-xl"
        >
          Confirm Video Consultation
        </button>
      </div>
    </div>
  );
}
