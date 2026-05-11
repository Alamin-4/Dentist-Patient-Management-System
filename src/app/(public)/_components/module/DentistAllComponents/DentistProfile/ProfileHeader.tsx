import { ClipboardCheck, Star, User } from "lucide-react";

export default function ProfileHeader() {
  const tabs = [
    { name: "Overview", icon: User, active: true },
    { name: "Review & Ratings", icon: Star, active: false },
    {
      name: "Clinical Protocols & Verification",
      icon: ClipboardCheck,
      active: false,
    },
  ];

  return (
    <div className="flex items-center gap-8 rounded-xl border border-slate-100 bg-white p-1 px-4 shadow-sm">
      {tabs.map((tab) => (
        <button
          key={tab.name}
          className={`flex items-center gap-2 border-b-4 py-4 text-sm font-bold transition-all ${
            tab.active
              ? "border-[#003366] text-[#003366]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <tab.icon
            className={`size-4 ${tab.active ? "text-[#003366]" : ""}`}
          />
          {tab.name}
        </button>
      ))}
    </div>
  );
}
