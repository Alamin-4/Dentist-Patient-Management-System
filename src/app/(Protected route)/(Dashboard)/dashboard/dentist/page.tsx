import { MetricsPlaceholder } from "../../_components/module/overview/metrics-placeholder";
import { VerificationBanner } from "../../_components/module/overview/verification-banner";

export default function OverviewPage() {
  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      <VerificationBanner />
      <MetricsPlaceholder />
    </div>
  );
}
