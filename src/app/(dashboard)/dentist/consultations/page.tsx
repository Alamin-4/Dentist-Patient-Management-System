import { Suspense } from "react";
import ConsultationPage from "@/app/modules/dentist/consultation/ConsultationPage";

export default function ConsultationManage() {
  return (
    <div className="min-h-full ">
      <Suspense fallback={
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#163E5C]"></div>
        </div>
      }>
        <ConsultationPage />
      </Suspense>
    </div>
  );
}
