import { PatientRow } from "./patient-row";
import { Patient } from "./types";


interface Props { pageData: Patient[]; onRowClick: (id: string) => void; }

export function PatientsTable({ pageData, onRowClick }: Props) {
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
                    {pageData.length === 0 ? (
                        <tr><td colSpan={headers.length} className="py-16 text-center text-sm text-gray-400">No patients found</td></tr>
                    ) : (
                        pageData.map((patient) => <PatientRow key={patient.id} patient={patient} onClick={onRowClick} />)
                    )}
                </tbody>
            </table>
        </div>
    );
}