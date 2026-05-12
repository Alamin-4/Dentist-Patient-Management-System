import { CalendarCheck, DollarSign, FileText } from "lucide-react";
import { StatCard } from "./_components/Module/Overview/StatsCard";
import { ConsultationCard } from "./_components/Module/Overview/ConsultationCard";

export default function Overview() {
  return (
    <div className="">
      <div className="">
        <h1 className="text-2xl font-bold text-[#1A1A2E] mb-8">Overview</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<DollarSign className="w-5 h-5" />}
            value="$1500"
            label="Amount in escrow"
          />
          <StatCard
            icon={<CalendarCheck className="w-5 h-5" />}
            value="02"
            label="Booking Completed"
          />
          <StatCard
            icon={<FileText className="w-5 h-5" />}
            value="08"
            label="Documents stored"
          />
        </div>

        {/* Consultation Section */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100">
          <h2 className="text-xl font-bold text-[#1A1A2E] mb-6">
            Consultation
          </h2>
          <div className="space-y-6">
            <ConsultationCard />
            <ConsultationCard />
          </div>
        </div>
      </div>
    </div>
  );
}
