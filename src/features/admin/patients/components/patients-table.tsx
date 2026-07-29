import { PatientRow } from "./patient-row";
import { Patient } from "./types";


interface Props { pageData: Patient[]; isLoading?: boolean; onRowClick: (id: string) => void; }

export function PatientsTable({ pageData, isLoading, onRowClick }: Props) {
    const headers = ["Patient", "Phone", "City", "Status", "Total bookings", "Last booking", "Joined", ""];

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full">
                <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/40">
                        {headers.map((h, i) => (
                            <th key={i} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {isLoading ? (
                        Array.from({ length: 8 }).map((_, rowIdx) => (
                            <tr key={rowIdx} className="animate-pulse">
                                <td className="px-4 py-3.5">
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 rounded-full bg-slate-200" />
                                        <div className="space-y-1.5">
                                            <div className="h-4 w-28 rounded bg-slate-200" />
                                            <div className="h-3 w-36 rounded bg-slate-100" />
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3.5">
                                    <div className="h-4 w-24 rounded bg-slate-150" />
                                </td>
                                <td className="px-4 py-3.5">
                                    <div className="h-4 w-16 rounded bg-slate-100" />
                                </td>
                                <td className="px-4 py-3.5">
                                    <div className="h-5.5 w-16 rounded-full bg-slate-100" />
                                </td>
                                <td className="px-4 py-3.5">
                                    <div className="h-4 w-8 rounded bg-slate-100" />
                                </td>
                                <td className="px-4 py-3.5">
                                    <div className="h-4 w-20 rounded bg-slate-100" />
                                </td>
                                <td className="px-4 py-3.5">
                                    <div className="h-4 w-16 rounded bg-slate-100" />
                                </td>
                                <td className="px-4 py-3.5">
                                    <div className="h-7 w-7 rounded bg-slate-50" />
                                </td>
                            </tr>
                        ))
                    ) : pageData.length === 0 ? (
                        <tr><td colSpan={headers.length} className="py-16 text-center text-sm text-gray-400">No patients found</td></tr>
                    ) : (
                        pageData.map((patient) => <PatientRow key={patient.id} patient={patient} onClick={onRowClick} />)
                    )}
                </tbody>
            </table>
        </div>
    );
}