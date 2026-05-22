export function MetricsPlaceholder() {
  return (
    <div className="mt-8 rounded-2xl border border-gray-100 bg-white shadow-sm h-100 md:h-125 flex flex-col items-center justify-center text-center px-6">
      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
        Behavioural metrics
      </h3>
      <p className="text-gray-500 text-base md:text-lg max-w-lg">
        These metrics become active once you're live in search (Phase 2).
      </p>
    </div>
  );
}
