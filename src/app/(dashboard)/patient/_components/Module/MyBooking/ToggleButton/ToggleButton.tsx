"use client";

import { useStateContext } from "@/providers/StateProvider";

export default function ToggleButton() {
  const { activeTab, setActiveTab } = useStateContext();
  return (
    <div className="flex flex-row gap-4 lg:gap-6 border-b border-gray-200 mt-6">
      <button
        className={`px-4 lg:px-12 border-b-3 py-3 ${activeTab === "estimate" ? "border-[#0E3E65]" : "border-transparent"}`}
        onClick={() => setActiveTab("estimate")}
      >
        In progress
      </button>
      <button
        className={`px-4 lg:px-12 border-b-3 py-3 ${activeTab === "treatment" ? "border-[#0E3E65]" : "border-transparent"}`}
        onClick={() => setActiveTab("treatment")}
      >
        Completed
      </button>
      <button
        className={`px-4 lg:px-12 border-b-3 py-3 ${activeTab === "treatment" ? "border-[#0E3E65]" : "border-transparent"}`}
        onClick={() => setActiveTab("treatment")}
      >
        Rejected
      </button>
    </div>
  );
}

