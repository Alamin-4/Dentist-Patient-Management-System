import CtaSearchSection from "@/features/marketing/_components/Home/find-verified-dentist/cta-section";
import Hero from "@/features/marketing/_components/Home/Hero/hero";
import AiSmilePreview from "@/features/marketing/_components/Home/Ai-Smile-Preview/ai-smile-preview";
// import SmileTransformations from "@/features/marketing/_components/Home/smile-transformations/smile-transformations";
import VerifiedDentists from "@/features/marketing/_components/Home/verified-dentist-section/verified-dentist";
import WhyTrust from "@/features/marketing/_components/Home/WhyTrsut/why-trust";


export default function HomePage() {
  return (
    <div>
      <Hero />
      <VerifiedDentists />
      <WhyTrust />
      {/* <SmileTransformations /> */}
      <AiSmilePreview />
      <CtaSearchSection />
    </div>
  );
}
