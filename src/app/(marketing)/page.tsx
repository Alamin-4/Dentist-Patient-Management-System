import CtaSearchSection from "@/features/marketing/Home/find-verified-dentist/cta-section";
import Hero from "@/features/marketing/Home/Hero/hero";
import AiSmilePreview from "@/features/marketing/Home/Ai-Smile-Preview/ai-smile-preview";
// import SmileTransformations from "@/features/marketing/Home/smile-transformations/smile-transformations";
import VerifiedDentists from "@/features/marketing/Home/verified-dentist-section/verified-dentist";
import WhyTrust from "@/features/marketing/Home/WhyTrsut/why-trust";


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
