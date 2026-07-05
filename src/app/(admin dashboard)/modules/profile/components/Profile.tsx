"use client"

import { useUpdateAdminProfile } from "@/hooks/user/useUser";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { ProfileFormValues } from "./interface";
import toast from "react-hot-toast";
import { apiClient } from "@/api/client";
import { Camera, Mail } from "lucide-react";

export function ProfileInfo({ user, refetch }: { user: any; refetch: () => void }) {
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
            <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
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
            <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
                <h3 className="mb-5 text-base font-semibold text-[#1A1A2E]">Personal details</h3>
                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* First name */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-500">First name</label>
                        <input
                            disabled={updateProfileMutation.isPending}
                            {...register("firstName", { required: "First name is required" })}
                            className={`h-11 w-full rounded-lg border bg-white px-4 text-sm text-[#1A1A2E] outline-none focus:ring-1 focus:ring-[#1A1A2E] ${errors.firstName ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-[#1A1A2E]"
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
                            className={`h-11 w-full rounded-lg border bg-white px-4 text-sm text-[#1A1A2E] outline-none focus:ring-1 focus:ring-[#1A1A2E] ${errors.lastName ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-[#1A1A2E]"
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
                                className="h-11 w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-400 cursor-not-allowed outline-none"
                            />
                        </div>
                    </div>

                    <div className="mt-5 flex justify-end sm:col-span-2">
                        <button
                            type="submit"
                            disabled={updateProfileMutation.isPending}
                            className="flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white bg-[#1A1A2E] hover:bg-[#1A1A2E]/90 disabled:opacity-60 disabled:cursor-not-allowed min-w-[130px] cursor-pointer"
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

