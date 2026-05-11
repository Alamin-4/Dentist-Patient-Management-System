import ProfileTabs from "./ProfileTabs";
import AboutSection from "./AboutSection";
import ProtocolSection from "./ProtocolSection";
import BookingSidebar from "./BookingSidebar";
import ReviewSection from "./ReviewSection";

export default function DentistProfilePage({ dentist }: { dentist: any }) {
  return (
    <main className="min-h-screen bg-[#F8FAFC] py-12 px-6">
      <div className="mx-auto max-w-360 w-11/12">
        <div className="flex flex-col-reverse lg:flex-row gap-10 items-start">
          {/* Left Column */}
          <div className="flex-1 space-y-8">
            <ProfileTabs />
            <AboutSection name={dentist.name} bio={dentist.bio} />
            <ReviewSection />
            <ProtocolSection />
          </div>

          {/* Right Column */}
          <div className="w-full lg:w-110">
            <BookingSidebar dentist={dentist} />
          </div>
        </div>
      </div>
    </main>
  );
}
