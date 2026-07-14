export function getErrorMessage(err: unknown, fallback = "Something went wrong"): string {
  if (!err || typeof err !== "object") return fallback;
  const e = err as Record<string, any>;
  return e?.response?.data?.message || e?.message || fallback;
}
