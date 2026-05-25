import { SquarePen, FileText } from "lucide-react";

interface PricingItem {
  id: string;
  title: string;
  description: string;
  price: number;
}

const pricingData: PricingItem[] = [
  {
    id: "1",
    title: "Professional teeth whitening",
    description: "One-hour session with custom trays",
    price: 450,
  },
  {
    id: "2",
    title: "Full orthodontic braces",
    description: "Includes initial consultation and adjustments",
    price: 3500,
  },
  {
    id: "3",
    title: "Single dental implant",
    description: "Includes treatment plan review",
    price: 1200,
  },
];

export default function PricingProtocolSection() {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className=" bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden p-6 font-sans">
      <div className="flex items-center justify-between pb-5 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-[#0F172A]">
          Pricing Protocols
        </h2>
        <button
          className="p-2 text-[#0F172A] hover:bg-gray-50 rounded-lg transition-colors duration-150"
          aria-label="Edit pricing protocols"
        >
          <SquarePen className="w-5 h-5 stroke-[1.5]" />
        </button>
      </div>

      <div className="divide-y divide-gray-100">
        {pricingData.map((item) => (
          <div
            key={item.id}
            className="py-5 flex items-start justify-between gap-4"
          >
            <div className="space-y-1">
              <h3 className="text-[17px] font-semibold text-[#0F172A]">
                {item.title}
              </h3>
              <p className="text-[15px] text-[#64748B]">{item.description}</p>
            </div>
            <div className="text-lg font-bold text-[#1E3A8A] whitespace-nowrap pt-0.5">
              {formatPrice(item.price)}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between p-4 bg-white border border-[#E2E8F0] rounded-xl hover:border-gray-300 transition-colors duration-150 cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-[#FFF1F2] rounded-lg border border-[#FFE4E6]">
              <FileText className="w-6 h-6 text-[#F43F5E] stroke-[1.5]" />
            </div>
            <div className="space-y-0.5">
              <p className="text-[15px] font-medium text-[#0F172A] group-hover:underline">
                JCI License Certificate.pdf
              </p>
              <p className="text-CD text-[13px] text-[#64748B]">2.4 MB</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
