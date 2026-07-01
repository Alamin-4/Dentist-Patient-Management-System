"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
    const pathname = usePathname();

    // Hide Get Started on auth pages
    const hideGetStarted = [
        "/admin-login",
        "/register-doctor",
        "/register-patient",
        "/contact-us",
        "/",
    ].includes(pathname);

    const handleClick = (action: () => void) => {
        onClose?.();
        action();
    };

    if (variant === "mobile") {
        return (
            <div className="flex flex-col gap-3">
                <button
                    onClick={() => handleClick(onSignInClick)}
                    className="w-full rounded-lg border border-gray-200 py-3 text-center font-semibold text-[#10436B] hover:bg-gray-50 transition-colors cursor-pointer"
                >
                    Sign In
                </button>

                {!hideGetStarted ? (
                    <button
                        onClick={() => handleClick(onSignUpClick)}
                        className="w-full rounded-lg bg-[#10436B] py-3 text-center font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer text-sm"
                    >
                        Get Started
                    </button>
                ) : (
                    <Link
                        href="/register-doctor"
                        onClick={onClose}
                        className="w-full rounded-lg bg-[#10436B] py-3 font-semibold text-white transition-opacity hover:opacity-90 text-center text-sm"
                    >
                        Join as a Doctor
                    </Link>
                )}
            </div>
        );
    }

    return (
        <div className="flex items-center gap-4">
            <button
                onClick={onSignInClick}
                className="text-sm lg:text-base font-semibold text-[#10436B] hover:text-[#0b2d49] transition-colors cursor-pointer"
            >
                Sign In
            </button>

            {!hideGetStarted ? (
                <button
                    onClick={onSignUpClick}
                    className="rounded-lg bg-[#10436B] px-2.5 py-1.5 lg:px-6 lg:py-2.5 text-xs md:text-sm font-semibold text-white transition-opacity hover:opacity-90 shadow-sm cursor-pointer"
                >
                    Get Started
                </button>
            ) : (
                <Link
                    href="/register-doctor"
                    className="hidden sm:block rounded-lg bg-[#10436B] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                    Join as a Doctor
                </Link>
            )}
        </div>
    );
}