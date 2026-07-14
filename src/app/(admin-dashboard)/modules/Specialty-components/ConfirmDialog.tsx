"use client";

import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
}

export function ConfirmDialog({
    open,
    onClose,
    onConfirm,
    title = "Are you sure?",
    description = "This action cannot be undone.",
    confirmText = "Delete",
    cancelText = "Cancel",
    isLoading = false,
}: ConfirmDialogProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop (Blur effect) */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative z-10 w-full max-w-md rounded-lg border border-gray-100 bg-white p-6 shadow-xl animate-in fade-in zoom-in duration-200">
                <div className="flex items-start gap-4">
                    {/* Warning Icon */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                    </div>

                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-[#1A1A2E]">{title}</h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{description}</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="inline-flex h-9 items-center rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="inline-flex h-9 items-center rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                    >
                        {isLoading ? "Deleting..." : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}