import { Toaster } from "react-hot-toast";
import IntakeModal from "./_components/module/Booking-flow/Book";
import StartBookingModal from "./_components/module/Booking-flow/StartBooking";
import CompareModal from "./_components/module/CompareModal/CompareModal";
import SignupModal from "./_components/module/signup-modal/Signup-Modal";
import Footer from "./_components/shared/footer/footer";
import Navbar from "./_components/shared/navbar/Navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      {children}
      <SignupModal />
      <CompareModal />
      <StartBookingModal />
      <IntakeModal />
      <Footer />
      <Toaster position="top-center" />
    </div>
  );
}
