"use client";

import { useEffect } from "react";

import { useMe } from "@/hooks/auth/useAuth";
import { AdminNavbar } from "@/app/modules/admin/layout/admin-navbar";
import { AdminSidebar } from "@/app/modules/admin/layout/admin-sidebar";
import { AdminMobileSidebarDrawer } from "@/app/modules/admin/layout/admin-mobile-sidebar-drawer";
import { SidebarProvider } from "@/context/sidebar-context";
import { UserRole } from "@/types/constants";
import { AdminDashboardSkeleton } from "@/components/skeletons/AdminDashboardSkeleton";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, isError } = useMe();


  useEffect(() => {
    if (!isLoading) {
      if (isError || !user || (user.role !== UserRole.ADMIN && user.role !== UserRole.SUPER_ADMIN)) {
        window.location.href = "/admin-login";
      }
    }
  }, [isLoading, isError, user]);

  if (isLoading) {
    return <AdminDashboardSkeleton />;
  }

  if (isError || !user || (user.role !== UserRole.ADMIN && user.role !== UserRole.SUPER_ADMIN)) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex h-dvh flex-col overflow-hidden bg-[#F5F7FA]">
        <div className="flex flex-1 overflow-hidden">
          <aside className="hidden h-full shrink-0 lg:block">
            <AdminSidebar />
          </aside>

          <AdminMobileSidebarDrawer />

          <section className="flex-1 h-dvh overflow-y-auto">
            <AdminNavbar />
            <main className="overflow-y-auto">
              <div className="min-h-full overflow-y-auto p-4 md:p-6">{children}</div>
            </main>
          </section>
        </div>
      </div>
    </SidebarProvider>
  );
}
