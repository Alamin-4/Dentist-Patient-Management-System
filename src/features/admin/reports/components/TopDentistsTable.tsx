"use client";

import { Star, MapPin, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const fmt = (n: number) => n >= 1000 ? `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `$${n.toLocaleString()}`;
const fmtNum = (n: number) => n.toLocaleString();

function Avatar({ initials, color, size = "md" }: { initials: string; color: string; size?: "sm" | "md" }) {
  const sz = size === "sm" ? "h-7 w-7 text-[10px]" : "h-9 w-9 text-xs";
  return (
    <span
      className={cn("inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white", sz)}
      style={{ backgroundColor: color }}
    >
      {initials}
    </span>
  );
}

interface DentistRow {
  rank: number;
  name: string;
  initials: string;
  avatarColor: string;
  specialty: string;
  country: string;
  bookings: number;
  revenue: number;
  rating: number;
  rdvScore: number;
  growthPct: number;
}

interface TopDentistsTableProps {
  topDentists: DentistRow[];
}

export function TopDentistsTable({ topDentists }: TopDentistsTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-gray-100 px-5 py-4">
        <div>
          <h3 className="text-sm font-bold text-text">Top Dentists by Revenue</h3>
          <p className="mt-0.5 text-xs text-gray-400">Ranked by total patient escrow released</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-50 bg-gray-50/50">
              {["Rank", "Dentist", "Specialty", "Country/City", "Bookings", "Revenue", "Rating", "RDV Score", "Growth"].map((h) => (
                <th key={h} className="whitespace-nowrap px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {topDentists.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-sm text-gray-400 font-semibold">
                  No dentist revenue recorded
                </td>
              </tr>
            ) : (
              topDentists.map((d) => (
                <tr key={d.rank} className="transition-colors hover:bg-gray-50/60">
                  <td className="px-4 py-3.5">
                    <span className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold",
                      d.rank === 1 ? "bg-accent/10 text-accent/95" :
                        d.rank === 2 ? "bg-gray-200 text-gray-600" :
                          d.rank === 3 ? "bg-orange-100 text-orange-600" :
                            "bg-gray-100 text-gray-500"
                    )}>
                      {d.rank}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <Avatar initials={d.initials} color={d.avatarColor} size="sm" />
                      <p className="text-sm font-bold text-text">{d.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-500">{d.specialty}</td>
                  <td className="px-4 py-3.5">
                    <span className="flex items-center gap-1 text-sm text-gray-500">
                      <MapPin className="h-3 w-3 shrink-0 text-gray-300" /> {d.country}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-sm font-medium text-gray-700">{fmtNum(d.bookings)}</td>
                  <td className="px-4 py-3.5 text-sm font-bold text-text">{fmt(d.revenue)}</td>
                  <td className="px-4 py-3.5">
                    <span className="flex items-center gap-1 text-sm font-semibold text-accent">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {d.rating}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1 rounded-full border border-sky-100 bg-sky-50 px-2.5 py-0.5 text-xs font-bold text-sky-700">
                      {d.rdvScore}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-success-700">
                      <ArrowUpRight className="h-3.5 w-3.5" /> +{d.growthPct}%
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
