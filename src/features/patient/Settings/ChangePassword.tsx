"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useChangePassword } from "@/hooks/user/useUser";
import toast from "react-hot-toast";
import { Pencil } from "lucide-react";

interface FormValues {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export function ChangePasswordForm() {
  const changePasswordMutation = useChangePassword();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onTouched",
  });

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const newPasswordVal = watch("newPassword");

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await changePasswordMutation.mutateAsync({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      toast.success(res?.message || "Password changed successfully");
      reset();
      setIsEditing(false);
    } catch (error: any) {
      const errMsg = error?.response?.data?.message || error?.message || "Failed to change password";
      toast.error(errMsg);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl font-bold text-[#1A1A2E]">Change Password</h2>
        <button
          type="button"
          onClick={() => {
            if (isEditing) {
              handleCancel();
            } else {
              setIsEditing(true);
            }
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer border ${
            isEditing
              ? "text-red-500 hover:bg-red-50 border-red-200"
              : "text-[#0F3659] hover:bg-slate-50 border-slate-200"
          }`}
        >
          <Pencil className="h-3.5 w-3.5" />
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Old Password */}
        <div>
          <label className="block text-sm font-medium text-[#475569] mb-2">Old Password</label>
          <div className="relative">
            <input
              type={showOld ? "text" : "password"}
              placeholder="Enter old password"
              disabled={!isEditing || changePasswordMutation.isPending}
              {...register("oldPassword", { required: "Old password is required" })}
              className={`w-full rounded-md border px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-[#0F3659] disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-100 transition-all ${
                errors.oldPassword ? "border-red-500 focus:ring-red-500" : "border-slate-200"
              }`}
            />
            {isEditing && (
              <button
                type="button"
                onClick={() => setShowOld((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#0F3659] hover:text-[#0a2640] cursor-pointer"
              >
                {showOld ? "Hide" : "Show"}
              </button>
            )}
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
              placeholder="Enter new password"
              disabled={!isEditing || changePasswordMutation.isPending}
              {...register("newPassword", {
                required: "New password is required",
                minLength: { value: 8, message: "New password must be at least 8 characters long" },
              })}
              className={`w-full rounded-md border px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-[#0F3659] disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-100 transition-all ${
                errors.newPassword ? "border-red-500 focus:ring-red-500" : "border-slate-200"
              }`}
            />
            {isEditing && (
              <button
                type="button"
                onClick={() => setShowNew((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#0F3659] hover:text-[#0a2640] cursor-pointer"
              >
                {showNew ? "Hide" : "Show"}
              </button>
            )}
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
              placeholder="Confirm new password"
              disabled={!isEditing || changePasswordMutation.isPending}
              {...register("confirmNewPassword", {
                required: "Confirm password is required",
                validate: (val) => val === newPasswordVal || "Passwords do not match",
              })}
              className={`w-full rounded-md border px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-[#0F3659] disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-100 transition-all ${
                errors.confirmNewPassword ? "border-red-500 focus:ring-red-500" : "border-slate-200"
              }`}
            />
            {isEditing && (
              <button
                type="button"
                onClick={() => setShowConfirm((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#0F3659] hover:text-[#0a2640] cursor-pointer"
              >
                {showConfirm ? "Hide" : "Show"}
              </button>
            )}
          </div>
          {errors.confirmNewPassword && (
            <p className="mt-1 text-xs text-red-600 font-semibold">{errors.confirmNewPassword.message}</p>
          )}
        </div>

        {isEditing && (
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-md border border-slate-200 px-6 py-3 text-sm font-semibold text-[#475569] hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={changePasswordMutation.isPending}
              className="rounded-md bg-[#0F3659] px-6 py-3 text-sm font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed hover:bg-[#0a2640] cursor-pointer flex items-center justify-center min-w-[150px]"
            >
              {changePasswordMutation.isPending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Change Password"
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
