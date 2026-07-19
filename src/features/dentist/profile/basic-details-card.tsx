"use client";

import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Briefcase, PencilLine, Loader2 } from "lucide-react";
import { DentistProfileData } from "./profile.types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useProfessionalDetailsMutation } from "@/core/hooks/dentist/useDentist";
import toast from "react-hot-toast";

interface BasicDetailsCardProps {
  dentist?: DentistProfileData | null;
}

export function BasicDetailsCard({ dentist }: BasicDetailsCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState<number | string>("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  const updateMutation = useProfessionalDetailsMutation();

  useEffect(() => {
    if (dentist) {
      setPhoneNumber(dentist.phoneNumber || "");
      setYearsOfExperience(dentist.dentistProfessionalData?.yearsOfExperience ?? 0);
      setCity(dentist.dentistProfessionalData?.city || "");
      setCountry(dentist.country || "");
    }
  }, [dentist, isOpen]);

  const user = dentist?.user;
  const email = user?.email || "N/A";
  const phone = dentist?.phoneNumber || "N/A";

  const dentistCity = dentist?.dentistProfessionalData?.city;
  const countryCode = dentist?.country;
  let location = "N/A";
  if (dentistCity || countryCode) {
    const formattedCity = dentistCity
      ? dentistCity.split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
      : "";
    const formattedCountry = countryCode ? countryCode.toUpperCase() : "";
    location = [formattedCity, formattedCountry].filter(Boolean).join(", ");
  }

  const experienceYears = dentist?.dentistProfessionalData?.yearsOfExperience;
  const experience = experienceYears ? `${experienceYears} Years` : "N/A";

  const details = [
    { icon: Mail, label: "Email", value: email },
    { icon: Phone, label: "Phone Number", value: phone },
    { icon: MapPin, label: "Location", value: location },
    { icon: Briefcase, label: "Experience", value: experience },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      toast.error("Phone number is required");
      return;
    }
    if (!city.trim()) {
      toast.error("City is required");
      return;
    }
    if (!country.trim()) {
      toast.error("Country is required");
      return;
    }

    updateMutation.mutate(
      {
        phoneNumber,
        yearsOfExperience: Number(yearsOfExperience),
        city,
        country,
        legalName: dentist?.user?.name || "",
        primarySpecialty: dentist?.specialty?.name || "",
      },
      {
        onSuccess: () => {
          toast.success("Profile details updated successfully!");
          setIsOpen(false);
        },
        onError: (err: any) => {
          const errMsg = err?.response?.data?.message || err?.message || "Failed to update profile details";
          toast.error(errMsg);
        },
      }
    );
  };

  return (
    <>
      <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Basic Details</h3>
          <button
            onClick={() => setIsOpen(true)}
            className="text-gray-400 hover:text-[#163E5C] transition-colors cursor-pointer"
          >
            <PencilLine className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {details.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-50 text-gray-400">
                <item.icon className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-gray-400">{item.label}</p>
                <p className="text-sm font-semibold text-gray-900">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md bg-white border border-slate-200 shadow-xl rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-[#0A2533] font-bold text-xl">Edit Basic Details</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="font-semibold text-slate-700 text-sm">
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 234 567 890"
                className="border-slate-200 focus:border-[#163E5C] h-10 text-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="yearsOfExperience" className="font-semibold text-slate-700 text-sm">
                Years of Experience
              </Label>
              <Input
                id="yearsOfExperience"
                type="number"
                min="0"
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(e.target.value)}
                placeholder="5"
                className="border-slate-200 focus:border-[#163E5C] h-10 text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="font-semibold text-slate-700 text-sm">
                  City
                </Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Monterrey"
                  className="border-slate-200 focus:border-[#163E5C] h-10 text-sm"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country" className="font-semibold text-slate-700 text-sm">
                  Country
                </Label>
                <Input
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Mexico"
                  className="border-slate-200 focus:border-[#163E5C] h-10 text-sm"
                  required
                />
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-slate-100 mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="border-slate-200 text-slate-600 hover:bg-slate-50 h-10 text-sm cursor-pointer"
                disabled={updateMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#163E5C] hover:bg-[#113149] text-white font-semibold h-10 text-sm px-6 cursor-pointer flex items-center gap-2 transition-all active:scale-[0.98]"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
