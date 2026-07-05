import Image from "next/image";
import { MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Dentist } from "@/app/(marketing)/_components/module/DentistAllComponents/types";

interface DoctorProfileHeaderProps {
    dentist: Dentist;
}

const estimateLow = (price: number) => Math.round((price * 2.2) / 20) * 20;

export function DoctorProfileHeader({ dentist }: DoctorProfileHeaderProps) {
    const location = dentist.location.fullAddress ?? dentist.location.city ?? "Location unavailable";

    return (
        <div className="flex items-start justify-between gap-4 p-6 border-b border-gray-100">
            <div className="flex items-center gap-4">
                <Avatar className="size-16 border-2 border-gray-100">
                    <AvatarImage src={dentist.image ?? "/images/man-avatar.png"} alt={dentist.name} />
                    <AvatarFallback className="text-lg font-bold bg-gray-100 text-gray-500">
                        {dentist.name.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="font-bold text-base text-gray-900">{dentist.name}</h3>
                    <p className="text-sm text-gray-500">{dentist.specialty}</p>
                    <p className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                        <MapPin className="size-3.5 shrink-0" />
                        <span className="truncate max-w-[200px]">{location}</span>
                    </p>
                </div>
            </div>

            <div className="text-right shrink-0 space-y-1">
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                    Est. Budget
                </p>
                <p className="text-xl font-black text-[#113254]">
                    ${estimateLow(dentist.price).toLocaleString()}
                </p>
                <Badge variant="secondary" className="bg-blue-50 text-[#113254] border-blue-100 text-[10px] font-semibold">
                    96% Accuracy
                </Badge>
            </div>
        </div>
    );
}