import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export const TIMEZONES = [
    "Eastern Time (EST, UTC-5)",
    "Central Time (CST, UTC-6)",
    "Mountain Time (MST, UTC-7)",
    "Pacific Time (PST, UTC-8)",
    "Greenwich Mean Time (GMT, UTC+0)",
    "Central European Time (CET, UTC+1)",
    "Mexico City Time (CST, UTC-6)",
    "Australia Eastern (AEST, UTC+10)",
    "GMT+6 Time Zone (BST, GMT+6)",
];

export function getDefaultTimezone(): string {
    try {
        const offsetMinutes = -new Date().getTimezoneOffset();
        const offsetHours = offsetMinutes / 60;
        const sign = offsetHours >= 0 ? "+" : "-";
        const absoluteHours = Math.abs(offsetHours);
        const formattedOffset = `${sign}${absoluteHours}`;

        const matched = TIMEZONES.find((tz) =>
            tz.includes(`UTC${formattedOffset}`) ||
            tz.includes(`GMT${formattedOffset}`) ||
            tz.includes(`UTC${sign}0${absoluteHours}`) ||
            tz.includes(`GMT${sign}0${absoluteHours}`) ||
            (offsetHours === 0 && (tz.includes("UTC+0") || tz.includes("GMT+0") || tz.includes("UTC-0") || tz.includes("GMT-0")))
        );

        if (matched) return matched;
    } catch (e) {
        console.error("Failed to detect timezone", e);
    }
    return TIMEZONES[0];
}

interface TimezoneSelectorProps {
    value: string;
    onChange: (value: string) => void;
}

export function TimezoneSelector({ value, onChange }: TimezoneSelectorProps) {
    return (
        <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-700">Select Time Zone</p>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="w-full h-11 text-sm bg-white">
                    <SelectValue placeholder="Select Time Zone" />
                </SelectTrigger>
                <SelectContent>
                    {TIMEZONES.map((tz) => (
                        <SelectItem key={tz} value={tz}>
                            {tz}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}