import { AdminNavbar } from "@/app/modules/admin/layout/admin-navbar";
import { AdminSidebar } from "@/app/modules/admin/layout/admin-sidebar";
import { AdminMobileSidebarDrawer } from "@/app/modules/admin/layout/admin-mobile-sidebar-drawer";
import { SidebarProvider } from "@/context/sidebar-context";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen flex-col overflow-hidden bg-[#F5F7FA]">
        <div className="flex flex-1 overflow-hidden">
          <aside className="hidden h-full shrink-0 lg:block">
            <AdminSidebar />
          </aside>

          <AdminMobileSidebarDrawer />

          <section className="flex-1 h-screen overflow-y-auto">
            <AdminNavbar />
            <main className="overflow-y-auto">
              <div className="min-h-full overflow-y-auto p-6">{children}</div>
            </main>
          </section>
        </div>
      </div>
    </SidebarProvider>
  );
}
