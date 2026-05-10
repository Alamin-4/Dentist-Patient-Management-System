"use client"

import { MapPin } from "lucide-react"

import DentistCard from "../DentistCard"
import type { Dentist } from "../types"
import { cn } from "@/lib/utils"

type DentistMapProps = {
  dentists: Dentist[]
  activeDentistId: string | null
  onMarkerClick: (dentist: Dentist) => void
  onCloseCard: () => void
}

export default function DentistMap({
  dentists,
  activeDentistId,
  onMarkerClick,
  onCloseCard,
}: DentistMapProps) {
  const activeDentist = dentists.find((dentist) => dentist.id === activeDentistId) ?? null

  return (
    <div className="relative min-h-[540px] overflow-hidden rounded-2xl border border-slate-200 bg-[#eef3f7] shadow-[0_10px_30px_rgba(15,23,42,0.05)] lg:h-[calc(100vh-13rem)]">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.45)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.45)_1px,transparent_1px)] bg-[size:72px_72px] opacity-80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(0,51,102,0.12),transparent_26%),radial-gradient(circle_at_74%_30%,rgba(15,23,42,0.08),transparent_18%),radial-gradient(circle_at_64%_72%,rgba(0,51,102,0.09),transparent_24%)]" />
      <div className="absolute inset-0">
        <div className="absolute left-[8%] top-[18%] h-px w-[84%] bg-slate-300/70" />
        <div className="absolute left-[14%] top-[34%] h-px w-[64%] rotate-[-12deg] bg-slate-300/60" />
        <div className="absolute left-[18%] top-[58%] h-px w-[72%] rotate-[8deg] bg-slate-300/60" />
        <div className="absolute left-[22%] top-[12%] h-[78%] w-px bg-slate-300/70" />
        <div className="absolute left-[52%] top-[8%] h-[82%] w-px bg-slate-300/50" />
      </div>

      <div className="absolute inset-0">
        {dentists.map((dentist) => {
          const isActive = dentist.id === activeDentistId

          return (
            <button
              key={dentist.id}
              type="button"
              className="group absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${dentist.coords.x}%`, top: `${dentist.coords.y}%` }}
              onClick={() => onMarkerClick(dentist)}
              aria-label={`Open profile for ${dentist.name}`}
            >
              <span
                className={cn(
                  "absolute inset-0 rounded-full bg-[#003366]/20 transition-all duration-300",
                  isActive ? "scale-150 opacity-70" : "scale-100 opacity-0 group-hover:opacity-80"
                )}
              />
              <span className="relative flex size-9 items-center justify-center rounded-full border-2 border-white bg-[#003366] text-white shadow-lg transition-transform duration-200 group-hover:scale-110">
                <MapPin className="size-4 fill-current" />
              </span>
            </button>
          )
        })}
      </div>

      {activeDentist ? (
        <div
          className="absolute z-20 max-w-[min(92vw,32rem)]"
          style={{ left: `${activeDentist.coords.x}%`, top: `${activeDentist.coords.y}%` }}
        >
          <div className="-translate-x-1/2 -translate-y-[112%]">
            <DentistCard
              dentist={activeDentist}
              floating
              onPrimaryAction={onCloseCard}
              onSecondaryAction={onCloseCard}
            />
          </div>
        </div>
      ) : null}

      <div className="absolute left-4 top-4 rounded-full border border-white/70 bg-white/85 px-3 py-1 text-xs font-medium text-[#003366] shadow-sm backdrop-blur">
        Interactive Map Preview
      </div>
    </div>
  )
}