"use client";

import { useEffect, useState } from "react";
import Header from "./header";
import TabBarAndSearch from "./tab-bar-and-search";
import BookingCard from "./booking-card";
import { getSubmittedBookings, SubmittedBooking } from "@/lib/storage/bookingService";

const DEMO_CARDS = [
  {
    id: "booking_demo_1",
    name: "Jacob Smith",
    email: "Jacob.smith@sample.com",
    initials: "JS",
    procedure: "Dental Implants",
    budget: "$1,254",
    status: "In Escrow",
    dates: "12–24 Jan, 2024",
    timelineLabel: "Patient timeline",
    timelineStatus: "Day 1 arrival",
  },
  {
    id: "booking_demo_2",
    name: "Jacob Smith",
    email: "Jacob.smith@sample.com",
    initials: "JS",
    procedure: "Dental Implants",
    budget: "$1,254",
    status: "In Escrow",
    dates: "12–24 Jan, 2024",
    timelineLabel: "Timeline",
    timelineStatus: "Patient in Travel",
  },
  {
    id: "booking_demo_3",
    name: "Jacob Smith",
    email: "Jacob.smith@sample.com",
    initials: "JS",
    procedure: "Dental Implants",
    budget: "$1,254",
    status: "In Escrow",
    dates: "12–24 Jan, 2024",
    timelineLabel: "Timeline",
    timelineStatus: "Patient in Travel",
  },
];

import { useTreatmentBookings } from "@/hooks/treatment-booking/useTreatmentBooking";
import { useStateContext } from "@/providers/StateProvider";

export default function BookingManage() {
  const { activeTab, searchQuery, isNewestFirst } = useStateContext();
  const { data: response, isLoading } = useTreatmentBookings();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return (
      <div className="space-y-6">
        <Header />
        <div className="h-12 w-full bg-slate-100 animate-pulse rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-72 bg-white rounded-lg animate-pulse border border-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  const rawBookings = response?.data || [];

  // 1. Filter by Active Tab
  const currentTab = activeTab || "booking-1";
  const filteredByTab = rawBookings.filter((b: any) => {
    if (currentTab === "In Progress" || currentTab === "booking-1") {
      return b.status === "CONFIRMED" || b.status === "IN_PROGRESS";
    }
    if (currentTab === "Completed" || currentTab === "booking-2") {
      return b.status === "COMPLETED";
    }
    if (currentTab === "Rejected" || currentTab === "booking-3") {
      return b.status === "CANCELLED";
    }
    return true;
  });

  // 2. Search Filter
  const searched = filteredByTab.filter((b: any) => {
    const firstName = b.patient?.user?.firstName || "";
    const lastName = b.patient?.user?.lastName || "";
    const fullName = `${firstName} ${lastName}`.toLowerCase();
    const procedure = (b.treatmentPlan?.lineItems?.[0]?.globalProcedure?.name || "Dental Treatment").toLowerCase();
    const query = searchQuery.toLowerCase();

    return fullName.includes(query) || procedure.includes(query);
  });

  // 3. Sorting
  const sorted = [...searched].sort((a: any, b: any) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return isNewestFirst ? dateB - dateA : dateA - dateB;
  });

  const cards = sorted.map((b: any) => {
    const firstName = b.patient?.user?.firstName || "";
    const lastName = b.patient?.user?.lastName || "";
    const initials = `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();
    const procedure = b.treatmentPlan?.lineItems?.[0]?.globalProcedure?.name || "Dental Treatment";

    let timelineStatus = "Patient in Travel";
    if (b.status === "IN_PROGRESS") {
      if (b.metadata?.finalPlanApproved) {
        timelineStatus = "Final Plan Confirmed";
      } else if (b.metadata?.finalPlan) {
        timelineStatus = "Final Plan Proposed";
      } else {
        timelineStatus = "Day 1 Arrival Check";
      }
    } else if (b.status === "COMPLETED") {
      timelineStatus = "Treatment Completed";
    } else if (b.status === "CANCELLED") {
      timelineStatus = "Cancelled";
    }

    return {
      id: b.id,
      name: `${firstName} ${lastName}`,
      email: b.patient?.user?.email || "",
      initials,
      image: b.patient?.user?.image || "",
      procedure,
      budget: `$${Number(b.escrowAmount).toLocaleString()}`,
      status: b.paymentStatus === "IN_ESCROW" ? "In Escrow" : b.paymentStatus === "PAID" ? "Paid" : b.paymentStatus,
      dates: b.scheduledDate ? new Date(b.scheduledDate).toLocaleDateString() : "Pending Schedule",
      timelineLabel: "Timeline",
      timelineStatus,
    };
  });

  return (
    <div className="space-y-6">
      <Header />
      <TabBarAndSearch />

      {cards.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400 bg-white rounded-xl border border-slate-100">
          <p className="text-lg font-medium">No bookings found</p>
          <p className="text-sm">There are no bookings matching the selected status or query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div key={card.id}>
              <BookingCard
                id={card.id}
                name={card.name}
                email={card.email}
                initials={card.initials}
                image={card.image}
                procedure={card.procedure}
                budget={card.budget}
                status={card.status}
                dates={card.dates}
                timelineLabel={card.timelineLabel}
                timelineStatus={card.timelineStatus}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
