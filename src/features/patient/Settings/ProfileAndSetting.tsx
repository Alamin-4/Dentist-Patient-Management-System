"use client";

import { useState, useRef, useEffect } from "react";
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
import { PageContainer } from "@/components/shared/page-container";
import { HeadingGroup } from "@/components/shared/heading-group";
import { SectionCard } from "@/components/shared/section-card";
import { useUrlTab } from "@/components/ui/tabs/useUrlTab";

export default function ProfileSettingsPage() {
  const [activeTab, setActiveTab] = useUrlTab("tab", "personal", ["personal", "password"]);
  const { data: response, isLoading, isError, refetch } = useGetMe();
  const uploadProfileImageMutation = useUpdateProfileImage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const user = (response as any)?.data || response;

  useEffect(() => {
    if (user?.image && previewUrl) {
      try {
        URL.revokeObjectURL(previewUrl);
      } catch (err) {
        console.error("Failed to revoke object URL:", err);
      }
      setPreviewUrl(null);
    }
  }, [user?.image]);

  const tabs = [
    { id: "personal", label: "Personal Information", icon: User },
    { id: "password", label: "Change Password", icon: Lock },
  ] as const;

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

    // Validate using the schema directly
    const result = avatarUploadSchema.safeParse({ avatar: files });
    if (!result.success) {
      const errorMessage = result.error.issues[0]?.message || "Invalid file";
      setError("avatar", { type: "manual", message: errorMessage });
      return;
    }

    // Clear previous errors
    setError("avatar", { type: "manual", message: "" });

    // Preview
    const file = files[0];
    if (file && file instanceof Blob) {
      try {
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
      } catch (err) {
        console.error("Failed to create object URL for preview:", err);
      }
    }

    setValue("avatar", files);
    onSubmit({ avatar: files });
  };

  const onSubmit = async (data: AvatarUploadFormValues) => {
    try {
      const file = data.avatar[0];
      await uploadProfileImageMutation.mutateAsync(file);
    } catch (error: any) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      // error is normalized to AppError by API interceptors
      const serverErrors = error?.errors || error?.response?.data?.errors;
      if (Array.isArray(serverErrors)) {
        serverErrors.forEach((err: { field: string; message: string }) => {
          if (err.field === "file" || err.field === "avatar" || err.field === "image") {
            setError("avatar", { type: "server", message: err.message });
          }
        });
      } else {
        const fallbackMsg = error?.message || error?.response?.data?.message || "Failed to upload profile photo";
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
      <PageContainer className="space-y-6 animate-pulse">
        <Skeleton className="h-9 w-60 rounded-md" />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column Sidebar Skeleton */}
          <SectionCard className="w-full lg:w-[320px] p-8 flex flex-col items-center">
            <Skeleton className="size-24 rounded-full mb-4" />
            <Skeleton className="h-5 w-32 rounded mb-2" />
            <Skeleton className="h-4 w-40 rounded mb-8" />
            <div className="w-full space-y-3">
              <Skeleton className="h-11 w-full rounded-lg" />
              <Skeleton className="h-11 w-full rounded-lg" />
            </div>
          </SectionCard>

          {/* Right Column Form Card Skeleton */}
          <SectionCard className="flex-1 p-8">
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
          </SectionCard>
        </div>
      </PageContainer>
    );
  }

  const displayName =
    user?.name ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    "User";

  return (
    <PageContainer className="space-y-6">
      <HeadingGroup title="Profile & Settings" />

      <div className="flex flex-col lg:flex-row gap-8">

        <SectionCard className="w-full lg:w-[320px] p-8 flex flex-col items-center">
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
              className="absolute bottom-0 right-0 size-8 bg-brand-deep-navy rounded-full border-2 border-white flex items-center justify-center text-white hover:bg-brand-deep-navy-hover transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Plus className="size-4" />
            </button>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              ref={(e) => {
                (fileInputRef as any).current = e;
              }}
              onChange={handleFileChange}
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
                  ? "bg-slate-100 text-brand-deep-navy"
                  : "text-slate-400 hover:text-slate-600"
                  }`}
              >
                <tab.icon
                  className={`size-5 ${activeTab === tab.id ? "text-brand-deep-navy" : "text-slate-400"}`}
                />
                {tab.label}
              </button>
            ))}
          </div>
        </SectionCard>

        {/* Content Area */}
        <SectionCard className="flex-1 p-8 lg:p-12">
          {activeTab === "personal" && <PersonalInfoForm user={user} />}
          {activeTab === "password" && <ChangePasswordForm />}
        </SectionCard>
      </div>
    </PageContainer>
  );
}
