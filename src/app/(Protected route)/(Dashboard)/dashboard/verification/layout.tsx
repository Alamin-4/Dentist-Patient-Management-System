import { ArrowLeft } from "lucide-react";
import { VerificationSteps } from "../../_components/module/verification/verification-steps";

export default function VerificationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen md:w-11/12 mx-auto flex-col">
      <header className=" border-b pb-2">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col gap-1">
            <button className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <h1 className="text-xl font-bold text-[#0A2533]">
              Verification Progress
            </h1>
          </div>

          {/* Stepper Component */}
          <VerificationSteps currentStep={0} />
        </div>
      </header>

      {/* Middle Part - Changeable Content */}
      <main className="flex-1 px-6 py-10 pb-32">
        <div className="">
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
            {children}
          </div>
        </div>
      </main>

      {/* Bottom Bar - Always visible */}
      <footer className="fixed bottom-0 left-0 right-0 border-t bg-white py-6 z-50">
        <div className="mx-auto flex max-w-11/12 justify-end">
          <button
            disabled
            className="h-12 px-10 bg-[#8FA3B0] text-white font-bold rounded-lg cursor-not-allowed transition-colors"
          >
            Continue to Phase 2
          </button>
        </div>
      </footer>
    </div>
  );
}
