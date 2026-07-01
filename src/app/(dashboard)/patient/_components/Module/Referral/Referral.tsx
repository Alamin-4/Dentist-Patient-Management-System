"use client";

import React, { useState } from "react";
import {
  Copy,
  Calendar,
  MessageSquare,
  Mail,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReferralsPageComponent() {
  const referralCode = "RD-JW4729";

  const [history] = useState([
    {
      id: 1,
      name: "James R.",
      date: "March 15, 2026",
      status: "Credit issued",
    },
    {
      id: 2,
      name: "Ethan K.",
      date: "April 10, 2026",
      status: "Credit issued",
    },
    {
      id: 3,
      name: "Ethan K.",
      date: "April 10, 2026",
      status: "Credit issued",
    },
    { id: 4, name: "Sophia L.", date: "April 2, 2026", status: "Pending" },
  ]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    // toast.success("Code copied to clipboard!");
  };

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-[#1A1A2E]">Referrals</h1>

      {/* Top Section: Code & Credits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Referral Code Card - Matches image_2df170.png */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-[#CEE0F4] p-8 flex flex-col items-center justify-center text-center space-y-6">
          <div className="space-y-1">
            <p className="text-[#6B7280]">Your Referral Code</p>
            <div className="flex items-center gap-3">
              <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#1A1A2E] tracking-tight">
                {referralCode}
              </span>
              <button
                onClick={copyToClipboard}
                className="p-2 hover:bg-slate-50 rounded-full transition-colors group"
              >
                <Copy className="size-6 text-slate-300 group-hover:text-[#0F3659]" />
              </button>
            </div>
            <p className="text-[#6B7280] text-xs">
              Share your code and you both get $50 credit
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <Button
              variant="outline"
              className="flex-1 h-12 rounded-lg cursor-pointer border-[#6B7280] font-medium text-[#6B7280] gap-2"
            >
              <MessageSquare className="size-4" /> Share as SMS
            </Button>
            <Button
              variant="outline"
              className="flex-1 h-12 rounded-lg cursor-pointer border-[#6B7280] font-medium text-[#6B7280] gap-2"
            >
              <Mail className="size-4" /> Share as Email
            </Button>
          </div>
        </div>

        {/* Available Credits Card */}
        <div className="bg-white rounded-lg border border-[#CEE0F4] p-8 flex flex-col justify-between min-h-60">
          <div className="space-y-1">
            <p className="text-[#6B7280]">Available Credits</p>
            <p className="text-2xl md:text-3xl font-bold text-[#1A1A2E]">$50</p>
          </div>

          <div className="flex items-center gap-2 text-[#6B7280] border-t pt-4">
            <Calendar className="size-5" />
            <p className="text-sm">
              Expire on:{" "}
              <span className="font-bold text-slate-600">
                December 31, 2026
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Referral History Section */}
      <div className="space-y-6 p-4 lg:p-6 rounded-lg bg-white border border-[#E9EDEE]">
        <h2 className="text-2xl font-bold text-[#1A1A2E]">Referral History</h2>

        <div className="space-y-4">
          {history.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg border border-[#CEE0F4] p-4 lg:p-6 flex items-center justify-between"
            >
              <div className="space-y-1">
                <h4 className="text-xl font-bold text-[#1A1A2E]">
                  {item.name}
                </h4>
                <p className="text-[#6B7280] font-medium">{item.date}</p>
              </div>

              <div
                className={`px-6 py-2 rounded-lg font-bold text-sm whitespace-nowrap ${item.status === "Credit issued"
                    ? "bg-[#0BB05F] text-white"
                    : "bg-[#F7941D] text-white"
                  }`}
              >
                {item.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
