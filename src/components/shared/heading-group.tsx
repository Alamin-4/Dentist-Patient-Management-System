import React from "react";
import { cn } from "@/core/lib/utils";

interface HeadingGroupProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function HeadingGroup({
  title,
  description,
  actions,
  align = "left",
  className,
  size = "md",
}: HeadingGroupProps) {
  const titleSizes = {
    sm: "text-lg md:text-xl font-bold tracking-tight",
    md: "text-2xl md:text-3xl font-bold tracking-tight",
    lg: "text-3xl md:text-4xl font-extrabold tracking-tight",
  };

  const descSizes = {
    sm: "text-xs md:text-sm",
    md: "text-sm md:text-base",
    lg: "text-base md:text-lg",
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 md:mb-8",
        align === "center" && "text-center justify-center",
        className
      )}
    >
      <div className="space-y-1.5 md:space-y-2">
        <h1 className={cn("text-text leading-tight", titleSizes[size])}>
          {title}
        </h1>
        {description && (
          <p className={cn("text-sec-text font-medium leading-relaxed max-w-3xl", descSizes[size])}>
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className={cn(
          "flex flex-wrap items-center gap-2.5 sm:justify-end shrink-0",
          align === "center" && "justify-center"
        )}>
          {actions}
        </div>
      )}
    </div>
  );
}
