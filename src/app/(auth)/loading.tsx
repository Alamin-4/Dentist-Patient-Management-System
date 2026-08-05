export default function AuthLoading() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md animate-pulse space-y-6 rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
        <div className="flex justify-center">
          <div className="h-8 w-32 rounded-lg bg-slate-200" />
        </div>

        <div className="space-y-2 text-center">
          <div className="mx-auto h-7 w-48 rounded-lg bg-slate-200" />
          <div className="mx-auto h-4 w-64 rounded bg-slate-100" />
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="h-4 w-16 rounded bg-slate-200" />
            <div className="h-11 w-full rounded-lg bg-slate-100" />
          </div>
          <div className="space-y-1.5">
            <div className="h-4 w-20 rounded bg-slate-200" />
            <div className="h-11 w-full rounded-lg bg-slate-100" />
          </div>
        </div>

        <div className="h-11 w-full rounded-lg bg-primary/20" />

        <div className="mx-auto h-4 w-40 rounded bg-slate-100" />
      </div>
    </div>
  );
}
