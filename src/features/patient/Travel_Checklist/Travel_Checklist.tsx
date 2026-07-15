"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export default function TravelChecklistPageComponent() {
  const [beforeItems, setBeforeItems] = useState<ChecklistItem[]>([
    {
      id: "b1",
      text: "Confirm travel insurance covers dental procedures abroad",
      completed: true,
    },
    {
      id: "b2",
      text: "Share your treatment plan with your home dentist",
      completed: true,
    },
    {
      id: "b3",
      text: "Arrange accommodation within 15 minutes of the clinic in Cancun",
      completed: true,
    },
    {
      id: "b4",
      text: "Download all documents from your Document Vault",
      completed: true,
    },
    { id: "b5", text: "Save your arrival code: 7429", completed: true },
    {
      id: "b6",
      text: "Confirm your consultation video link is working",
      completed: false,
    },
    {
      id: "b7",
      text: "Pack any recent X-rays or dental records",
      completed: false,
    },
  ]);

  const [afterItems, setAfterItems] = useState<ChecklistItem[]>([
    { id: "a1", text: "Upload your after photo", completed: false },
    { id: "a2", text: "Leave a review for Dr. Eliza Mick", completed: false },
    { id: "a3", text: "Share your results with friends", completed: false },
    {
      id: "a4",
      text: "Schedule a follow-up with your home dentist at 3 months",
      completed: false,
    },
    {
      id: "a5",
      text: "Download your Treatment Completion Certificate",
      completed: false,
    },
  ]);

  const toggleItem = (id: string, section: "before" | "after") => {
    const setter = section === "before" ? setBeforeItems : setAfterItems;
    setter((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item,
      ),
    );
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-[#1A1A2E] mb-10">
        Travel Checklist
      </h1>

      {/* Before you travel Section */}
      <div className="bg-white rounded-lg border border-slate-100 p-8 shadow-sm">
        <h2 className="text-xl font-bold text-[#1A1A2E] mb-8">
          Before you travel
        </h2>
        <div className="space-y-5">
          {beforeItems.map((item) => (
            <CheckRow
              key={item.id}
              item={item}
              onToggle={() => toggleItem(item.id, "before")}
            />
          ))}
        </div>
      </div>

      {/* After you travel Section */}
      <div className="bg-white rounded-lg border border-slate-100 p-8 shadow-sm">
        <h2 className="text-xl font-bold text-[#1A1A2E] mb-8">
          After you travel
        </h2>
        <div className="space-y-5">
          {afterItems.map((item) => (
            <CheckRow
              key={item.id}
              item={item}
              onToggle={() => toggleItem(item.id, "after")}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const CheckRow = ({
  item,
  onToggle,
}: {
  item: ChecklistItem;
  onToggle: () => void;
}) => (
  <div
    className="flex items-start gap-4 cursor-pointer group"
    onClick={onToggle}
  >
    <div
      className={cn(
        "mt-0.5 size-5 rounded border-2 flex items-center justify-center transition-all",
        item.completed
          ? "bg-[#0F3659] border-[#0F3659]"
          : "border-slate-300 bg-white group-hover:border-[#0F3659]",
      )}
    >
      {item.completed && <Check className="size-3.5 text-white stroke-3" />}
    </div>
    <span
      className={cn(
        "text-base md:text-lg font-medium transition-colors",
        item.completed
          ? "text-slate-400 line-through decoration-slate-400"
          : "text-[#475569]",
      )}
    >
      {item.text}
    </span>
  </div>
);
