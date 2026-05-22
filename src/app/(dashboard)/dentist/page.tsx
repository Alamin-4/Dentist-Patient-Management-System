import { MetricsPlaceholder } from "../../modules/dentist/overview/metrics-placeholder";
import { VerificationBanner } from "../../modules/dentist/overview/verification-banner";

export default function OverviewPage() {
  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      <VerificationBanner />
      <MetricsPlaceholder />
    </div>
  );
}
