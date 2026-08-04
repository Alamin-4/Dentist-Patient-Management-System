"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Can } from "@/core/hooks/auth/usePermissions";
import { cn } from "@/lib/utils";

export interface ClaimProfileButtonProps {
  slug: string;
  isClaimed?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg" | "default";
  fullWidth?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function ClaimProfileButton({
  slug,
  isClaimed = false,
  className,
  size = "default",
  fullWidth = false,
  onClick,
}: ClaimProfileButtonProps) {
  const router = useRouter();

  const handleClaim = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (onClick) {
      onClick(e);
    } else if (slug) {
      router.push(`/find-dentists/${slug}/claim`);
    }
  };

  if (isClaimed) {
    return (
      <Button
        disabled
        variant="secondary"
        className={cn(
          "font-bold text-white bg-accent cursor-not-allowed opacity-70 rounded-lg",
          size === "sm" ? "h-9 px-3 text-xs" : "h-10 px-4 text-xs sm:text-sm",
          fullWidth && "w-full flex-1",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        Claimed
      </Button>
    );
  }

  return (
    <Can action="claim_dentist_profile">
      <Button
        variant="secondary"
        className={cn(
          "font-bold text-white bg-accent hover:bg-accent/90 cursor-pointer transition-all shadow-xs rounded-lg",
          size === "sm" ? "h-9 px-3.5 text-xs" : "h-10 sm:h-11 px-4 text-xs sm:text-sm",
          fullWidth && "w-full flex-1",
          className
        )}
        onClick={handleClaim}
      >
        Claim Profile
      </Button>
    </Can>
  );
}

export default ClaimProfileButton;
