"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { User, Lock, Camera, Eye, EyeOff, Check, Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetMe, useUpdateAdminProfile, useChangePassword } from "@/hooks/user/useUser";
import { apiClient } from "@/api/client";
import toast from "react-hot-toast";

type ProfileTab = "profile" | "password";

/* ─── Profile Info section ──────────────────────────────────────────────── */
interface ProfileFormValues {
  firstName: string;
  lastName: string;
}

function ProfileInfo({ user, refetch }: { user: any; refetch: () => void }) {
  const updateProfileMutation = useUpdateAdminProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    mode: "onTouched",
  });

  useEffect(() => {
    if (user) {
      setValue("firstName", user.firstName || "");
      setValue("lastName", user.lastName || "");
    }
  }, [user, setValue]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      const res = await updateProfileMutation.mutateAsync(data);
      toast.success(res?.message || "Profile updated successfully");
      refetch();
    } catch (error: any) {
      const errMsg = error?.response?.data?.message || error?.message || "Failed to update profile";
      toast.error(errMsg);
    }
  };

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
        throw new Error("Failed to upload image");
      }

      await updateProfileMutation.mutateAsync({
        image: secureUrl,
      });

      toast.success("Profile photo updated successfully");
      refetch();
    } catch (error: any) {
      toast.error(error?.message || "Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };

  const initials =
    [user?.firstName, user?.lastName]
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "AD";

  return (
    <div className="flex-1 space-y-6">
      {/* Avatar card */}
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative">
            {user?.image ? (
              <div className="h-16 w-16 overflow-hidden rounded-full border border-gray-100">
                <img
                  src={user.image}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white bg-purple-600">
                {initials}
              </div>
            )}
            <button
              onClick={handleAvatarClick}
              disabled={uploading}
              className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-[#1A1A2E] text-white shadow hover:bg-[#1A1A2E]/90 disabled:opacity-50 cursor-pointer"
            >
              <Camera className="h-3 w-3" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          <div>
            <p className="text-lg font-bold text-[#1A1A2E]">
              {[user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Admin"}
            </p>
            <p className="text-sm text-gray-400">
              {user?.role === "SUPER_ADMIN" ? "Super Admin" : "Administrator"}
            </p>
          </div>
        </div>
      </div>

      {/* Personal details */}
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <h3 className="mb-5 text-base font-semibold text-[#1A1A2E]">Personal details</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* First name */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-500">First name</label>
            <input
              disabled={updateProfileMutation.isPending}
              {...register("firstName", { required: "First name is required" })}
              className={`h-11 w-full rounded-xl border bg-white px-4 text-sm text-[#1A1A2E] outline-none focus:ring-1 focus:ring-[#1A1A2E] ${
                errors.firstName ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-[#1A1A2E]"
              }`}
            />
            {errors.firstName && (
              <p className="mt-1 text-xs text-red-600 font-semibold">{errors.firstName.message}</p>
            )}
          </div>
          
          {/* Last name */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-500">Last name</label>
            <input
              disabled={updateProfileMutation.isPending}
              {...register("lastName", { required: "Last name is required" })}
              className={`h-11 w-full rounded-xl border bg-white px-4 text-sm text-[#1A1A2E] outline-none focus:ring-1 focus:ring-[#1A1A2E] ${
                errors.lastName ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-[#1A1A2E]"
              }`}
            />
            {errors.lastName && (
              <p className="mt-1 text-xs text-red-600 font-semibold">{errors.lastName.message}</p>
            )}
          </div>
          
          {/* Email - Read-only */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-500">Email address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={user?.email || ""}
                disabled
                readOnly
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-400 cursor-not-allowed outline-none"
              />
            </div>
          </div>

          <div className="mt-5 flex justify-end sm:col-span-2">
            <button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white bg-[#1A1A2E] hover:bg-[#1A1A2E]/90 disabled:opacity-60 disabled:cursor-not-allowed min-w-[130px] cursor-pointer"
            >
              {updateProfileMutation.isPending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Save changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Change Password section ───────────────────────────────────────────── */
interface PasswordFormValues {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

function ChangePassword() {
  const changePasswordMutation = useChangePassword();
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    mode: "onTouched",
  });

  const newPasswordVal = watch("newPassword") || "";

  const onSubmit = async (data: PasswordFormValues) => {
    try {
      const res = await changePasswordMutation.mutateAsync({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      toast.success(res?.message || "Password changed successfully");
      reset();
    } catch (error: any) {
      const errMsg = error?.response?.data?.message || error?.message || "Failed to change password";
      toast.error(errMsg);
    }
  };

  // Real-time requirement checks
  const checks = {
    length: newPasswordVal.length >= 8,
    casing: /[a-z]/.test(newPasswordVal) && /[A-Z]/.test(newPasswordVal),
    number: /[0-9]/.test(newPasswordVal),
    special: /[^a-zA-Z0-9]/.test(newPasswordVal),
  };

  return (
    <div className="flex-1">
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <Lock className="h-5 w-5 text-gray-400" />
          <div>
            <h3 className="text-base font-semibold text-[#1A1A2E]">Change Password</h3>
            <p className="text-sm text-gray-400">Choose a strong password with at least 8 characters.</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Old Password */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-500">Current password</label>
            <div className="relative">
              <input
                type={showOld ? "text" : "password"}
                disabled={changePasswordMutation.isPending}
                placeholder="Enter old password"
                {...register("oldPassword", { required: "Current password is required" })}
                className={`h-12 w-full rounded-xl border bg-white px-4 pr-11 text-sm text-[#1A1A2E] outline-none placeholder:text-gray-300 focus:ring-1 focus:ring-[#1A1A2E] ${
                  errors.oldPassword ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-[#1A1A2E]"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showOld ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.oldPassword && (
              <p className="mt-1 text-xs text-red-600 font-semibold">{errors.oldPassword.message}</p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-500">New password</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                disabled={changePasswordMutation.isPending}
                placeholder="Min 8 characters"
                {...register("newPassword", {
                  required: "New password is required",
                  minLength: { value: 8, message: "New password must be at least 8 characters long" },
                })}
                className={`h-12 w-full rounded-xl border bg-white px-4 pr-11 text-sm text-[#1A1A2E] outline-none placeholder:text-gray-300 focus:ring-1 focus:ring-[#1A1A2E] ${
                  errors.newPassword ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-[#1A1A2E]"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="mt-1 text-xs text-red-600 font-semibold">{errors.newPassword.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-500">Confirm new password</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                disabled={changePasswordMutation.isPending}
                placeholder="Re-enter new password"
                {...register("confirmNewPassword", {
                  required: "Please confirm your password",
                  validate: (val) => val === newPasswordVal || "Passwords must match",
                })}
                className={`h-12 w-full rounded-xl border bg-white px-4 pr-11 text-sm text-[#1A1A2E] outline-none placeholder:text-gray-300 focus:ring-1 focus:ring-[#1A1A2E] ${
                  errors.confirmNewPassword ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-[#1A1A2E]"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmNewPassword && (
              <p className="mt-1 text-xs text-red-600 font-semibold">{errors.confirmNewPassword.message}</p>
            )}
          </div>
        </div>

        {/* Requirements check list */}
        <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
          <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Password Requirements</p>
          <div className="space-y-1.5">
            {[
              { key: "length", label: "At least 8 characters" },
              { key: "casing", label: "Uppercase & lowercase letters" },
              { key: "number", label: "At least one number" },
              { key: "special", label: "At least one special character" },
            ].map((r) => (
              <div key={r.key} className="flex items-center gap-2">
                <div className={cn("flex h-4 w-4 shrink-0 items-center justify-center rounded-full", checks[r.key as keyof typeof checks] ? "bg-emerald-500 text-white" : "border border-gray-300")}>
                  {checks[r.key as keyof typeof checks] && <Check className="h-2.5 w-2.5" />}
                </div>
                <span className={cn("text-xs", checks[r.key as keyof typeof checks] ? "text-emerald-600" : "text-gray-400")}>{r.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4">
          <p className="flex items-center gap-1.5 text-xs text-gray-400">
            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-gray-300 text-[9px]">i</span>
            You will be asked to log in again after changing your password.
          </p>
          <button
            type="submit"
            disabled={changePasswordMutation.isPending || !Object.values(checks).every(Boolean) || newPasswordVal !== watch("confirmNewPassword")}
            className={cn(
              "flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors cursor-pointer min-w-[160px]",
              changePasswordMutation.isPending || !Object.values(checks).every(Boolean) || newPasswordVal !== watch("confirmNewPassword")
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-[#1A1A2E] hover:bg-[#1A1A2E]/90"
            )}
          >
            {changePasswordMutation.isPending ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Lock className="h-4 w-4" /> Update password
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */
export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("profile");
  const { data: response, isLoading, refetch } = useGetMe();

  const user = response?.data || response;

  const navItems = [
    { key: "profile" as ProfileTab, label: "Profile Info", icon: User },
    { key: "password" as ProfileTab, label: "Password", icon: Lock },
  ];

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-10 w-10 border-4 border-[#1A1A2E] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const sectionLabel = activeTab === "profile" ? "ACCOUNT" : "PROFILE";

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#1A1A2E]">My Profile</h1>
        <p className="mt-0.5 text-sm text-gray-400">System / My Profile</p>
      </div>

      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        {/* Sidebar nav */}
        <div className="w-full rounded-xl border border-gray-100 bg-white p-3 shadow-sm sm:w-56 sm:shrink-0">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">{sectionLabel}</p>
          {navItems.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer",
                activeTab === key ? "bg-gray-100 text-[#1A1A2E]" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
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
