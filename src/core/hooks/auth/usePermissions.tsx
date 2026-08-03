"use client";

import { ReactNode } from "react";
import { useMe, hasSessionCookie } from "./useAuth";
import { PermissionAction, PERMISSION_MATRIX, RoleOrGuest } from "@/core/config/permissions";

export type RoleOrState = RoleOrGuest | "LOADING";

/**
 * Returns the current user's role, 'GUEST' if unauthenticated, or 'LOADING' if session is hydrating.
 */
export function useCurrentRole(): RoleOrState {
  const { user, isLoading, isPending } = useMe();

  if ((isLoading || isPending) && hasSessionCookie()) {
    return "LOADING";
  }

  if (!user || !user.role) {
    return "GUEST";
  }
  return user.role as RoleOrGuest;
}

export function useCan(action: PermissionAction): boolean {
  const role = useCurrentRole();
  if (role === "LOADING") {
    return false;
  }
  const allowedRoles = PERMISSION_MATRIX[action];
  if (!allowedRoles) return false;
  return allowedRoles.includes(role);
}

interface CanProps {
  action: PermissionAction;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Declarative component for RBAC rendering.
 * Completely unmounts children from the DOM (returns null or optional fallback)
 * if the current user does not have permission or session is still resolving.
 */
export function Can({ action, children, fallback = null }: CanProps) {
  const canPerform = useCan(action);
  if (!canPerform) {
    return fallback ? <>{fallback}</> : null;
  }
  return <>{children}</>;
}
