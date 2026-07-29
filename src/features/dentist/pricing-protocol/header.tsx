"use client";

import { Button } from "@/components/ui/button";
import { useStateContext } from "@/providers/StateProvider";
import { useRouter } from "next/navigation";
import DashboardPageHeader from "../../shared/dashboard-page-header/dashboard-page-header";

export default function Header() {
  const router = useRouter();

  const handleAddPricing = () => {
    router.push("/dentist/add-pricing");
  };
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
      <DashboardPageHeader
        heading="Pricing Protocol"
        subHeading="Manage and edit pricing protocols"
      />
      <div>
        <Button
          className="h-9 px-3.5 text-xs sm:h-11 sm:px-5 sm:text-sm font-semibold bg-primary text-white cursor-pointer hover:bg-primary/95 shrink-0"
          onClick={handleAddPricing}
        >
          Add Pricing
        </Button>
      </div>
    </div>
  );
}
