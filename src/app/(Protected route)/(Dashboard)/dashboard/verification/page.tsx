import { HeadshotUpload } from "../../_components/module/verification/headshot-upload";
import VerifyPage from "../../_components/module/verification/licence-form";

export default function PhaseOnePage() {
  return (
    <div className="divide-y divide-gray-100">
      {/* Section 1: Licence */}
      <div className="grid grid-cols-1 gap-8 p-8 lg:grid-cols-[1fr_1.5fr] lg:p-12">
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#163E5C]">
            Step 1
          </p>
          <h2 className="text-2xl font-bold text-[#0A2533]">
            Verify your dental licence
          </h2>
        </div>
        <div>
          <VerifyPage />
        </div>
      </div>

      {/* Section 2: Headshot */}
      <div className="grid grid-cols-1 gap-8 p-8 lg:grid-cols-[1fr_1.5fr] lg:p-12">
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#163E5C]">
            Step 2
          </p>
          <h2 className="text-2xl font-bold text-[#0A2533]">
            Upload your professional headshot
          </h2>
        </div>
        <div className="space-y-4">
          <p className="text-sm font-bold text-[#0A2533]">
            Professional Headshot
          </p>
          <HeadshotUpload />
        </div>
      </div>
    </div>
  );
}
