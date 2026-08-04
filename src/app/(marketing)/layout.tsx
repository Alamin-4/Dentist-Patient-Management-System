import IntakeModal from "@/features/marketing/Booking-flow/Book";
import StartBookingModal from "@/features/marketing/Booking-flow/StartBooking";
import CompareModal from "@/features/marketing/CompareModal/CompareModal";
import PersonalizeComparisonModal from "@/features/marketing/modal/personalize-comparison-modal";
import RequestConsultationModal from "@/features/marketing/modal/request-consultation-modal";
import SignupModal from "@/features/marketing/signup-modal/Signup-Modal";
import SigninModal from "@/features/marketing/signup-modal/SignIn";
import Footer from "@/features/marketing/shared/footer/footer";
import NavbarPublic from "@/features/marketing/shared/navbar/Navbar";

import ScrollToTop from "@/components/shared/scroll-to-top";

import { Suspense } from "react";
import AccountSuspendedBanner from "@/features/marketing/shared/AccountSuspendedBanner";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Suspense fallback={null}>
        <AccountSuspendedBanner />
      </Suspense>
      <NavbarPublic />
      <main className="flex-1 flex flex-col">{children}</main>
      <SignupModal />
      <SigninModal />
      <PersonalizeComparisonModal />
      <CompareModal />
      <StartBookingModal />
      <IntakeModal />
      <RequestConsultationModal />
      <Footer />
    </div>
  );
}
