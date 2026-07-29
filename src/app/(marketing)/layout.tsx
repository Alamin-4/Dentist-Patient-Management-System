import IntakeModal from "@/features/marketing/Booking-flow/Book";
import StartBookingModal from "@/features/marketing/Booking-flow/StartBooking";
import CompareModal from "@/features/marketing/CompareModal/CompareModal";
import PersonalizeComparisonModal from "@/features/marketing/modal/personalize-comparison-modal";
import RequestConsultationModal from "@/features/marketing/modal/request-consultation-modal";
import SignupModal from "@/features/marketing/signup-modal/Signup-Modal";
import SigninModal from "@/features/marketing/signup-modal/SignIn";
import Footer from "@/features/marketing/shared/footer/footer";
import NavbarPublic from "@/features/marketing/shared/navbar/Navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <NavbarPublic />
      <main className="min-h-150 h-full">{children}</main>
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
