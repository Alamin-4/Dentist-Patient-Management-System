"use client";

import { Tabs, TabItem } from "@/components/ui/tabs/Tabs";

interface LegacyTab {
  id: string;
  label: string;
}

interface CustomTabsProps {
  tabs: LegacyTab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  storageKey?: string;
}

/**
 * @deprecated Use `Tabs` from `@/components/ui/tabs/Tabs` directly.
 */
export default function CustomTabs({
  tabs,
  activeTab = "",
  onTabChange,
}: CustomTabsProps) {
  const normalizedTabs: TabItem[] = tabs.map((t) => ({
    id: t.id,
    label: t.label,
  }));

  return (
    <Tabs
      tabs={normalizedTabs}
      value={activeTab}
      onChange={(id) => onTabChange?.(id)}
    />
  );
}
