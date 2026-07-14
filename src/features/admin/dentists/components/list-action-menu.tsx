"use client";

import { useState } from "react";
import { MoreHorizontal, Eye, ShieldOff, Trash2 } from "lucide-react";
import { type Dentist } from "../utils/dentist-types";

export function ActionMenu({
  dentist,
  onViewProfile,
  onSuspend,
  onDelete,
}: {
  dentist: Dentist;
  onViewProfile: () => void;
  onSuspend: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
          />
          <div className="absolute right-0 z-20 mt-1 w-44 rounded-lg border border-gray-100 bg-white py-1 shadow-lg">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                onViewProfile();
              }}
              className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Eye className="h-4 w-4 text-gray-400" />
              View profile
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                onSuspend();
              }}
              className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
            >
              <ShieldOff className="h-4 w-4 text-gray-400" />
              Suspend
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                onDelete();
              }}
              className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-500 transition-colors hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}
