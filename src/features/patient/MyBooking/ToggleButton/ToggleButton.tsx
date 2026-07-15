"use client";

interface TabOption {
  key: string;
  label: string;
  count?: number;
}

interface ToggleButtonProps {
  value: string;
  onChange: (value: string) => void;
  tabs: TabOption[];
}

export default function ToggleButton({ value, onChange, tabs }: ToggleButtonProps) {
  return (
    <div className="flex flex-wrap gap-6 border-b border-[#E5E7EB]">
      {tabs.map((tab) => {
        const isActive = value === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={`relative pb-3 px-2 lg:px-4 pt-2 text-[15px] font-semibold transition-all duration-150 outline-none select-none flex items-center gap-2 ${isActive ? "text-[#163E5C]" : "text-[#64748B] hover:text-slate-600"
              }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs font-semibold ${isActive ? "bg-[#163E5C] text-white" : "bg-gray-100 text-gray-500"
                }`}>
                {tab.count}
              </span>
            )}

            {isActive && (
              <div className="absolute bottom-0 left-0 h-0.75 w-full rounded-full bg-[#163E5C]" />
            )}
          </button>
        );
      })}
    </div>
  );
}
