
import { cn } from "@/lib/utils"; // Assuming you have the shadcn 'cn' utility

interface TimeSlotPickerProps {
    slots: string[];
    selectedSlot: string;
    onSelect: (slot: string) => void;
}

export function TimeSlotPicker({ slots, selectedSlot, onSelect }: TimeSlotPickerProps) {
    return (
        <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-700">Select Time</p>

            {/* Changed to flex-wrap so users can see more slots at a glance */}
            <div className="flex flex-wrap gap-2">
                {slots.map((slot) => {
                    const isActive = selectedSlot === slot;
                    return (
                        <button
                            key={slot}
                            type="button"
                            onClick={() => onSelect(slot)}
                            className={cn(
                                "px-3 py-2 rounded-lg border text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#113254]/50 focus:ring-offset-1",
                                isActive
                                    ? "bg-[#113254] text-white border-[#113254] shadow-sm"
                                    : "bg-white text-gray-600 border-gray-200 hover:border-[#113254] hover:text-[#113254] hover:bg-gray-50"
                            )}
                        >
                            {slot}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}