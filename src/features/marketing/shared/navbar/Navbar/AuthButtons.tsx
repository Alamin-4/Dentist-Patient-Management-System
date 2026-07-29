"use client";

import { cn } from "@/lib/utils";

interface AuthButtonsProps {
    onSignInClick: () => void;
    onSignUpClick: () => void;
    variant?: "desktop" | "mobile";
    onClose?: () => void;
}

export default function AuthButtons({
    onSignInClick,
    onSignUpClick,
    variant = "desktop",
    onClose,
}: AuthButtonsProps) {

    const handleClick = (action: () => void) => {
        onClose?.();
        action();
    };

    if (variant === "mobile") {
        return (
            <div className="flex flex-col gap-3">
                <button
                    onClick={() => handleClick(onSignInClick)}
                    className="w-full rounded-lg border border-gray-200 py-3 text-center font-semibold text-primary hover:bg-gray-50 transition-colors cursor-pointer"
                >
                    Login
                </button>

                <button
                    onClick={() => handleClick(onSignUpClick)}
                    className="w-full rounded-lg bg-primary py-3 text-center font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer text-sm"
                >
                    Sign Up
                </button>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-4">
            <button
                onClick={onSignInClick}
                className="text-sm lg:text-base font-semibold text-primary hover:text-[#0b2d49] transition-colors cursor-pointer"
            >
                Login
            </button>

            <button
                onClick={onSignUpClick}
                className="rounded-lg bg-primary px-2.5 py-1.5 lg:px-6 lg:py-2.5 text-xs md:text-sm font-semibold text-white transition-opacity hover:opacity-90 shadow-sm cursor-pointer"
            >
                Sign Up
            </button>
        </div>
    );
}