import { MapPin } from "lucide-react";

interface DentistResult {
  id: string;
  title: string;
  patientName: string;
  date: string;
  location: string;
  beforeImage: string;
  afterImage: string;
}

export default function ResultsSection({
  results = [],
  dentistName = "",
}: {
  results?: DentistResult[];
  dentistName?: string;
}) {
  return (
    <section id="results" className="rounded-lg border border-slate-200 bg-white p-6 space-y-6">
      <div>
        <h2 className="text-xl lg:text-2xl font-bold text-primary">
          Patient Results
        </h2>
      </div>

      {results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400 border border-dashed border-slate-200 rounded-lg bg-slate-50/50">
          <p className="text-sm font-semibold text-slate-600">No patient results published yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {results.map((c) => (
            <div key={c.id} className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50 flex flex-col shadow-xs">
              {/* Images container */}
              <div className="grid grid-cols-2 gap-0.5 p-1 bg-white">
                <div className="relative">
                  <span className="absolute top-2 left-2 z-10 rounded bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-xs">
                    Before
                  </span>
                  <img
                    src={c.beforeImage || "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=300"}
                    alt="Before treatment"
                    className="h-44 w-full object-cover"
                  />
                </div>
                <div className="relative">
                  <span className="absolute top-2 left-2 z-10 rounded bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-xs">
                    After
                  </span>
                  <img
                    src={c.afterImage || "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=300"}
                    alt="After treatment"
                    className="h-44 w-full object-cover"
                  />
                </div>
              </div>

              {/* Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="text-[15px] font-bold text-slate-900 leading-snug">
                    {c.title}
                  </h4>
                  {dentistName && (
                    <p className="text-xs font-semibold text-slate-500 mt-1">
                      Dr. {dentistName}
                    </p>
                  )}
                </div>

                {/* Footer details */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 text-xs">
                  <div className="flex items-center gap-1 text-slate-500 font-medium">
                    <MapPin className="size-3.5 text-slate-400" />
                    <span>{c.location || "Istanbul, Turkey"}</span>
                  </div>
                  <span className="font-bold text-badge flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-badge" />
                    Public
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
