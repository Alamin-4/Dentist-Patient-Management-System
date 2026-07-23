"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useStateContext } from "@/providers/StateProvider";
import { mapApiDentist, type Dentist } from "@/features/marketing/_components/module/DentistAllComponents/types";
import DentistScheduleCard, {
  type DentistSelection,
} from "./DentistScheduleCard";
import ScheduleSuccessModal from "./ScheduleSuccessModal";
import {
  clearBookingData,
  getBookingDraft,
  saveBookingDraft,
  type BookingDraft,
} from "@/lib/storage/bookingService";
import { apiClient, consultationBookingApi } from "@/api/client";
import { normalizeApiError } from "@/api/error-handler";
import { getDefaultTimezone } from "./TimezoneSelector";

const STORED_KEY = "schedule_selections";

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

function makeSelection(dentistId: string): DentistSelection {
  return { dentistId, date: null, timeSlot: "", timezone: getDefaultTimezone() };
}

function getDraftBackendDentistId(
  draft: BookingDraft,
  dentist: Dentist | undefined,
  index: number,
) {
  if (!dentist) return null;

  const saved = draft.scheduleSelections.find(
    (selection) => selection.dentistId === dentist.id,
  )?.backendDentistId;
  const fallback = draft.selectedBackendDentistIds[index];
  const id = saved ?? dentist.backendId ?? fallback ?? dentist.id;

  return id;
}

export default function ScheduleContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setShowCompareModal } = useStateContext();

  const dentistIdsParam = searchParams.get("dentistIds") ?? "";
  const consultationIdParam = searchParams.get("consultationId");

  const [dentists, setDentists] = useState<Dentist[]>([]);
  const [selections, setSelections] = useState<DentistSelection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        setIsLoading(true);
        const draft = getBookingDraft();
        const ids = dentistIdsParam
          ? dentistIdsParam.split(",").map((s) => s.trim())
          : draft.selectedDentistIds;

        let loadedDentists: Dentist[] = [];
        if (ids.length > 0) {
          const res = await apiClient.dentists.getDirectoryList({ ids });
          loadedDentists = (res?.data ?? []).map(mapApiDentist);
        } else {
          const res = await apiClient.dentists.getDirectoryList({ verified: "true", limit: 2 });
          loadedDentists = (res?.data ?? []).map(mapApiDentist);
        }

        setDentists(loadedDentists);

        const nextSelections = loadedDentists.map((dentist) => {
          const saved = draft.scheduleSelections.find(
            (selection) => selection.dentistId === dentist.id,
          );
          return saved
            ? {
              dentistId: dentist.id,
              date: saved.date ? new Date(saved.date) : null,
              timeSlot: saved.timeSlot,
              timezone: saved.timezone || getDefaultTimezone(),
            }
            : makeSelection(dentist.id);
        });
        setSelections(nextSelections);
      } catch (error) {
        console.error("Error loading schedule data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScheduleData();
  }, [dentistIdsParam]);

  const updateSelection = useCallback(
    (dentistId: string, updates: Partial<Omit<DentistSelection, "dentistId">>) => {
      setErrorMsg(null);
      setSelections((prev) => {
        const next = prev.map((s) =>
          s.dentistId === dentistId ? { ...s, ...updates } : s,
        );
        saveBookingDraft({
          scheduleSelections: next.map((selection) => {
            const dentist = dentists.find((doc) => doc.id === selection.dentistId);
            const resolvedBackendId = getDraftBackendDentistId(
              getBookingDraft(),
              dentist,
              next.findIndex((item) => item.dentistId === selection.dentistId),
            );
            return {
              dentistId: selection.dentistId,
              backendDentistId: resolvedBackendId ? String(resolvedBackendId) : null,
              date: selection.date?.toISOString() ?? "",
              timeSlot: selection.timeSlot,
              timezone: selection.timezone,
            };
          }),
        });
        return next;
      },
      );
    },
    [dentists],
  );

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 bg-[#F9FAFB]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#113254]"></div>
        <p className="text-[#6B7280] font-medium text-sm animate-pulse">Loading schedule details...</p>
      </div>
    );
  }

  const getBackendDentistId = (dentist: Dentist, index: number) => {
    return getDraftBackendDentistId(getBookingDraft(), dentist, index);
  };

  const formatApiDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatApiTime = (slot: string) => {
    const start = slot.split(" to ")[0] || slot;
    return `${start}:00`;
  };

  const handleConfirm = async () => {
    // Validate: each dentist must have a date and time slot
    const missing = selections.filter((s) => !s.date || !s.timeSlot);
    if (missing.length > 0) {
      const idx = selections.indexOf(missing[0]);
      const name = dentists[idx]?.name ?? "a dentist";
      toast.error(`Please select a date and time for ${name}`);
      return;
    }

    const consultationId = consultationIdParam ?? getBookingDraft().consultationId;
    if (!consultationId) {
      toast.error("Consultation draft not found. Please complete booking details first.");
      return;
    }

    const dentistsPayload = selections.map((selection, index) => {
      const dentist = dentists[index];
      return {
        dentist: dentist ? getBackendDentistId(dentist, index) : null,
        scheduled_date: formatApiDate(selection.date!),
        scheduled_time: formatApiTime(selection.timeSlot),
      };
    });

    if (dentistsPayload.some((item) => !item.dentist)) {
      toast.error("Could not find backend dentist IDs. Please reselect dentists.");
      return;
    }

    // Persist to sessionStorage so success page can read it
    const storable = selections.map((s) => ({
      dentistId: s.dentistId,
      date: s.date!.toISOString(),
      timeSlot: s.timeSlot,
      timezone: s.timezone,
    }));
    sessionStorage.setItem(STORED_KEY, JSON.stringify(storable));

    setErrorMsg(null);
    try {
      setIsConfirming(true);
      await consultationBookingApi.stepSeven({
        consultation_id: consultationId,
        dentists: dentistsPayload.map((item) => ({
          dentist: item.dentist!,
          scheduled_date: item.scheduled_date,
          scheduled_time: item.scheduled_time,
        })),
      });
      clearBookingData();
      setShowSuccess(true);
    } catch (error) {
      const errMsg = normalizeApiError(error).message;
      setErrorMsg(errMsg);
      toast.error(errMsg);
    } finally {
      setIsConfirming(false);
    }
  };

  const handleGoToBookings = () => {
    router.push("/patient");
  };

  return (
    <>
      {/* ── Page ── */}
      <div className="max-w-7xl w-11/12 mx-auto py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-[26px] font-black text-[#1A1A2E] leading-tight">
              Book your free 15-minute video consultation
            </h1>
            <p className="mt-1 text-[14px] text-[#6B7280]">
              Choose a time that works for you. All times shown in your timezone
              (Eastern Time, UTC&#8209;5).
            </p>
          </div>
          {dentists.length > 1 && (
            <button
              type="button"
              onClick={() => setShowCompareModal(true)}
              className="shrink-0 px-5 py-2.5 border border-[#E5E7EB] rounded-lg text-[14px] font-semibold text-[#1A1A2E] hover:bg-[#F9FAFB] transition-colors"
            >
              View Comparison
            </button>
          )}
        </div>

        <div className={dentists.length === 1 ? "max-w-3xl mx-auto space-y-8" : "space-y-8"}>

          <div className={dentists.length === 1 ? "w-full" : "grid grid-cols-1 lg:grid-cols-2 gap-6"}>
            {dentists.map((doc, i) => (
              <DentistScheduleCard
                key={doc.id}
                dentist={doc}
                selection={selections[i] ?? makeSelection(doc.id)}
                onUpdate={(updates) => updateSelection(doc.id, updates)}
              />
            ))}
          </div>

          {errorMsg && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-750 flex items-start gap-2 max-w-xl ml-auto">
              <span className="font-semibold shrink-0">Error:</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isConfirming}
              className="px-8 py-4 bg-[#113254] hover:bg-[#0d2844] text-white font-semibold text-[15px] rounded-lg active:scale-95 transition-all disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isConfirming ? "Confirming..." : "Confirm Video Consultation"}
            </button>
          </div>
        </div>
      </div>

      <ScheduleSuccessModal
        open={showSuccess}
        onOpenChange={(isOpen) => {
          setShowSuccess(isOpen);
          if (!isOpen) {
            handleGoToBookings();
          }
        }}
        dentists={dentists}
        selections={selections}
        formatDate={formatDate}
        onGoToBookings={handleGoToBookings}
      />
    </>
  );
}
