"use client";

interface TabOption {
  key: string;
  label: string;
}

interface ToggleButtonProps {
  value: string;
  onChange: (value: string) => void;
  tabs: TabOption[];
}

export default function ToggleButton({ value, onChange, tabs }: ToggleButtonProps) {
  return (
    <div className="flex flex-wrap gap-3 border-b border-[#E5E7EB]">
      {tabs.map((tab) => {
        const isActive = value === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={`relative -mb-px px-3 py-3 text-[14px] font-semibold transition-colors sm:px-6 ${
              isActive
                ? "border-b-2 border-[#113254] text-[#113254]"
                : "border-b-2 border-transparent text-[#9CA3AF] hover:text-[#6B7280]"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
