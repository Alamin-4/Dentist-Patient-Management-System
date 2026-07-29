"use client";

interface GeographyRow {
  country: string;
  flag: string;
  dentists: number;
  bookings: number;
  revenue: number;
  share: number;
}

interface GeographyTableProps {
  geographyData: GeographyRow[];
}

const fmt = (n: number) => n >= 1000 ? `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `$${n.toLocaleString()}`;
const fmtNum = (n: number) => n.toLocaleString();

export function GeographyTable({ geographyData }: GeographyTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-gray-100 px-5 py-4">
        <div>
          <h3 className="text-sm font-bold text-text">Revenue by Country</h3>
          <p className="mt-0.5 text-xs text-gray-400">Dentist locations · All-time</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-50 bg-gray-50/50">
              {["Country", "Dentists", "Bookings", "Revenue", "Share"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {geographyData.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-sm text-gray-400 font-semibold">
                  No booking data found
                </td>
              </tr>
            ) : (
              geographyData.map((row) => (
                <tr key={row.country} className="transition-colors hover:bg-gray-50/60">
                  <td className="px-5 py-3">
                    <span className="flex items-center gap-2 text-sm font-semibold text-text">
                      <span className="text-base">{row.flag}</span>
                      {row.country}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-600">{fmtNum(row.dentists)}</td>
                  <td className="px-5 py-3 text-sm text-gray-600">{fmtNum(row.bookings)}</td>
                  <td className="px-5 py-3 text-sm font-semibold text-text">{fmt(row.revenue)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-gray-100">
                        <div className="h-full rounded-full bg-text" style={{ width: `${row.share}%` }} />
                      </div>
                      <span className="text-xs font-medium text-gray-500">{row.share}%</span>
                    </div>
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
