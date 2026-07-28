// patient-row.tsx
import { ChevronRight } from "lucide-react";
import { Patient } from "./types";
import { Avatar } from "./avatar";
import { StatusBadge } from "./status-badge";
import Image from "next/image";

interface Props { patient: Patient; onClick: (id: string) => void; }

export function PatientRow({ patient, onClick }: Props) {
    return (
        <tr onClick={() => onClick(patient.id)} className="cursor-pointer transition-colors hover:bg-gray-50/80">
            <td className="px-4 py-3.5">
                <div className="flex items-center gap-3">
                    {/* Show profile photo if available, otherwise fall back to initials avatar */}
                    {patient.image ? (
                        <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full border border-gray-100">
                            <Image
                                src={patient.image}
                                alt={patient.name}
                                height={36}
                                width={36}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    ) : (
                        <Avatar initials={patient.initials} color={patient.avatar_color} />
                    )}
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-text">{patient.name}</p>
                        <p className="truncate text-xs text-gray-400">{patient.email}</p>
                    </div>
                </div>
            </td>
            <td className="px-4 py-3.5 text-sm text-gray-600">{patient.phone || "—"}</td>
            <td className="px-4 py-3.5 text-sm text-gray-600">{patient.city || "—"}</td>
            <td className="px-4 py-3.5"><StatusBadge status={patient.status} /></td>
            <td className="px-4 py-3.5 text-sm text-gray-600">{patient.total_bookings}</td>
            <td className="px-4 py-3.5 text-sm text-gray-600">{patient.last_booking}</td>
            <td className="px-4 py-3.5 text-sm text-gray-600">{patient.joined}</td>
            <td className="px-4 py-3.5"><ChevronRight className="h-4 w-4 text-gray-300" /></td>
        </tr>
    );
}