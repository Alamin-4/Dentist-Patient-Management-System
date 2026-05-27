import { AdminNavbar } from "@/app/modules/admin/layout/admin-navbar";
import { AdminSidebar } from "@/app/modules/admin/layout/admin-sidebar";
import { AdminMobileSidebarDrawer } from "@/app/modules/admin/layout/admin-mobile-sidebar-drawer";
import { SidebarProvider } from "@/context/sidebar-context";
import { Toaster } from "react-hot-toast";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen flex-col overflow-hidden bg-[#F5F7FA]">
        <div className="flex flex-1 overflow-hidden">
          {/* Desktop sidebar — always visible on lg+ */}
          <aside className="hidden h-full shrink-0 lg:block">
            <AdminSidebar />
          </aside>

          {/* Mobile drawer + backdrop — only below lg */}
          <AdminMobileSidebarDrawer />

          <section className="flex-1 h-screen overflow-y-auto">
            <AdminNavbar />
            <main className="overflow-y-auto">
              <div className="min-h-full p-4 sm:p-6 overflow-y-auto">{children}</div>
            </main>
          </section>
        </div>

        <Toaster position="top-center" />
      </div>
    </SidebarProvider>
  );
}
