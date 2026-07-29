"use client";

import { useState, useRef } from "react";
import { User, Lock, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { avatarUploadSchema, AvatarUploadFormValues } from "@/validation/settings-schemas";
import { PersonalInfoForm } from "./PersonalInfoForm";
import { ChangePasswordForm } from "./ChangePassword";
import { useGetMe, useUpdateProfileImage } from "@/hooks/user/useUser";
import { S3Image } from "@/components/ui/s3-image";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";

export default function ProfileSettingsPage() {
  const [activeTab, setActiveTab] = useState("personal");
  const { data: response, isLoading, isError, refetch } = useGetMe();
  const uploadProfileImageMutation = useUpdateProfileImage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const user = (response as any)?.data || response;

  const tabs = [
    { id: "personal", label: "Personal Information", icon: User },
    { id: "password", label: "Change Password", icon: Lock },
  ];

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors: formErrors },
  } = useForm<AvatarUploadFormValues>({
    resolver: zodResolver(avatarUploadSchema),
  });

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setValue("avatar", files, { shouldValidate: true });

    const file = files[0];
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    handleSubmit(onSubmit)();
  };

  const onSubmit = async (data: AvatarUploadFormValues) => {
    try {
      const file = data.avatar[0];
      await uploadProfileImageMutation.mutateAsync(file);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    } catch (error: any) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      const serverErrors = error?.response?.data?.errors;
      if (Array.isArray(serverErrors)) {
        serverErrors.forEach((err: { field: string; message: string }) => {
          if (err.field === "file" || err.field === "avatar") {
            setError("avatar", { type: "server", message: err.message });
          }
        });
      } else {
        const fallbackMsg = error?.response?.data?.message || "Failed to upload profile photo";
        setError("avatar", { type: "server", message: fallbackMsg });
      }
    }
  };

  if (isError) {
    return (
      <div className="py-12">
        <ErrorState
          title="Failed to Load Settings"
          message="We could not retrieve your profile settings. Please check your network and try again."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <Skeleton className="h-9 w-60 rounded-md" />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column Sidebar Skeleton */}
          <div className="w-full lg:w-[320px] bg-white rounded-lg border border-slate-100 p-8 flex flex-col items-center">
            <Skeleton className="size-24 rounded-full mb-4" />
            <Skeleton className="h-5 w-32 rounded mb-2" />
            <Skeleton className="h-4 w-40 rounded mb-8" />
            <div className="w-full space-y-3">
              <Skeleton className="h-11 w-full rounded-lg" />
              <Skeleton className="h-11 w-full rounded-lg" />
            </div>
          </div>

          {/* Right Column Form Card Skeleton */}
          <div className="flex-1 bg-white rounded-lg border border-slate-100 p-8">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
              <Skeleton className="h-6 w-48 rounded" />
              <Skeleton className="h-8 w-24 rounded" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="space-y-2">
                  <Skeleton className="h-4 w-28 rounded" />
                  <Skeleton className="h-11 w-full rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const displayName =
    user?.name ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    "User";

  return (
    <div className="">
      <h1 className="text-2xl lg:text-3xl font-bold text-text mb-8">
        Profile & Settings
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">

        <div className="w-full lg:w-[320px] bg-white rounded-lg border border-slate-100 p-8 flex flex-col items-center">
          <div className="relative group mb-4">
            <div className="size-24 rounded-full overflow-hidden border-2 border-slate-50 relative bg-slate-100">
              <S3Image
                src={previewUrl || user?.image || "/profile-avatar.png"}
                alt="Profile"
                fill
                className="object-cover"
                fallbackType="avatar"
              />
              {uploadProfileImageMutation.isPending && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            <button
              onClick={handleAvatarClick}
              disabled={uploadProfileImageMutation.isPending}
              className="absolute bottom-0 right-0 size-8 bg-[#0F3659] rounded-full border-2 border-white flex items-center justify-center text-white hover:bg-[#0a2640] transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Plus className="size-4" />
            </button>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              {...register("avatar")}
              ref={(e) => {
                register("avatar").ref(e);
                (fileInputRef as any).current = e;
              }}
              onChange={(e) => {
                register("avatar").onChange(e);
                handleFileChange(e);
              }}
              className="hidden"
            />
          </div>

          {formErrors.avatar && (
            <p className="text-red-500 text-xs font-semibold mb-4 text-center max-w-60">
              {formErrors.avatar.message}
            </p>
          )}

          <h3 className="text-2xl font-bold text-text text-center">{displayName}</h3>
          <p className="text-slate-400 font-medium text-sm mb-10 text-center">
            {user?.email || ""}
          </p>

          <div className="w-full space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-lg font-bold transition-all text-left cursor-pointer ${activeTab === tab.id
                  ? "bg-[#F1F5F9] text-[#0F3659]"
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
