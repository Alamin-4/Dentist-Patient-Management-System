"use client";

import { Menu } from "lucide-react";
import { useSidebar } from "@/context/sidebar-context";

export function HamburgerButton() {
  const { toggle } = useSidebar();

  return (
    <button
      onClick={toggle}
      aria-label="Toggle navigation menu"
      className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 lg:hidden"
    >
      <Menu className="h-5 w-5" />
    </button>
  );
}
