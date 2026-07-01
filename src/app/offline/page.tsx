"use client";

import React, { useState, useEffect } from "react";
import { WifiOff, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function OfflinePage() {
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Clear status message after a few seconds
  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  const handleRetry = async () => {
    setIsReconnecting(true);
    setStatusMessage(null);

    // Give a realistic slight delay for the reconnection animation
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (typeof window !== "undefined") {
      if (navigator.onLine) {
        // Double check by fetching a lightweight resource
        try {
          const res = await fetch("/favicon.ico", { method: "HEAD", cache: "no-store" });
          if (res.ok) {
            window.location.reload();
            return;
          }
        } catch (e) {
          // Fetch failed, still offline
        }
      }
      setIsReconnecting(false);
      setStatusMessage("Still offline. Please check your internet connection.");
    }
  };

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md text-center">
        {/* Brand Logo */}
        <div className="mb-8 flex justify-center">
          <Image
            src="/logos/mainlogo.png"
            alt="RatedDocs Logo"
            width={180}
            height={50}
            priority
            className="h-12 w-auto object-contain dark:hidden"
          />
          <Image
            src="/logos/whitelogo.png"
            alt="RatedDocs Logo"
            width={180}
            height={50}
            priority
            className="hidden h-12 w-auto object-contain dark:block"
          />
        </div>

        {/* Offline Card */}
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-800 dark:bg-card">
          {/* Decorative Background Gradient */}
          <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-sky-100 opacity-50 blur-2xl dark:bg-sky-900/20" />
          <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-gold-100 opacity-50 blur-2xl dark:bg-gold-900/20" />

          <div className="relative">
            {/* Wifi Off Icon */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive-50 dark:bg-destructive-900/20">
              <WifiOff className="h-8 w-8 text-destructive-500" />
            </div>

            <h1 className="mt-6 text-2xl font-bold tracking-tight text-foreground">
              You are offline
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              It looks like you aren&apos;t connected to the internet. We can&apos;t load this page right now, but you can try again once your connection returns.
            </p>

            {/* Status Feedback */}
            {statusMessage && (
              <div className="mt-4 rounded-lg bg-warning-50 p-3 text-xs text-warning-700 border border-warning-100 transition-all dark:bg-warning-900/20 dark:text-warning-300 dark:border-warning-900/30">
                {statusMessage}
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col gap-3">
              <button
                onClick={handleRetry}
                disabled={isReconnecting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-navy-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-navy-700 active:scale-[0.98] disabled:opacity-50 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/95"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isReconnecting ? "animate-spin" : ""}`}
                />
                {isReconnecting ? "Checking connection..." : "Try Again"}
              </button>

              <Link
                href="/"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-foreground hover:bg-gray-50 active:scale-[0.98] dark:border-gray-800 dark:bg-card dark:hover:bg-gray-800/40"
              >
                <Home className="h-4 w-4 text-muted-foreground" />
                Go to Homepage
              </Link>
            </div>
          </div>
        </div>

        {/* Brand Footer */}
        <p className="mt-8 text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} RatedDocs. All rights reserved.
        </p>
      </div>
    </div>
  );
}
