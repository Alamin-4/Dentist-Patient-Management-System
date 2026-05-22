"use client";

import { useState } from "react";
import Image from "next/image";
import { User, Lock, CreditCard, Plus } from "lucide-react";
import { PersonalInfoForm } from "./PersonalInfoForm";
import { ChangePasswordForm } from "./ChangePassword";
import { PaymentMethodsView } from "./PaymentMethodForm";

export default function ProfileSettingsPage() {
  const [activeTab, setActiveTab] = useState("personal");

  const tabs = [
    { id: "personal", label: "Personal Information", icon: User },
    { id: "password", label: "Change Password", icon: Lock },
    { id: "payment", label: "Payment Methods", icon: CreditCard },
  ];

  return (
    <div className="">
      <h1 className="text-2xl lg:text-3xl font-bold text-[#1A1A2E] mb-8">
        Profile & Settings
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation - Matches image_2d8437.png */}
        <div className="w-full lg:w-[320px] bg-white rounded-2xl border border-slate-100 p-8 flex flex-col items-center">
          <div className="relative group mb-4">
            <div className="size-24 rounded-full overflow-hidden border-2 border-slate-50 relative">
              <Image
                src="/profile-avatar.png" // Replace with your image
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
            <button className="absolute bottom-0 right-0 size-8 bg-[#0F3659] rounded-full border-2 border-white flex items-center justify-center text-white hover:bg-[#0a2640] transition-colors">
              <Plus className="size-4" />
            </button>
          </div>

          <h3 className="text-2xl font-bold text-[#1A1A2E]">John Will</h3>
          <p className="text-slate-400 font-medium text-sm mb-10">
            johnwill@gmail.com
          </p>

          <div className="w-full space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl font-bold transition-all text-left ${
                  activeTab === tab.id
                    ? "bg-[#F1F5F9] text-[#0F3659] border border-slate-100"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <tab.icon
                  className={`size-5 ${activeTab === tab.id ? "text-[#0F3659]" : "text-slate-400"}`}
                />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-100 p-8 lg:p-12">
          {activeTab === "personal" && <PersonalInfoForm />}
          {activeTab === "password" && <ChangePasswordForm />}
          {activeTab === "payment" && <PaymentMethodsView />}
        </div>
      </div>
    </div>
  );
}
