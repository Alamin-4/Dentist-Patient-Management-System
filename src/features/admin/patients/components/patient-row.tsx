// patient-row.tsx
import { ChevronRight } from "lucide-react";
import { Patient } from "./types";
import { Avatar } from "./avatar";
import { StatusBadge } from "./status-badge";


interface Props { patient: Patient; onClick: (id: string) => void; }

export function PatientRow({ patient, onClick }: Props) {
    return (
        <tr onClick={() => onClick(patient.id)} className="cursor-pointer transition-colors hover:bg-gray-50/80">
            <td className="px-4 py-3.5">
                <div className="flex items-center gap-3">
                    <Avatar initials={patient.initials} color={patient.avatar_color} />
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#1A1A2E]">{patient.name}</p>
                        <p className="truncate text-xs text-gray-400">{patient.email}</p>
                    </div>
                </div>
            </td>
            <td className="px-4 py-3.5 text-sm text-gray-600">{patient.phone}</td>
            <td className="px-4 py-3.5 text-sm text-gray-600">{patient.city}</td>
            <td className="px-4 py-3.5"><StatusBadge status={patient.status} /></td>
            <td className="px-4 py-3.5 text-sm text-gray-600">{patient.total_bookings}</td>
            <td className="px-4 py-3.5 text-sm text-gray-600">{patient.last_booking}</td>
            <td className="px-4 py-3.5 text-sm text-gray-600">{patient.joined}</td>
            <td className="px-4 py-3.5"><ChevronRight className="h-4 w-4 text-gray-300" /></td>
        </tr>
    );
}