import { CheckCircle2 } from "lucide-react";

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
      label: "Licence",
      value: dentistLicense?.registrationNumber ? "Verified" : "Pending Claim"
    },
    {
      label: "Sterilization protocol",
      value: dentistOperations?.walkthroughVideo ? "In-app video submitted" : "Verified"
    },
    {
      label: "CE certificate Veneers",
      value: dentistLicense?.licenseDocument ? "Accepted" : "Accepted"
    },
    {
      label: "CE certificate Implants",
      value: "Accepted"
    },
    {
      label: "Material supplier invoices",
      value: "Publicly visible"
    },
    {
      label: "Profile freshness",
      value: "Updated 14 days ago"
    },
  ];

  return (
    <section id="protocols" className="rounded-lg border border-slate-200 bg-white p-6">
      <h2 className="text-xl lg:text-2xl font-bold text-[#0E3E65] mb-6">
        Clinical Protocols & Verification
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-12">
        {protocols.map((p, i) => (
          <div key={i} className="space-y-1">
            <p className="text-xs text-[#6B7280]">{p.label}</p>
            <div className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.9066 3.08988L9.78156 1.54488C9.35406 1.38738 8.65656 1.38738 8.22906 1.54488L4.10406 3.08988C3.30906 3.38988 2.66406 4.31988 2.66406 5.16738V11.2424C2.66406 11.8499 3.06156 12.6524 3.54906 13.0124L7.67406 16.0949C8.40156 16.6424 9.59406 16.6424 10.3216 16.0949L14.4466 13.0124C14.9341 12.6449 15.3316 11.8499 15.3316 11.2424V5.16738C15.3391 4.31988 14.6941 3.38988 13.9066 3.08988ZM11.6116 7.28988L8.38656 10.5149C8.27406 10.6274 8.13156 10.6799 7.98906 10.6799C7.84656 10.6799 7.70406 10.6274 7.59156 10.5149L6.39156 9.29988C6.17406 9.08238 6.17406 8.72238 6.39156 8.50488C6.60906 8.28738 6.96906 8.28738 7.18656 8.50488L7.99656 9.31488L10.8241 6.48738C11.0416 6.26988 11.4016 6.26988 11.6191 6.48738C11.8366 6.70488 11.8366 7.07238 11.6116 7.28988Z" fill="#4CA30D" />
              </svg>

              <span className="text-[14px] font-medium text-[#1A1A2E]">
                {p.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
