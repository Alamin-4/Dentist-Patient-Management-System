import { AdminDashboardSkeleton } from "@/components/skeletons/AdminDashboardSkeleton";

/**
 * Admin dashboard loading fallback.
 * Renders the full Admin Sidebar + Admin Navbar + content chrome skeleton.
 * Shown during route transitions inside /(admin-dashboard) before the
 * page content resolves.
 */
export default function AdminDashboardLoading() {
  return <AdminDashboardSkeleton />;
}
