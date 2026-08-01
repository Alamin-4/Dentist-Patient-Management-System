import React from "react";
import { cn } from "@/core/lib/utils";

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: "default" | "sm" | "lg" | "fluid";
  animate?: boolean;
}

export function PageContainer({
  children,
  size = "default",
  animate = true,
  className,
  ...props
}: PageContainerProps) {
  const sizeClasses = {
    sm: "max-w-4xl mx-auto",
    default: "max-w-7xl mx-auto",
    lg: "max-w-[90rem] mx-auto",
    fluid: "w-full",
  };

  return (
    <div
      className={cn(
        "w-full px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-10",
        sizeClasses[size],
        animate && "animate-in fade-in slide-in-from-bottom-1 duration-300 ease-out",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
