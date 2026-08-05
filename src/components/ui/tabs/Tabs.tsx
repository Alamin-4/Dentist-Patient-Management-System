"use client";

import React, { useRef } from "react";
import { cn } from "@/core/lib/utils";

export interface TabItem<T extends string = string> {
  id: T;
  label: string;
  count?: number;
  dot?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface TabsProps<T extends string = string> {
  tabs: TabItem<T>[];
  value: T;
  onChange: (id: T) => void;
  variant?: "underline" | "pill";
  className?: string;
  ariaLabel?: string;
}

export function Tabs<T extends string = string>({
  tabs,
  value,
  onChange,
  variant = "underline",
  className,
  ariaLabel = "Navigation Tabs",
}: TabsProps<T>) {
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const handleKeyDown = (e: React.KeyboardEvent, currentId: T) => {
    const enabledTabs = tabs.filter((t) => !t.disabled);
    const currentIndex = enabledTabs.findIndex((t) => t.id === currentId);
    if (currentIndex === -1) return;

    let nextIndex = currentIndex;
    if (e.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % enabledTabs.length;
    } else if (e.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + enabledTabs.length) % enabledTabs.length;
    } else if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = enabledTabs.length - 1;
    } else {
      return;
    }

    e.preventDefault();
    const nextTab = enabledTabs[nextIndex];
    if (nextTab) {
      onChange(nextTab.id);
      tabRefs.current.get(nextTab.id)?.focus();
    }
  };

  if (variant === "pill") {
    return (
      <div
        role="tablist"
        aria-label={ariaLabel}
        className={cn("flex gap-1.5 overflow-x-auto", className)}
      >
        {tabs.map((tab) => {
          const isActive = value === tab.id;

          return (
            <button
              key={tab.id}
              ref={(el) => {
                if (el) tabRefs.current.set(tab.id, el);
                else tabRefs.current.delete(tab.id);
              }}
              role="tab"
              type="button"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              disabled={tab.disabled}
              onClick={() => onChange(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, tab.id)}
              className={cn(
                "rounded-full px-3.5 py-1 text-sm font-medium transition-colors outline-none cursor-pointer flex items-center gap-1.5 whitespace-nowrap",
                isActive
                  ? "bg-brand-deep-navy text-white"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-700",
                tab.disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={cn(
                    "ml-1 rounded-full px-1.5 py-0.5 text-xs font-semibold",
                    isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                  )}
                >
                  {tab.count.toLocaleString()}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn("w-full border-b border-gray-100", className)}>
      <div
        role="tablist"
        aria-label={ariaLabel}
        className="flex items-center gap-6 overflow-x-auto"
      >
        {tabs.map((tab) => {
          const isActive = value === tab.id;

          return (
            <button
              key={tab.id}
              ref={(el) => {
                if (el) tabRefs.current.set(tab.id, el);
                else tabRefs.current.delete(tab.id);
              }}
              role="tab"
              type="button"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              disabled={tab.disabled}
              onClick={() => onChange(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, tab.id)}
              className={cn(
                "relative pb-3 pt-2 text-[15px] font-semibold transition-all duration-150 outline-none select-none flex items-center gap-2 cursor-pointer border-b-2 -mb-px whitespace-nowrap",
                isActive
                  ? "text-brand-deep-navy border-brand-deep-navy"
                  : "text-[#9CA3AF] border-transparent hover:text-sec-text",
                tab.disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>

              {tab.dot && (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              )}

              {tab.count !== undefined && (
                <span
                  className={cn(
                    "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold transition-colors",
                    isActive
                      ? "bg-brand-deep-navy text-white"
                      : "bg-gray-100 text-gray-500"
                  )}
                >
                  {tab.count.toLocaleString()}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
