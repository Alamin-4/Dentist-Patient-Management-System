"use client";

import { useEffect } from "react";

export interface TabPersistenceOptions<T extends string = string> {
  validTabIds?: T[];
  isUrlParamPresent?: boolean;
}

export function useTabPersistence<T extends string = string>(
  storageKey: string | undefined,
  activeTab: T,
  onChange: (tabId: T) => void,
  options?: TabPersistenceOptions<T>
) {
  const isUrlParamPresent = options?.isUrlParamPresent ?? false;
  const validTabIds = options?.validTabIds;

  useEffect(() => {
    if (!storageKey || typeof window === "undefined") return;
    if (isUrlParamPresent) return;

    const saved = localStorage.getItem(storageKey);
    if (saved && saved !== activeTab && (!validTabIds || validTabIds.includes(saved as T))) {
      onChange(saved as T);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey, isUrlParamPresent]);

  useEffect(() => {
    if (!storageKey || typeof window === "undefined") return;
    localStorage.setItem(storageKey, activeTab);
  }, [storageKey, activeTab]);
}
