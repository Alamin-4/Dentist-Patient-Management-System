"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Search, Home } from "lucide-react";

export default function DentistNotFound() {
    return (
        <div className="bg-white flex flex-col">

            <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-16 sm:py-24">

                {/* Heading & sub-text */}
                <div className="relative z-10 max-w-md space-y-3 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Dentist Profile Not Found
                    </h1>
                    <p className="text-base leading-relaxed text-gray-500">
                        Sorry, the dentist profile you are looking for does not exist, or has not been verified yet.
                    </p>
                </div>

                {/* CTA buttons */}
                <div className="relative z-10 mt-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-7 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 active:scale-[0.97] sm:w-auto"
                    >
                        <ArrowLeft className="size-4" />
                        Go back
                    </button>

                    <Link
                        href="/find-dentists"
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-7 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-[#0d3558] active:scale-[0.97] sm:w-auto"
                    >
                        <Search className="size-4" />
                        Find Verified Dentist
                    </Link>
                </div>


            </main>
        </div>
    );
}