import React from "react";
import { cn } from "@/core/lib/utils";

interface SectionHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  size?: "sm" | "md" | "lg";
  divider?: boolean;
}

export function SectionHeader({
  title,
  description,
  actions,
  align = "left",
  className,
  size = "md",
  divider = false,
}: SectionHeaderProps) {
  const titleSizes = {
    sm: "text-sm md:text-base font-bold",
    md: "text-base md:text-lg font-bold",
    lg: "text-lg md:text-xl font-extrabold",
  };

  const descSizes = {
    sm: "text-[10px] md:text-xs",
    md: "text-xs md:text-sm",
    lg: "text-sm md:text-base",
  };

  return (
    <div
      className={cn(
        "flex gap-2 flex-row items-center justify-between mb-5",
        divider && "pb-4 border-b border-gray-100",
        align === "center" && "text-center justify-center",
        className
      )}
    >
      <div className="space-y-1">
        <h3 className={cn("text-text leading-snug", titleSizes[size])}>
          {title}
        </h3>
        {description && (
          <p className={cn("text-sec-text font-medium leading-normal", descSizes[size])}>
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className={cn(
          "flex flex-wrap items-center gap-2 sm:justify-end shrink-0",
          align === "center" && "justify-center"
        )}>
          {actions}
        </div>
      )}
    </div>
  );
}
