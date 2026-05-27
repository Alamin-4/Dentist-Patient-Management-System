import { VerificationBanner } from "../../modules/dentist/overview/verification-banner";

export default function OverviewPage() {
  return (
    <div className="flex h-full w-full items-center justify-center pb-6 lg:pb-8 animate-in fade-in duration-500">
      <VerificationBanner />
    </div>
  );
}
