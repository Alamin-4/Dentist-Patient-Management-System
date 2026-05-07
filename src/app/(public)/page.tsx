import CtaSearchSection from "./_components/module/Home/find-verified-dentist/cta-section";
import Hero from "./_components/module/Home/Hero/hero";
import PatientStories from "./_components/module/Home/testimonial/patient-stories";
import VerifiedDentists from "./_components/module/Home/verified-dentist-section/verified-dentist";
import WhyTrust from "./_components/module/Home/WhyTrsut/why-trust";

export default function HomePage() {
  return (
    <div>
     <Hero/>
     <VerifiedDentists/>
     <WhyTrust/>
     <PatientStories/>
     <CtaSearchSection/>
    </div>
  );
}
