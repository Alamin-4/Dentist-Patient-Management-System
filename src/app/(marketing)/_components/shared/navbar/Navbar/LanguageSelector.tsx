"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Language {
    code: string;
    name: string;
    flag: string;
}

const languages: Language[] = [
    { code: "EN", name: "English (US)", flag: "/images/flags/united-states.png" },
    { code: "FR", name: "French", flag: "/images/flags/france.png" },
    { code: "DE", name: "German", flag: "/images/flags/germany.png" },
    { code: "AR", name: "Arabic", flag: "/images/flags/arabic.png" },
    { code: "ES", name: "Spanish", flag: "/images/flags/spain.png" },
    { code: "TR", name: "Turkish", flag: "/images/flags/turkey.png" },
    { code: "AL", name: "Albanian", flag: "/images/flags/albania.png" },
    { code: "PT", name: "Portuguese", flag: "/images/flags/portuges.png" },
];

interface LanguageSelectorProps {
    variant?: "desktop" | "mobile";
    onSelect?: (lang: Language) => void;
    onClose?: () => void;
}

export default function LanguageSelector({
    variant = "desktop",
    onSelect,
    onClose,
}: LanguageSelectorProps) {
    const [selectedLang, setSelectedLang] = useState<Language>(languages[0]);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleSelect = (lang: Language) => {
        setSelectedLang(lang);
        onSelect?.(lang);

        // Mobile এ collapse করুন, কিন্তু Sheet close করবেন না
        if (variant === "mobile") {
            setIsExpanded(false);
        } else {
            onClose?.();
        }
    };

    // ── MOBILE: Collapsible Accordion Pattern ──────────────────────────────
    if (variant === "mobile") {
        return (
            <div className="w-full">
                {/* Trigger Button */}
                <button
                    type="button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#10436B]/20 focus:border-[#10436B] transition-all"
                >
                    <div className="flex items-center gap-3">
                        <Image
                            src={selectedLang.flag}
                            alt={selectedLang.name}
                            width={24}
                            height={24}
                            className="rounded-sm"
                        />
                        <span className="text-sm font-semibold text-gray-700">
                            {selectedLang.name}
                        </span>
                    </div>
                    <ChevronDown
                        size={18}
                        className={cn(
                            "text-gray-400 transition-transform duration-200",
                            isExpanded && "rotate-180"
                        )}
                    />
                </button>

                {/* Expandable Content - Inside Sheet, no portal issues! */}
                <div
                    className={cn(
                        "overflow-hidden transition-all duration-300 ease-in-out",
                        isExpanded ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"
                    )}
                >
                    <div className="flex flex-col gap-1 p-2 bg-gray-50/50 rounded-lg border border-gray-100">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                type="button"
                                onClick={() => handleSelect(lang)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all",
                                    selectedLang.code === lang.code
                                        ? "bg-white text-[#10436B] font-semibold shadow-sm border border-[#10436B]/20"
                                        : "text-gray-700 hover:bg-white hover:shadow-sm"
                                )}
                            >
                                <Image
                                    src={lang.flag}
                                    alt={lang.name}
                                    width={22}
                                    height={22}
                                    className="rounded-sm"
                                />
                                <span className="flex-1 text-left">{lang.name}</span>
                                {selectedLang.code === lang.code && (
                                    <Check size={16} className="text-[#10436B]" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // ── DESKTOP: DropdownMenu (stays same) ─────────────────────────────────
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-gray-50 focus:outline-none transition-colors border border-transparent hover:border-gray-100">
                <Image
                    src={selectedLang.flag}
                    alt={selectedLang.name}
                    width={20}
                    height={20}
                    className="rounded-sm"
                />
                <span className="text-[15px] font-semibold text-gray-700">
                    {selectedLang.code}
                </span>
                <ChevronDown size={14} className="text-gray-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-44 bg-white border border-gray-100 shadow-xl rounded-lg p-1.5 mt-1"
            >
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => handleSelect(lang)}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors focus:bg-gray-50 focus:outline-none",
                            selectedLang.code === lang.code &&
                            "bg-blue-50/50 text-[#10436B] font-semibold",
                        )}
                    >
                        <Image
                            src={lang.flag}
                            alt={lang.name}
                            width={20}
                            height={20}
                            className="rounded-sm"
                        />
                        <span>{lang.name}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}