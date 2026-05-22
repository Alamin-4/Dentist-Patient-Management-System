import IntakeModal from "@/app/(marketing)/_components/module/Booking-flow/Book";
import { Navbar } from "../modules/shared/navbar";
import { Sidebar } from "../modules/shared/sidebar";
import { MobileSidebarDrawer } from "../modules/shared/mobile-sidebar-drawer";
import StartBookingModal from "@/app/(marketing)/_components/module/Booking-flow/StartBooking";
import CompareModal from "@/app/(marketing)/_components/module/CompareModal/CompareModal";
import { SidebarProvider } from "@/context/sidebar-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen flex-col overflow-hidden bg-[#F9FAFB]">
        <Navbar />

        <div className="flex flex-1 overflow-hidden">
          {/* Desktop sidebar — always visible on lg+ */}
          <aside className="hidden h-full border-r lg:block">
            <Sidebar />
          </aside>

          {/* Mobile drawer + backdrop — visible below lg */}
          <MobileSidebarDrawer />

          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            <div className="">{children}</div>
          </main>
        </div>

        <CompareModal />
        <StartBookingModal />
        <IntakeModal />
      </div>
    </SidebarProvider>
  );
}
