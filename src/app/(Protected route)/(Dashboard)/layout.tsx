import IntakeModal from "@/app/(public)/_components/module/Booking-flow/Book";
import { Navbar } from "./_components/Shared/navbar";
import { Sidebar } from "./_components/Shared/sidebar";
import StartBookingModal from "@/app/(public)/_components/module/Booking-flow/StartBooking";
import CompareModal from "@/app/(public)/_components/module/CompareModal/CompareModal";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#F9FAFB]">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden h-full border-r bg-white lg:block">
          <Sidebar />
        </aside>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="">{children}</div>
        </main>
      </div>
      <CompareModal />
      <StartBookingModal />
      <IntakeModal />
    </div>
  );
}
