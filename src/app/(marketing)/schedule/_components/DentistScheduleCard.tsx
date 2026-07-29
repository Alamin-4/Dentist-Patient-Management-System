"use client";

import { Clock, Video, CalendarDays } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import MiniCalendar from "./MiniCalendar";
import type { Dentist } from "@/features/marketing/find-dentists-page-components/types";
import { DoctorProfileHeader } from "./DoctorProfileHeader";
import { TimezoneSelector } from "./TimezoneSelector";
import { TimeSlotPicker } from "./TimeSlotPicker";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface DentistSelection {
  dentistId: string;
  date: Date | null;
  timeSlot: string;
  timezone: string;
}

interface DentistScheduleCardProps {
  dentist: Dentist;
  selection: DentistSelection;
  onUpdate: (updates: Partial<Omit<DentistSelection, "dentistId">>) => void;
}

// ─── Optimized Time Slot Generator ────────────────────────────────────────────
function generateTimeSlots(): string[] {
  const slots: string[] = [];
  const startMinutes = 9 * 60 + 40; // 09:40
  const endMinutes = 17 * 60;       // 17:00
  const step = 15;

  const format = (h: number, m: number) =>
    `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;

  for (let m = startMinutes; m < endMinutes; m += step) {
    const startH = Math.floor(m / 60);
    const startM = m % 60;
    const endMTotal = m + step;
    const endH = Math.floor(endMTotal / 60);
    const endM = endMTotal % 60;

    slots.push(`${format(startH, startM)} to ${format(endH, endM)}`);
  }
  return slots;
}

const TIME_SLOTS = generateTimeSlots();

export function formatSlotToAmPm(slot: string): string {
  if (!slot) return "";
  const parts = slot.split(" to ");
  if (parts.length !== 2) return slot;

  const toAmPmStr = (timeStr: string) => {
    const timeParts = timeStr.split(":");
    if (timeParts.length < 2) return timeStr;
    const h = parseInt(timeParts[0], 10);
    const m = parseInt(timeParts[1], 10);
    if (isNaN(h) || isNaN(m)) return timeStr;
    const ampm = h >= 12 ? "PM" : "AM";
    const displayH = h % 12 === 0 ? 12 : h % 12;
    return `${displayH.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")} ${ampm}`;
  };

  return `${toAmPmStr(parts[0])} to ${toAmPmStr(parts[1])}`;
}

// ─── Helper: Format selected date nicely ──────────────────────────────────────
function formatSelectedDate(date: Date | null): string {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function DentistScheduleCard({
  dentist,
  selection,
  onUpdate,
}: DentistScheduleCardProps) {
  return (
    <Card className="bg-white border-gray-200 shadow-sm relative overflow-visible!">
      {/* 1. Doctor Header */}
      <DoctorProfileHeader dentist={dentist} />

      <CardContent className="p-6 space-y-6">
        {/* 2. Consultation Info */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-700">Consultation Details</p>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className="gap-1.5 py-1 px-2.5 text-xs font-medium text-gray-600 border-gray-200 bg-gray-50"
            >
              <Clock className="size-3.5 text-gray-400" />
              15 Minutes
            </Badge>
            <Badge
              variant="outline"
              className="gap-1.5 py-1 px-2.5 text-xs font-medium text-gray-600 border-gray-200 bg-gray-50"
            >
              <Video className="size-3.5 text-gray-400" />
              Video Call
              <span className="text-gray-400 font-normal">(Link via email)</span>
            </Badge>
          </div>
        </div>

        {/* 3. Calendar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">Select Availability</p>
            {selection.date && (
              <span className="text-xs text-[#113254] font-medium flex items-center gap-1">
                <CalendarDays className="size-3.5" />
                {formatSelectedDate(selection.date)}
              </span>
            )}
          </div>
          <MiniCalendar
            selected={selection.date}
            fullWidth={true}
            onSelect={(date) => {
              if (date) {
                const normalizedDate = new Date(date);
                normalizedDate.setHours(0, 0, 0, 0);
                onUpdate({ date: normalizedDate });
              } else {
                onUpdate({ date: null });
              }
            }}
          />
        </div>

        {/* 4. Timezone */}
        <TimezoneSelector
          value={selection.timezone}
          onChange={(tz) => onUpdate({ timezone: tz })}
        />

        {/* 5. Time Slots */}
        <TimeSlotPicker
          slots={TIME_SLOTS}
          selectedSlot={selection.timeSlot}
          onSelect={(slot) => onUpdate({ timeSlot: slot })}
        />
      </CardContent>
    </Card>
  );
}