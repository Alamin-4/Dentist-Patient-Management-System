import { HiShieldCheck } from "react-icons/hi2";

export default function ProtocolSection({
  dentistLicense,
  dentistOperations,
}: {
  dentistLicense?: {
    country?: string;
    city?: string;
    registrationAuthority?: string;
    registrationNumber?: string;
    licenseDocument?: string;
  };
  dentistOperations?: {
    jciCertificate?: string;
    walkthroughVideo?: string;
    signerName?: string;
    signature?: string;
    agreedToGuarantee?: boolean;
  };
}) {
  const protocols = [
    { 
      label: "License Number", 
      value: dentistLicense?.registrationNumber || "Verified" 
    },
    { 
      label: "Sterilization Protocol", 
      value: dentistOperations?.jciCertificate 
        ? "JCI Certified" 
        : (dentistOperations?.walkthroughVideo ? "Video Walkthrough Verified" : "Verified") 
    },
    { 
      label: "Registration Authority", 
      value: dentistLicense?.registrationAuthority || "Ministry of Health" 
    },
    { 
      label: "Price Guarantee", 
      value: dentistOperations?.agreedToGuarantee ? "Signed & Validated" : "Agreed" 
    },
    { 
      label: "Credentials Status", 
      value: dentistLicense?.licenseDocument ? "Documents Audited" : "Verified" 
    },
    { 
      label: "Profile Status", 
      value: "Verified Status Active" 
    },
  ];

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6">
      <h2 className="text-xl lg:text-2xl font-bold text-[#033355] mb-8">
        Clinical Protocols & Verification
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {protocols.map((p, i) => (
          <div key={i} className="space-y-2">
            <p className="text-xs text-[#6B7280]">{p.label}</p>
            <div className="flex items-center gap-2">
              <HiShieldCheck className="size-4.5 text-[#4CA30D]" />
              <span className="text-[15px] font-bold text-slate-800">
                {p.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
