"use client"

import { useChangePassword } from "@/hooks/user/useUser";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { PasswordFormValues } from "./interface";
import toast from "react-hot-toast";
import { Lock, Eye, EyeOff, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChangePassword() {
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

    const checks = {
        length: newPasswordVal.length >= 8,
        casing: /[a-z]/.test(newPasswordVal) && /[A-Z]/.test(newPasswordVal),
        number: /[0-9]/.test(newPasswordVal),
        special: /[^a-zA-Z0-9]/.test(newPasswordVal),
    };

    return (
        <div className="flex-1">
            <form onSubmit={handleSubmit(onSubmit)} className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                    <Lock className="h-5 w-5 text-gray-400" />
                    <div>
                        <h3 className="text-base font-semibold text-text">Change Password</h3>
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
                                className={`h-12 w-full rounded-lg border bg-white px-4 pr-11 text-sm text-text outline-none placeholder:text-gray-300 focus:ring-1 focus:ring-text ${errors.oldPassword ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-text"
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
                                className={`h-12 w-full rounded-lg border bg-white px-4 pr-11 text-sm text-text outline-none placeholder:text-gray-300 focus:ring-1 focus:ring-text ${errors.newPassword ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-text"
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
                                className={`h-12 w-full rounded-lg border bg-white px-4 pr-11 text-sm text-text outline-none placeholder:text-gray-300 focus:ring-1 focus:ring-text ${errors.confirmNewPassword ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-text"
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
                <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50 p-4">
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
                            "flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-colors cursor-pointer min-w-[160px]",
                            changePasswordMutation.isPending || !Object.values(checks).every(Boolean) || newPasswordVal !== watch("confirmNewPassword")
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-text hover:bg-text/90"
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
