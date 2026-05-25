"use client";

import Header from "./header";
import TabBarAndSearch from "./tab-bar-and-search";
import BookingCard from "./booking-card";

export default function BookingManage() {
  return (
    <div className="space-y-6">
      <Header />
      <TabBarAndSearch />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="mt-6">
            <BookingCard
              name={`Jacob Smith ${index + 1}`}
              email={`Jacob.smith${index + 1}@sample.com`}
              initials={`JS${index + 1}`}
              procedure="Dental Implants"
              budget="$1254"
              status={index % 2 === 0 ? "In Escrow" : "Completed"}
              dates="12–24 Jan, 2024"
              timelineStatus="Patient in Travel"
              onViewDetail={() => {
                // Handle view detail action here
                console.log(`View details for Jacob Smith ${index + 1}`);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
