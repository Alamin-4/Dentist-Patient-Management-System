import IntakeModal from "./_components/module/Booking-flow/Book";
import StartBookingModal from "./_components/module/Booking-flow/StartBooking";
import CompareModal from "./_components/module/CompareModal/CompareModal";
import PersonalizeComparisonModal from "./_components/modal/personalize-comparison-modal";
import RequestConsultationModal from "./_components/modal/request-consultation-modal";
import SignupModal from "./_components/module/signup-modal/Signup-Modal";
import SigninModal from "./_components/module/signup-modal/SignIn";
import Footer from "./_components/shared/footer/footer";
import NavbarPublic from "./_components/shared/navbar/Navbar";

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
