import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
  retryText?: string;
}

export function ErrorState({
  title = "Failed to load data",
  message = "We encountered an unexpected error while retrieving your request. Please try again.",
  onRetry,
  className,
  retryText = "Retry",
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-3xl border border-dashed border-red-100 bg-red-50/30 p-8 text-center sm:p-12 animate-in fade-in duration-350 max-w-xl mx-auto my-8 shadow-sm",
        className
      )}
    >
      <div className="rounded-2xl bg-red-50 border border-red-100 p-4 text-red-500 shadow-sm">
        <AlertCircle className="h-7 w-7" />
      </div>
      <h3 className="mt-5 text-xl font-bold text-text">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-sec-text leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button
          onClick={onRetry}
          className="mt-6 h-11 px-6 rounded-xl bg-primary text-white hover:bg-primary/90 font-bold transition-all active:scale-98 shadow-md shadow-primary/10 cursor-pointer"
        >
          {retryText}
        </Button>
      )}
    </div>
  );
}
