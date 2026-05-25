"use client";

import { Button } from "@/components/ui/button";
import { useStateContext } from "@/providers/StateProvider";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const handleAddPricing = () => {
    router.push("/dentist/add-pricing");
  };
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-xl lg:text-2xl font-semibold text-gray-800 mb-4">
          Pricing Protocol
        </h1>
        <p className="text-tertiary text-sm lg:text-[16px]">
          Manage and edit pricing protocols
        </p>
      </div>
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
