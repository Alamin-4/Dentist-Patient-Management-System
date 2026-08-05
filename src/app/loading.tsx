/**
 * Root global loading fallback.
 * This renders ONLY when no closer loading.tsx is found in the route tree.
 * It must be portal-agnostic — never show marketing heroes or dashboard chrome here.
 */
export default function GlobalLoading() {
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center bg-[#F9FAFB]">
      <div className="flex flex-col items-center gap-5">
        {/* Logo wordmark pulse */}
        <div className="h-8 w-36 animate-pulse rounded-lg bg-slate-200" />

        {/* Loading bar */}
        <div className="h-1 w-48 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full w-1/2 animate-[slide_1.4s_ease-in-out_infinite] rounded-full bg-primary" />
        </div>

        <p className="text-sm font-medium text-slate-400">Loading…</p>
      </div>

      <style>{`
        @keyframes slide {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
}
