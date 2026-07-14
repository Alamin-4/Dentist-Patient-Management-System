
import ResultCard from "./Result-card";

const results = [
  {
    title: "Invisalign Treatment",
    patientName: "Sophia D.",
    date: "May 2026",
    location: "Istanbul, Turkey",
    beforeImage: "https://i.pravatar.cc/600?img=11",
    afterImage: "https://i.pravatar.cc/600?img=12",
  },
  {
    title: "Invisalign Treatment",
    patientName: "Sophia D.",
    date: "May 2026",
    location: "Istanbul, Turkey",
    beforeImage: "https://i.pravatar.cc/600?img=13",
    afterImage: "https://i.pravatar.cc/600?img=14",
  },
  {
    title: "Invisalign Treatment",
    patientName: "Sophia D.",
    date: "May 2026",
    location: "Istanbul, Turkey",
    beforeImage: "https://i.pravatar.cc/600?img=15",
    afterImage: "https://i.pravatar.cc/600?img=16",
  },
  {
    title: "Invisalign Treatment",
    patientName: "Sophia D.",
    date: "May 2026",
    location: "Istanbul, Turkey",
    beforeImage: "https://i.pravatar.cc/600?img=17",
    afterImage: "https://i.pravatar.cc/600?img=18",
  },
];

export default function Result() {
  return (
    <section className="space-y-6 lg:space-y-7">
      <header className="space-y-1.5">
        <h1 className="text-[26px] font-semibold leading-tight tracking-[-0.02em] text-[#1A1A2E] sm:text-[30px]">
          Results
        </h1>
        <p className="max-w-2xl text-[14px] leading-6 text-[#6B7280] sm:text-[15px]">
          Upload AI-verified before/after imagery for your patients.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:gap-6">
        {results.map((result, index) => (
          <ResultCard key={`${result.title}-${index}`} {...result} />
        ))}
      </div>
    </section>
  );
}
