import { DollarSign, CalendarCheck, FileText } from "lucide-react";

interface StatProps {
  icon: React.ReactNode;
  value: string;
  label: string;
}

export const StatCard = ({ icon, value, label }: StatProps) => (
  <div className="bg-white p-6 rounded-lg border border-gray-100 flex items-center gap-4 w-full">
    <div className="w-12 h-12 rounded-full bg-[#F8FAFC] flex items-center justify-center text-[#113254] border border-gray-50">
      {icon}
    </div>
    <div>
      <h3 className="text-2xl font-bold text-[#1A1A2E]">{value}</h3>
      <p className="text-sm font-medium text-[#6B7280]">{label}</p>
    </div>
  </div>
);
