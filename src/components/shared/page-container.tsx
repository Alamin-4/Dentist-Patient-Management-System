import React from "react";
import { cn } from "@/core/lib/utils";

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "dashboard" | "marketing";
  size?: "default" | "sm" | "lg" | "fluid";
  animate?: boolean;
  disablePadding?: boolean;
}

export function PageContainer({
  children,
  variant = "dashboard",
  size,
  animate = true,
  disablePadding,
  className,
  ...props
}: PageContainerProps) {
  const isDashboard = variant === "dashboard";

  const resolvedSize = size || (isDashboard ? "fluid" : "default");

  const shouldPadding = disablePadding ?? !isDashboard;

  const sizeClasses = {
    sm: "max-w-4xl mx-auto",
    default: "max-w-7xl mx-auto",
    lg: "max-w-[90rem] mx-auto",
    fluid: "w-full",
  };

  const paddingClasses = shouldPadding
    ? "px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-10"
    : "";

  return (
    <div
      className={cn(
        "w-full",
        paddingClasses,
        sizeClasses[resolvedSize],
        animate && "animate-in fade-in slide-in-from-bottom-1 duration-300 ease-out",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
