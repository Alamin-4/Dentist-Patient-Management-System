// AdminActionsSidebar.tsx
import { Pencil, ShieldOff, Trash2 } from "lucide-react";

export function AdminActionsSidebar() {
    return (
        <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
            <p className="mb-3 text-sm font-bold text-[#1A1A2E]">Admin actions</p>
            <div className="flex flex-col gap-2">
                <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                    <Pencil className="h-4 w-4 text-gray-400" />
                    Edit profile
                </button>
                <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-amber-600 transition-colors hover:bg-amber-50">
                    <ShieldOff className="h-4 w-4" />
                    Suspend account
                </button>
                <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                    Delete account
                </button>
            </div>
        </div>
    );
}