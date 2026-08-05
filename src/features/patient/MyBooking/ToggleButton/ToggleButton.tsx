"use client";

import { Tabs, TabItem } from "@/components/ui/tabs/Tabs";

interface LegacyToggleTab {
  key: string;
  label: string;
}

interface ToggleButtonProps {
  tabs: LegacyToggleTab[];
  value: string;
  onChange: (value: string) => void;
}

/**
 * @deprecated Use `Tabs` from `@/components/ui/tabs/Tabs` directly.
 */
export default function ToggleButton({ tabs, value, onChange }: ToggleButtonProps) {
  const normalizedTabs: TabItem[] = tabs.map((t) => ({
    id: t.key,
    label: t.label,
  }));

  return (
    <Tabs
      tabs={normalizedTabs}
      value={value}
      onChange={onChange}
      variant="pill"
    />
  );
}
