"use client";

import { useState } from "react";
import { X, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { SiGooglecalendar, SiApple } from "react-icons/si";

function OutlookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="24" height="24" rx="3" fill="#0078D4" />
      <path
        d="M13.5 6H21v3.5h-7.5V6zM13.5 10.5H21V14h-7.5v-3.5zM13.5 15H21v3H13.5v-3z"
        fill="white"
        opacity="0.9"
      />
      <rect x="3" y="5" width="9" height="14" rx="1.5" fill="white" opacity="0.95" />
      <ellipse cx="7.5" cy="12" rx="2.5" ry="3" fill="#0078D4" />
    </svg>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface AppointmentInfo {
  doctorName: string;
  specialty: string;
  avatarSrc: string;
  date: string;
  time: string;
  durationLabel?: string;
  isoDate?: string;
}

interface AddToCalendarModalProps {
  open: boolean;
  onClose: () => void;
  appointment: AppointmentInfo;
}

type CalendarOption = "google" | "icloud" | "outlook";

const CALENDAR_OPTIONS: {
  key: CalendarOption;
  label: string;
  Icon: React.ElementType;
  iconColor: string;
}[] = [
  {
    key: "google",
    label: "Google Calendar",
    Icon: SiGooglecalendar,
    iconColor: "#4285F4",
  },
  {
    key: "icloud",
    label: "iCloud Calendar",
    Icon: SiApple,
    iconColor: "#000000",
  },
  {
    key: "outlook",
    label: "Outlook Calendar",
    Icon: OutlookIcon,
    iconColor: "",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildGoogleCalendarUrl(appointment: AppointmentInfo): string {
  const title = encodeURIComponent(
    `Consultation with ${appointment.doctorName}`
  );
  const details = encodeURIComponent(
    `15-minute video consultation with ${appointment.doctorName} (${appointment.specialty})`
  );
  const base = appointment.isoDate ?? new Date().toISOString().split("T")[0];
  // Strip time and build a simple all-day event if no full ISO given
  const dateStr = base.replace(/-/g, "");
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${dateStr}/${dateStr}`;
}

function buildOutlookUrl(appointment: AppointmentInfo): string {
  const subject = encodeURIComponent(
    `Consultation with ${appointment.doctorName}`
  );
  const body = encodeURIComponent(
    `15-minute video consultation with ${appointment.doctorName} (${appointment.specialty})`
  );
  return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${subject}&body=${body}&startdt=${appointment.isoDate ?? ""}&path=%2Fcalendar%2Faction%2Fcompose&rru=addevent`;
}

function downloadIcs(appointment: AppointmentInfo): void {
  const uid = `${Date.now()}@rateddocs`;
  const now = new Date().toISOString().replace(/[-:.]/g, "").slice(0, 15) + "Z";
  const summary = `Consultation with ${appointment.doctorName}`;
  const description = `15-minute video consultation (${appointment.specialty})`;
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//RatedDocs//EN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART;VALUE=DATE:${(appointment.isoDate ?? new Date().toISOString().split("T")[0]).replace(/-/g, "")}`,
    `DTEND;VALUE=DATE:${(appointment.isoDate ?? new Date().toISOString().split("T")[0]).replace(/-/g, "")}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "consultation.ics";
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AddToCalendarModal({
  open,
  onClose,
  appointment,
}: AddToCalendarModalProps) {
  const [selected, setSelected] = useState<CalendarOption>("icloud");

  const handleAdd = () => {
    if (selected === "google") {
      window.open(buildGoogleCalendarUrl(appointment), "_blank");
    } else if (selected === "outlook") {
      window.open(buildOutlookUrl(appointment), "_blank");
    } else {
      downloadIcs(appointment);
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="w-full max-w-110 rounded-3xl p-0 overflow-hidden border-0 shadow-xl"
        showCloseButton={false}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <DialogTitle className="text-[18px] font-bold text-[#1A1A2E]">
              Add to Calendar
            </DialogTitle>
            <button
              type="button"
              onClick={onClose}
              className="size-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-[#6B7280] transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Doctor info card */}
          <div className="flex items-center justify-between gap-4 bg-[#F9FAFB] rounded-2xl px-4 py-3.5 mb-5">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={appointment.avatarSrc}
                alt={appointment.doctorName}
                className="size-11 rounded-full object-cover shrink-0 bg-gray-200"
              />
              <div className="min-w-0">
                <p className="text-[14px] font-bold text-[#1A1A2E] truncate">
                  {appointment.doctorName}
                </p>
                <p className="text-[12px] text-[#6B7280]">
                  {appointment.specialty}
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[13px] font-semibold text-[#1A1A2E]">
                {appointment.date}
              </p>
              <p className="text-[12px] text-[#9CA3AF] mt-0.5">
                {appointment.time}
                {appointment.durationLabel
                  ? ` · ${appointment.durationLabel}`
                  : ""}
              </p>
            </div>
          </div>

          {/* Calendar selection */}
          <p className="text-[13px] font-semibold text-[#6B7280] mb-3">
            Select Calendar
          </p>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {CALENDAR_OPTIONS.map(({ key, label, Icon, iconColor }) => {
              const isSelected = selected === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelected(key)}
                  className={`relative flex flex-col items-center gap-2.5 rounded-2xl border-2 py-4 px-2 transition-all ${
                    isSelected
                      ? "border-[#113254] bg-[#F0F5FA]"
                      : "border-[#E5E7EB] bg-white hover:border-[#113254]/30"
                  }`}
                >
                  {/* Checkmark badge */}
                  {isSelected && (
                    <span className="absolute -top-2 -right-2 size-5 rounded-full bg-[#113254] flex items-center justify-center shadow-sm">
                      <Check className="size-3 text-white stroke-3" />
                    </span>
                  )}
                  <Icon
                    className="size-7"
                    style={iconColor ? { color: iconColor } : undefined}
                  />
                  <span className="text-[11px] font-semibold text-[#374151] text-center leading-tight">
                    {label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={handleAdd}
            className="w-full py-3.5 bg-[#113254] hover:bg-[#0d2844] text-white font-bold text-[15px] rounded-xl active:scale-95 transition-all"
          >
            Add to Calendar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
