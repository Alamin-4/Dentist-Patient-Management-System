import IntakeModal from "@/features/marketing/_components/module/Booking-flow/Book";
import StartBookingModal from "@/features/marketing/_components/module/Booking-flow/StartBooking";
import CompareModal from "@/features/marketing/_components/module/CompareModal/CompareModal";
import PersonalizeComparisonModal from "@/features/marketing/_components/modal/personalize-comparison-modal";
import RequestConsultationModal from "@/features/marketing/_components/modal/request-consultation-modal";
import SignupModal from "@/features/marketing/_components/module/signup-modal/Signup-Modal";
import SigninModal from "@/features/marketing/_components/module/signup-modal/SignIn";
import Footer from "@/features/marketing/_components/shared/footer/footer";
import NavbarPublic from "@/features/marketing/_components/shared/navbar/Navbar";

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
