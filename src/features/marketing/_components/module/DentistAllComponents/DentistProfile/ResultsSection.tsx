import { Skeleton } from "@/components/feedback/skeleton";

const cases = [
  { procedure: "Porcelain Veneers (6 teeth)", duration: "2 visits / 5 days" },
  { procedure: "Full Smile Makeover", duration: "3 visits / 7 days" },
  { procedure: "Single Implant + Crown", duration: "2 phases / 3 months" },
  { procedure: "Composite Bonding", duration: "1 visit / 2 hours" },
];

export default function ResultsSection() {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 space-y-6">
      <div>
        <h2 className="text-xl lg:text-2xl font-bold text-[#0E3E65] mb-1">
          Before &amp; After Results
        </h2>
        <p className="text-sm text-[#6B7280]">
          Real patient outcomes. Photos provided with patient consent.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {cases.map((c, i) => (
          <div key={i} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  Before
                </span>
                <Skeleton className="h-36 w-full rounded-lg" />
              </div>
              <div className="space-y-1.5">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  After
                </span>
                <Skeleton className="h-36 w-full rounded-lg" />
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">{c.procedure}</p>
              <p className="text-xs text-[#6B7280]">{c.duration}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-400 text-center pt-2">
        Full gallery available after booking a consultation.
      </p>
    </section>
  );
}
