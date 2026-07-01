"use client";

import { useState, useRef } from "react";
import NextImage from "next/image";
import { User, Lock, Plus } from "lucide-react";
import { PersonalInfoForm } from "./PersonalInfoForm";
import { ChangePasswordForm } from "./ChangePassword";
import { useGetMe, useUpdatePatientProfile } from "@/hooks/user/useUser";
import { apiClient } from "@/api/client";
import toast from "react-hot-toast";

export default function ProfileSettingsPage() {
  const [activeTab, setActiveTab] = useState("personal");
  const { data: response, isLoading, refetch } = useGetMe();
  const updatePatientProfileMutation = useUpdatePatientProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const user = response?.data || response;

  const tabs = [
    { id: "personal", label: "Personal Information", icon: User },
    { id: "password", label: "Change Password", icon: Lock },
  ];

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const res = await apiClient.files.upload(file);
      const secureUrl = res?.data?.secure_url;
      if (!secureUrl) {
        throw new Error("Failed to retrieve image URL from upload response");
      }

      await updatePatientProfileMutation.mutateAsync({
        image: secureUrl,
      });

      toast.success("Profile photo updated successfully");
      refetch();
    } catch (error: any) {
      toast.error(error?.message || "Failed to upload profile photo");
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-10 w-10 border-4 border-[#0F3659] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const displayName =
    user?.name ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    "User";

  return (
    <div className="">
      <h1 className="text-2xl lg:text-3xl font-bold text-[#1A1A2E] mb-8">
        Profile & Settings
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-[320px] bg-white rounded-lg border border-slate-100 p-8 flex flex-col items-center">
          <div className="relative group mb-4">
            <div className="size-24 rounded-full overflow-hidden border-2 border-slate-50 relative bg-slate-100">
              <NextImage
                src={user?.image || "/profile-avatar.png"}
                alt="Profile"
                fill
                className="object-cover"
              />
              {uploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            <button
              onClick={handleAvatarClick}
              disabled={uploading}
              className="absolute bottom-0 right-0 size-8 bg-[#0F3659] rounded-full border-2 border-white flex items-center justify-center text-white hover:bg-[#0a2640] transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Plus className="size-4" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          <h3 className="text-2xl font-bold text-[#1A1A2E] text-center">{displayName}</h3>
          <p className="text-slate-400 font-medium text-sm mb-10 text-center">
            {user?.email || ""}
          </p>

          <div className="w-full space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-lg font-bold transition-all text-left cursor-pointer ${activeTab === tab.id
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
        <div className="flex-1 bg-white rounded-lg border border-slate-100 p-8 lg:p-12">
          {activeTab === "personal" && <PersonalInfoForm user={user} />}
          {activeTab === "password" && <ChangePasswordForm />}
        </div>
      </div>
    </div>
  );
}
