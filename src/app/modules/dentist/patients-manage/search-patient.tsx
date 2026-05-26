"use client";

import React, { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FilterSectionProps {
  searchQuery: string;
  selectedProcedure: string;
  selectedStatus: string;
  procedureOptions?: string[];
  statusOptions?: string[];
  onSearchChange?: (value: string) => void;
  onProcedureSelect?: (procedure: string) => void;
  onStatusSelect?: (status: string) => void;
}

export default function FilterSection({
  searchQuery,
  selectedProcedure,
  selectedStatus,
  procedureOptions = [
    "All Procedures",
    "Dental Implants",
    "All-on-6 Dental Implants",
    "Bone Grafting & Sinus Lift",
    "Invisalign Clear Aligners",
    "6 Porcelain Veneers",
  ],
  statusOptions = ["All Statuses", "In Progress", "Completed", "Cancelled"],
  onSearchChange,
  onProcedureSelect,
  onStatusSelect,
}: FilterSectionProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (onSearchChange) onSearchChange(value);
  };

  const handleProcedureChange = (procedure: string) => {
    if (onProcedureSelect) onProcedureSelect(procedure);
  };

  const handleStatusChange = (status: string) => {
    if (onStatusSelect) onStatusSelect(status);
  };

  return (
    <div className="w-full bg-white font-sans py-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
        {/* Left Side: Search Input Container */}
        <div className="relative flex items-center w-full sm:max-w-[320px]">
          <Search className="absolute left-3.5 w-4.5 h-4.5 text-[#94A3B8] stroke-2" />
          <input
            type="text"
            placeholder="Search by name, Procedure..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full h-11 pl-10 pr-4 bg-white border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-slate-400 focus:ring-0 transition-colors"
          />
        </div>

        {/* Right Side: Dropdown Action Filters Container */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Procedure Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center justify-between gap-3 h-11 px-5 bg-white border border-[#E2E8F0] rounded-full text-sm font-medium text-[#475569] hover:bg-slate-50 hover:border-slate-300 transition-all outline-none min-w-32.5">
              <span>{selectedProcedure || "Procedure"}</span>
              <ChevronDown className="w-4 h-4 text-[#64748B] stroke-2" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 bg-white border border-[#E2E8F0] rounded-xl shadow-md z-50"
            >
              {procedureOptions.map((option) => (
                <DropdownMenuItem
                  key={option}
                  onClick={() =>
                    handleProcedureChange(
                      option === "All Procedures" ? "" : option,
                    )
                  }
                  className="text-sm text-[#475569] focus:bg-slate-50 cursor-pointer py-2 px-3"
                >
                  {option}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center justify-between gap-3 h-11 px-5 bg-white border border-[#E2E8F0] rounded-full text-sm font-medium text-[#475569] hover:bg-slate-50 hover:border-slate-300 transition-all outline-none min-w-28">
              <span>{selectedStatus || "Status"}</span>
              <ChevronDown className="w-4 h-4 text-[#64748B] stroke-2" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-40 bg-white border border-[#E2E8F0] rounded-xl shadow-md z-50"
            >
              {statusOptions.map((option) => (
                <DropdownMenuItem
                  key={option}
                  onClick={() =>
                    handleStatusChange(option === "All Statuses" ? "" : option)
                  }
                  className="text-sm text-[#475569] focus:bg-slate-50 cursor-pointer py-2 px-3"
                >
                  {option}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
