"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import FilterSidebar, { type FilterSidebarProps } from "./SideBar/FilterSidebar";

interface FilterSheetProps extends FilterSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function FilterSheet({
  open,
  onClose,
  ...filterProps
}: FilterSheetProps) {
  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="w-full max-w-sm overflow-y-auto p-0"
      >
        <SheetHeader className="flex flex-row items-center justify-between border-b px-6 py-4">
          <SheetTitle className="text-[18px] font-bold text-slate-900">
            Set Filters
          </SheetTitle>
        </SheetHeader>

        <div className="px-4 py-4">
          <FilterSidebar {...filterProps} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
