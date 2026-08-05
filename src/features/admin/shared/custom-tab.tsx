"use client";

import { Tabs, TabItem as BaseTabItem } from "@/components/ui/tabs/Tabs";

interface TabItem {
  key?: string;
  id?: string;
  label: string;
  count?: number;
  dot?: boolean;
}

interface CustomTabProps {
  tabs: TabItem[];
  active: string;
  onChange: (key: string) => void;
  variant?: "underline" | "pill";
  className?: string;
}

/**
 * @deprecated Use `Tabs` from `@/components/ui/tabs/Tabs` directly.
 */
export function CustomTab({
  tabs,
  active,
  onChange,
  variant = "underline",
  className,
}: CustomTabProps) {
  const normalizedTabs: BaseTabItem[] = tabs.map((t) => ({
    id: (t.key || t.id || "") as string,
    label: t.label,
    count: t.count,
    dot: t.dot,
  }));

  return (
    <Tabs
      tabs={normalizedTabs}
      value={active}
      onChange={onChange}
      variant={variant}
      className={className}
    />
  );
}
