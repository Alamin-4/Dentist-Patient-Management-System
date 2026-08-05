import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";

/**
 * Shared dashboard loading fallback (dentist + patient portals).
 * Renders the full Sidebar + Navbar + content chrome skeleton.
 * Shown during route transitions inside /(dashboard) before a closer
 * loading.tsx (e.g. /dentist/loading.tsx) takes over.
 */
export default function DashboardLoading() {
  return <DashboardSkeleton />;
}
