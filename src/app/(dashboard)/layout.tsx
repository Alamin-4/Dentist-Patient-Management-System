import IntakeModal from "@/app/(marketing)/_components/module/Booking-flow/Book";
import { Navbar } from "../modules/shared/navbar";
import { Sidebar } from "../modules/shared/sidebar";
import StartBookingModal from "@/app/(marketing)/_components/module/Booking-flow/StartBooking";
import CompareModal from "@/app/(marketing)/_components/module/CompareModal/CompareModal";

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
