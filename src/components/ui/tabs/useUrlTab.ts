"use client";

import { useTransition, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useUrlTab<T extends string = string>(
  queryKey: string = "tab",
  defaultTab: T,
  validTabIds?: T[]
): [T, (tabId: T) => void, boolean] {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const urlParam = searchParams.get(queryKey);
  const isUrlParamPresent = Boolean(
    urlParam && (!validTabIds || validTabIds.includes(urlParam as T))
  );

  const activeTab = (isUrlParamPresent ? urlParam : defaultTab) as T;

  const setTab = useCallback(
    (nextTabId: T) => {
      if (nextTabId === activeTab) return;

      const params = new URLSearchParams(searchParams.toString());
      params.set(queryKey, nextTabId);

      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [activeTab, pathname, queryKey, router, searchParams]
  );

  return [activeTab, setTab, isUrlParamPresent];
}
