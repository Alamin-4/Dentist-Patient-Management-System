"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, Search } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

const specialties = [
  "Implants & Oral Surgery",
  "Orthodontics",
  "Cosmetic Dentistry",
  "Periodontics",
  "Endodontics",
  "Prosthodontics",
  "Pediatric Dentistry",
  "General Dentistry",
];

const countries = [
  "Spain",
  "United States",
  "United Kingdom",
  "France",
  "Germany",
  "Italy",
  "Portugal",
  "Turkey",
  "Mexico",
  "Brazil",
];

interface BasicInfoData {
  fullName: string;
  credentials: string;
  yearsOfExperience: string;
  specialty: string;
  country: string;
}

interface BasicInfoFormProps {
  data: BasicInfoData;
  onChange: (field: keyof BasicInfoData, value: string) => void;
}

export default function BasicInfoForm({ data, onChange }: BasicInfoFormProps) {
  const [specialtyOpen, setSpecialtyOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [specialtySearch, setSpecialtySearch] = useState("");
  const [countrySearch, setCountrySearch] = useState("");

  const specialtyMatches = specialties.filter((specialty) =>
    specialty.toLowerCase().includes(specialtySearch.toLowerCase()),
  );

  const countryMatches = countries.filter((country) =>
    country.toLowerCase().includes(countrySearch.toLowerCase()),
  );

  const renderSelectionDialog = (
    open: boolean,
    setOpen: (value: boolean) => void,
    title: string,
    description: string,
    searchValue: string,
    setSearchValue: (value: string) => void,
    options: string[],
    onSelect: (value: string) => void,
  ) => (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100vw-1rem)] max-w-none rounded-[28px] border border-border bg-card p-0 shadow-2xl sm:max-w-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-5 sm:px-6">
          <div className="space-y-1">
            <DialogTitle className="text-xl font-semibold text-foreground sm:text-2xl">
              {title}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground sm:text-base">
              {description}
            </DialogDescription>
          </div>

          <DialogClose asChild>
            <button
              type="button"
              className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close selection dialog"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </DialogClose>
        </div>

        <div className="space-y-4 px-5 py-5 sm:px-6 sm:py-6">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search..."
              className="h-12 rounded-xl border-input pl-10 pr-4 text-base shadow-none focus-visible:ring-ring"
            />
          </div>

          <div className="max-h-[45vh] overflow-y-auto rounded-xl border border-border bg-background">
            {options.length ? (
              options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onSelect(option);
                    setOpen(false);
                    setSearchValue("");
                  }}
                  className="flex w-full items-center justify-between border-b border-border px-4 py-4 text-left transition-colors last:border-b-0 hover:bg-muted"
                >
                  <span className="text-sm font-medium text-foreground sm:text-base">
                    {option}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Select
                  </span>
                </button>
              ))
            ) : (
              <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                No results found.
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">
          Full name <span className="text-destructive">*</span>
        </Label>
        <Input
          value={data.fullName}
          onChange={(e) => onChange("fullName", e.target.value)}
          placeholder="Prof. Carlos Mendez"
          className="h-12 rounded-xl border-input px-4 text-base shadow-none focus-visible:ring-ring sm:h-14"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            Credentials <span className="text-destructive">*</span>
          </Label>
          <Input
            value={data.credentials}
            onChange={(e) => onChange("credentials", e.target.value)}
            placeholder="DDS, PhD"
            className="h-12 rounded-xl border-input px-4 text-base shadow-none focus-visible:ring-ring sm:h-14"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            Years of experience <span className="text-destructive">*</span>
          </Label>
          <Input
            value={data.yearsOfExperience}
            onChange={(e) => onChange("yearsOfExperience", e.target.value)}
            placeholder="24"
            type="number"
            min="0"
            className="h-12 rounded-xl border-input px-4 text-base shadow-none focus-visible:ring-ring sm:h-14"
          />
        </div>

        <div className="relative space-y-2">
          <Label className="text-sm font-medium text-foreground">
            Specialty <span className="text-destructive">*</span>
          </Label>
          <button
            type="button"
            onClick={() => {
              setSpecialtyOpen((current) => !current);
              setCountryOpen(false);
            }}
            className="flex h-12 w-full items-center justify-between rounded-xl border border-input bg-background px-4 text-left text-base transition-colors hover:bg-muted sm:h-14"
          >
            <span className={data.specialty ? "text-foreground" : "text-muted-foreground"}>
              {data.specialty || "Select specialty"}
            </span>
            <ChevronDown
              className={`size-5 text-muted-foreground transition-transform ${specialtyOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        <div className="relative space-y-2">
          <Label className="text-sm font-medium text-foreground">
            Country <span className="text-destructive">*</span>
          </Label>
          <button
            type="button"
            onClick={() => {
              setCountryOpen((current) => !current);
              setSpecialtyOpen(false);
            }}
            className="flex h-12 w-full items-center justify-between rounded-xl border border-input bg-background px-4 text-left text-base transition-colors hover:bg-muted sm:h-14"
          >
            <span className={data.country ? "text-foreground" : "text-muted-foreground"}>
              {data.country || "Select country"}
            </span>
            <ChevronDown
              className={`size-5 text-muted-foreground transition-transform ${countryOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>

      {renderSelectionDialog(
        specialtyOpen,
        setSpecialtyOpen,
        "Select Specialty",
        "Choose the specialty that best represents this KOL.",
        specialtySearch,
        setSpecialtySearch,
        specialtyMatches,
        (value) => onChange("specialty", value),
      )}

      {renderSelectionDialog(
        countryOpen,
        setCountryOpen,
        "Select Country",
        "Pick the country where this KOL is based.",
        countrySearch,
        setCountrySearch,
        countryMatches,
        (value) => onChange("country", value),
      )}
    </div>
  );
}
