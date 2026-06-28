"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useChangePassword } from "@/hooks/user/useUser";

interface FormValues {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export default function ChangePassword() {
  const changePasswordMutation = useChangePassword();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormValues>({ mode: "onTouched" });

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onSubmit = async (data: FormValues) => {
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

  const newVal = watch("newPassword");

  return (
    <section className="rounded-xl border border-[#EEF2F7] bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-[#0E3E65]">Change Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
        {/* Old Password */}
        <div>
          <label className="block text-sm font-medium text-[#475569] mb-2">Old Password</label>
          <div className="relative">
            <input
              type={showOld ? "text" : "password"}
              disabled={changePasswordMutation.isPending}
              {...register("oldPassword", { required: "Old password is required" })}
              className={`w-full rounded-md border px-4 py-3 text-sm bg-white outline-none focus:ring-1 focus:ring-[#0F3659] ${
                errors.oldPassword ? "border-red-500 focus:ring-red-500" : "border-slate-200"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowOld((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500 cursor-pointer"
            >
              {showOld ? "Hide" : "Show"}
            </button>
          </div>
          {errors.oldPassword && (
            <p className="mt-1 text-xs text-red-600 font-semibold">{errors.oldPassword.message}</p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-[#475569] mb-2">New Password</label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              disabled={changePasswordMutation.isPending}
              {...register("newPassword", {
                required: "New password is required",
                minLength: { value: 8, message: "New password must be at least 8 characters long" },
              })}
              className={`w-full rounded-md border px-4 py-3 text-sm bg-white outline-none focus:ring-1 focus:ring-[#0F3659] ${
                errors.newPassword ? "border-red-500 focus:ring-red-500" : "border-slate-200"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowNew((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500 cursor-pointer"
            >
              {showNew ? "Hide" : "Show"}
            </button>
          </div>
          {errors.newPassword && (
            <p className="mt-1 text-xs text-red-600 font-semibold">{errors.newPassword.message}</p>
          )}
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="block text-sm font-medium text-[#475569] mb-2">Confirm New Password</label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              disabled={changePasswordMutation.isPending}
              {...register("confirmNewPassword", {
                required: "Please confirm your new password",
                validate: (val) => val === newVal || "Passwords must match",
              })}
              className={`w-full rounded-md border px-4 py-3 text-sm bg-white outline-none focus:ring-1 focus:ring-[#0F3659] ${
                errors.confirmNewPassword ? "border-red-500 focus:ring-red-500" : "border-slate-200"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500 cursor-pointer"
            >
              {showConfirm ? "Hide" : "Show"}
            </button>
          </div>
          {errors.confirmNewPassword && (
            <p className="mt-1 text-xs text-red-600 font-semibold">{errors.confirmNewPassword.message}</p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            disabled={changePasswordMutation.isPending}
            onClick={() => reset()}
            className="rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            Reject
          </button>

          <button
            type="submit"
            disabled={changePasswordMutation.isPending}
            className="rounded-md bg-[#0F3659] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed hover:bg-[#0a2640] cursor-pointer flex items-center justify-center min-w-[140px]"
          >
            {changePasswordMutation.isPending ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Change Password"
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
