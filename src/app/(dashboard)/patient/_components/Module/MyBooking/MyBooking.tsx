"use client";

import { useStateContext } from "@/providers/StateProvider";
import DoctorCard from "./Card";
import ToggleButton from "./ToggleButton/ToggleButton";
import { treatmentPlansData } from "./data";

export default function MyBooking() {
  const { activeTab } = useStateContext();

  const displayedPlans = treatmentPlansData.filter((plan) => {
    if (activeTab === "estimate") return plan.payment_status === "pending";
    if (activeTab === "treatment") return plan.payment_status === "paid";
    return true;
  });

  return (
    <div>
      <p className="text-2xl lg:text-3xl text-[#1A1A2E] font-bold">
        My Booking
      </p>

      <div className="mt-4">
        <ToggleButton />
      </div>

      <div className="py-4 lg:py-6 space-y-4">
        {displayedPlans.map((plan) => (
          <DoctorCard key={plan.id} data={plan} />
        ))}
      </div>
    </div>
  );
}
