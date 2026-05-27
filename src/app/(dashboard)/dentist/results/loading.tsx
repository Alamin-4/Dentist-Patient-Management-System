import ResultCardSkeleton from "../../../modules/dentist/results/Result-card-skeleton";

export default function ResultsLoading() {
  return (
    <section className="space-y-6 lg:space-y-7 animate-in fade-in duration-500">
      <header className="space-y-1.5">
        <div className="h-8 w-28 rounded-full bg-slate-200/80" />
        <div className="h-4 w-full max-w-md rounded-full bg-slate-200/70" />
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <ResultCardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}