"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useGetMe } from "@/hooks/user/useUser";
import { User, Lock } from "lucide-react";
import { ProfileInfo } from "./components/Profile";
import { ChangePassword } from "./components/ChangePassword";

type ProfileTabs = "profile" | "password";


export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTabs>("profile");
  const { data: response, isLoading, refetch } = useGetMe();

  const user = (response as any)?.data || response;

  const navItems = [
    { key: "profile" as ProfileTabs, label: "Profile Info", icon: User },
    { key: "password" as ProfileTabs, label: "Password", icon: Lock },
  ];

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-10 w-10 border-4 border-text border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const sectionLabel = activeTab === "profile" ? "ACCOUNT" : "PROFILE";

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">My Profile</h1>
        <p className="mt-0.5 text-sm text-gray-400">System / My Profile</p>
      </div>

      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        {/* Sidebar nav */}
        <div className="w-full rounded-lg border border-gray-100 bg-white p-3 shadow-sm sm:w-56 sm:shrink-0">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">{sectionLabel}</p>
          {navItems.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer",
                activeTab === key ? "bg-gray-100 text-text" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "profile" ? (
          <ProfileInfo user={user} refetch={refetch} />
        ) : (
          <ChangePassword />
        )}
      </div>
    </div>
  );
}
