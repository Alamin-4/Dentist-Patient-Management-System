import React from "react";
import { cn } from "@/core/lib/utils";

interface SectionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "muted" | "bordered";
  hoverEffect?: boolean;
}

export function SectionCard({
  children,
  variant = "default",
  hoverEffect = false,
  className,
  ...props
}: SectionCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border shadow-xs transition-all duration-300 p-5 md:p-6 lg:p-8",
        variant === "default" && "bg-white border-border",
        variant === "muted" && "bg-slate-50 border-border/80",
        variant === "bordered" && "bg-transparent border-border/80 border-dashed",
        hoverEffect && "hover:shadow-md hover:border-brand-medium-navy/30 hover:-translate-y-0.5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
