import React from "react";

export default function DashboardPageHeader({
  heading,
  subHeading,
}: {
  heading: string;
  subHeading: string;
}) {
  return (
    <div>
      <div className="space-y-2">
        <h1 className="text-xl lg:text-2xl font-semibold text-gray-800">
          {heading}
        </h1>
        <p className="text-tertiary text-sm lg:text-[16px]">{subHeading}</p>
      </div>
    </div>
  );
}
