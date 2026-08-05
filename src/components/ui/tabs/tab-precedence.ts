/**
 * Computes active tab state with explicit precedence:
 * 1. URL search param (if present in URL and valid)
 * 2. LocalStorage saved tab (if query param absent in URL and valid)
 * 3. Default fallback tab
 */
export function resolveActiveTab({
  urlParam,
  savedStorageTab,
  defaultTab,
  validTabIds,
}: {
  urlParam: string | null;
  savedStorageTab: string | null;
  defaultTab: string;
  validTabIds?: string[];
}): string {
  const isValid = (id: string | null): id is string =>
    Boolean(id && (!validTabIds || validTabIds.includes(id)));

  // Precedence 1: URL param wins if present & valid
  if (isValid(urlParam)) {
    return urlParam;
  }

  // Precedence 2: LocalStorage wins if query param absent/invalid & storage tab valid
  if (isValid(savedStorageTab)) {
    return savedStorageTab;
  }

  // Precedence 3: Fallback default tab
  return defaultTab;
}
