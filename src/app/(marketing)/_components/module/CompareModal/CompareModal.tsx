"use client";

import { CheckCircle2, Circle, Star } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useStateContext } from "@/providers/StateProvider";
import { useState, useEffect } from "react";
import { getDentistsFromStorage } from "@/lib/storage/dentistData";
import { useRouter } from "next/navigation";

export default function CompareModal() {
  const {
    showCompareModal,
    setShowCompareModal,
    setShowBookingModal,
    setSelectedDentistId,
    compareModalPurpose,
    setCompareModalPurpose,
    selectedDentistId,
    schedule,
  } = useStateContext();
  const router = useRouter();
  const [selectedDentistIds, setSelectedDentistIds] = useState<string[]>([]);
  const [dentists, setDentists] = useState<any[]>([]);

  useEffect(() => {
    const dentistsData = getDentistsFromStorage();
    // If opened after booking, prioritize the selected dentist
    if (compareModalPurpose === "postBooking" && selectedDentistId) {
      const main = dentistsData.find((d) => d.id === selectedDentistId);
      const others = dentistsData.filter((d) => d.id !== selectedDentistId);
      const list = main
        ? [main, ...others.slice(0, 2)]
        : dentistsData.slice(0, 3);
      setDentists(list);
      // pre-select the active dentist so the Schedule button is enabled
      setSelectedDentistIds([selectedDentistId]);
    } else {
      // default: Get first 3 dentists for comparison
      setDentists(dentistsData.slice(0, 3));
    }
  }, []);

  const handleSelectDentist = (dentistId: string) => {
    setSelectedDentistIds((prev) => {
      if (prev.includes(dentistId)) {
        return prev.filter((id) => id !== dentistId);
      } else {
        if (prev.length >= 2) {
          return prev;
        }
        return [...prev, dentistId];
      }
    });
  };

  const handleBookConsultations = () => {
    if (schedule) {
      router.push("/schedule");
      return;
    }
    if (selectedDentistIds.length > 0) {
      // Set the first selected dentist as the active one
      setSelectedDentistId(selectedDentistIds[0]);
      if (compareModalPurpose === "postBooking") {
        // navigate to schedule page with selected dentist ids
        const q = selectedDentistIds.join(",");
        setShowCompareModal(false);
        setCompareModalPurpose("compare");
        router.push(`/schedule?dentistIds=${encodeURIComponent(q)}`);
      } else {
        setShowBookingModal("startBooking");
        setShowCompareModal(false);
      }
    }
  };

  return (
    <Dialog open={showCompareModal} onOpenChange={setShowCompareModal}>
      <DialogContent className="sm:max-w-7xl w-full p-0 border-none rounded-2xl overflow-hidden bg-white border max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-8 py-6 border-b border-[#F3F4F6]">
          <h2 className="text-[24px] font-bold text-[#1A1A2E]">
            Compare Dentists
          </h2>
        </div>

        <div className="overflow-x-auto w-full">
          <div className="w-full min-w-200">
            <div className="grid grid-cols-4 px-8 pt-8 pb-4 items-end">
              <div />
              {dentists.map((doc) => (
                <div
                  key={doc.id}
                  className="flex flex-col items-center text-center"
                >
                  <div className="relative mb-4">
                    <img
                      src={doc.image}
                      alt={doc.name}
                      className="w-10 lg:w-20 h-10 lg:h-20 rounded-full bg-[#F3F4F6] object-cover"
                    />
                  </div>
                  <div className="flex flex-col lg:flex-row items-center gap-2 mb-1">
                    <button
                      type="button"
                      className="cursor-pointer transition-transform active:scale-90"
                      onClick={() => handleSelectDentist(doc.id)}
                    >
                      {selectedDentistIds.includes(doc.id) ? (
                        <CheckCircle2 className="w-5 h-5 text-[#113254] fill-[#113254] stroke-white rounded-full" />
                      ) : (
                        <Circle
                          className={`w-5 h-5 transition-colors ${
                            selectedDentistIds.length >= 2
                              ? "text-gray-200 cursor-not-allowed"
                              : "text-[#9EA9AA] hover:text-[#113254]"
                          }`}
                        />
                      )}
                    </button>

                    <span className="text-[17px] font-semibold text-[#1A1A2E]">
                      {doc.name}
                    </span>
                  </div>
                  <span className="text-[14px] text-[#1A1A2E] font-medium">
                    {doc.specialty}
                  </span>
                </div>
              ))}
            </div>

            <ComparisonRow
              label="RDV SCORE"
              values={dentists.map((d) => `${d.rdvScore}/100`)}
            />
            <ComparisonRow
              label="EXPERIENCE"
              values={dentists.map((d) => `${d.reviewCount} reviews`)}
            />
            <ComparisonRow
              label="PATIENT RATING"
              values={dentists.map((d) => (
                <div className="flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-[#1A1A2E]">
                    {d.rating}
                  </span>
                </div>
              ))}
            />
            <ComparisonRow
              label="LOCATION"
              values={dentists.map((d) => d.location)}
            />
            <ComparisonRow
              label="LANGUAGES"
              values={dentists.map((d) => d.languages.join(", "))}
            />
            <ComparisonRow
              label="ESTIMATE RANGE"
              isLast
              values={dentists.map((d) => (
                <span className="text-[#113254] font-bold text-[18px]">
                  ${d.price}
                </span>
              ))}
            />
          </div>
        </div>

        {/* Footer Section */}
        <div className="flex flex-col items-center py-8 px-8 border-t border-[#F3F4F6]">
          <button
            onClick={handleBookConsultations}
            disabled={selectedDentistIds.length === 0}
            className="flex items-center gap-3 bg-[#113254] hover:bg-[#0d2844] disabled:bg-gray-300 text-white px-10 py-4 rounded-xl transition-all mb-4"
          >
            <span className="text-[16px] font-semibold">
              {schedule
                ? `Schedule ${selectedDentistIds.length} Consult${
                    selectedDentistIds.length > 1 ? "s" : ""
                  }`
                : "Book consultations"}
            </span>
            <span className="bg-white text-[#113254] w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold">
              {selectedDentistIds.length}
            </span>
          </button>
          <p className="text-[#6B7280] text-[14px] text-center">
            {schedule
              ? "You'll only fill in your details once."
              : "You'll complete one intake form and your information is shared with all selected doctors."}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ComparisonRow({
  label,
  values,
  isLast = false,
}: {
  label: string;
  values: any[];
  isLast?: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-4 px-8 py-5 items-center border-b border-[#F3F4F6] ${isLast ? "border-b-0" : ""}`}
    >
      <div className=" font-medium text-[#6B7280]">{label}</div>
      {values.map((val, idx) => (
        <div
          key={idx}
          className="text-center text-[15px] text-[#1A1A2E] font-medium"
        >
          {val}
        </div>
      ))}
    </div>
  );
}
