"use client";

import { useEffect } from "react";
import { useMe } from "@/hooks/auth/useAuth";
import IntakeModal from "@/features/marketing/Booking-flow/Book";
import { Navbar } from "@/app/modules/shared/navbar";
import { Sidebar } from "@/app/modules/shared/sidebar";
import { MobileSidebarDrawer } from "@/app/modules/shared/mobile-sidebar-drawer";
import StartBookingModal from "@/features/marketing/Booking-flow/StartBooking";
import CompareModal from "@/features/marketing/CompareModal/CompareModal";
import { SidebarProvider } from "@/context/sidebar-context";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, isError } = useMe();

  useEffect(() => {
    if (!isLoading) {
      if (isError || !user) {
        window.location.href = "/";
      }
    }
  }, [isLoading, isError, user]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !user) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex h-dvh flex-col overflow-hidden bg-[#F9FAFB]">
        <Navbar />

        <div className="flex flex-1 overflow-hidden">
          <aside className="hidden h-full border-r border-border/80 lg:block">
            <Sidebar />
          </aside>

          <MobileSidebarDrawer />

          <main className="flex-1 overflow-y-auto p-4 md:p-6">
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
