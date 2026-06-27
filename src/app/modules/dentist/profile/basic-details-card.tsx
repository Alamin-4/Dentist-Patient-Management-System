import { Mail, Phone, MapPin, Briefcase, PencilLine } from "lucide-react";

interface BasicDetailsCardProps {
  dentist: any;
}

export function BasicDetailsCard({ dentist }: BasicDetailsCardProps) {
  const user = dentist?.user;
  const email = user?.email || "N/A";
  const phone = dentist?.phoneNumber || "N/A";
  
  const city = dentist?.dentistProfessionalData?.city;
  const countryCode = dentist?.country;
  let location = "N/A";
  if (city || countryCode) {
    const formattedCity = city 
      ? city.split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
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

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Basic Details</h3>
        <button className="text-gray-400 hover:text-[#163E5C] transition-colors">
          <PencilLine className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {details.map((item, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 text-gray-400">
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
  );
}
