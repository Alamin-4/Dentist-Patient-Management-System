"use client";

import { ShieldOff, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface ListBulkActionsProps {
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
}

export function ListBulkActions({
  selectedIds,
  setSelectedIds,
}: ListBulkActionsProps) {
  if (selectedIds.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-6 rounded-full border border-gray-200 bg-text px-6 py-3.5 shadow-2xl text-white animate-fade-in-up">
      <span className="text-sm font-medium">
        {selectedIds.length} selected
      </span>
      <div className="h-4 w-px bg-gray-700" />
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            toast.success(`Suspended ${selectedIds.length} dentists`);
            setSelectedIds([]);
          }}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold hover:bg-white/10 transition-colors"
        >
          <ShieldOff className="h-3.5 w-3.5" />
          Suspend
        </button>
        <button
          onClick={() => {
            toast.success(`Deleted ${selectedIds.length} dentists`);
            setSelectedIds([]);
          }}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </button>
        <button
          onClick={() => setSelectedIds([])}
          className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold hover:bg-white/20 transition-colors"
        >
          Clear selection
        </button>
      </div>
    </div>
  );
}
