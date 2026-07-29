import React, { useState } from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";
import { User, AlertCircle } from "lucide-react";

interface S3ImageProps extends Omit<ImageProps, "onError"> {
  fallbackType?: "avatar" | "document" | "generic";
  skeletonClassName?: string;
}

export function S3Image({
  src,
  alt,
  className,
  fallbackType = "generic",
  skeletonClassName,
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  ...props
}: S3ImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setIsError(true);
  };

  // If there's an error or no source, render a clean fallback UI immediately
  if (isError || !src) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-slate-100 text-slate-400 border border-slate-200 rounded-full",
          props.fill ? "absolute inset-0 w-full h-full" : className
        )}
        style={{
          width: props.fill ? undefined : props.width,
          height: props.fill ? undefined : props.height,
        }}
      >
        {fallbackType === "avatar" ? (
          <User className="w-1/2 h-1/2 max-w-12 max-h-12 text-slate-400" />
        ) : (
          <AlertCircle className="w-1/2 h-1/2 max-w-6 max-h-6 text-slate-300" />
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        props.fill ? "absolute inset-0 w-full h-full" : className
      )}
      style={{
        width: props.fill ? undefined : props.width,
        height: props.fill ? undefined : props.height,
      }}
    >
      {/* Loading Skeleton */}
      {isLoading && (
        <div
          className={cn(
            "absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center",
            skeletonClassName
          )}
        >
          <div className="w-5 h-5 border-2 border-[#0F3659] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <Image
        src={src}
        alt={alt}
        className={cn(
          "transition-all duration-300",
          isLoading ? "opacity-0 scale-95" : "opacity-100 scale-100",
          className
        )}
        onLoadingComplete={handleLoadingComplete}
        onError={handleError}
        priority={priority}
        sizes={sizes}
        {...props}
      />
    </div>
  );
}
