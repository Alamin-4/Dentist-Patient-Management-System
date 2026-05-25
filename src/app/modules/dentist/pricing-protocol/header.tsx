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
    <div className="flex items-start justify-between">
      <DashboardPageHeader
        heading="Pricing Protocol"
        subHeading="Manage and edit pricing protocols"
      />
      <div>
        <Button
          className="h-14 px-6 bg-primary text-white lg:text-lg font-semibold cursor-pointer"
          onClick={handleAddPricing}
        >
          Add Pricing
        </Button>
      </div>
    </div>
  );
}
