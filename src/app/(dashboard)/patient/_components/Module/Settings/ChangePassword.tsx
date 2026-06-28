"use client";

import { useForm } from "react-hook-form";
import { useChangePassword } from "@/hooks/user/useUser";
import toast from "react-hot-toast";

interface FormValues {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export function ChangePasswordForm() {
  const changePasswordMutation = useChangePassword();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onTouched",
  });

  const newPasswordVal = watch("newPassword");

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      <h2 className="text-[28px] font-bold text-[#1A1A2E]">Change Password</h2>

      <div className="space-y-8">
        {/* Old Password */}
        <div className="space-y-2">
          <label className="text-lg font-semibold text-[#1A1A2E]">Old Password</label>
          <input
            type="password"
            placeholder="Enter old password"
            disabled={changePasswordMutation.isPending}
            {...register("oldPassword", { required: "Old password is required" })}
            className={`w-full h-16 px-6 rounded-xl border text-lg font-medium text-[#1A1A2E] bg-white focus:outline-none focus:ring-1 focus:ring-[#0F3659] transition-all ${
              errors.oldPassword ? "border-red-500 focus:ring-red-500" : "border-slate-200"
            }`}
          />
          {errors.oldPassword && (
            <p className="text-sm font-semibold text-red-500 mt-1">{errors.oldPassword.message}</p>
          )}
        </div>

        {/* New Password */}
        <div className="space-y-2">
          <label className="text-lg font-semibold text-[#1A1A2E]">New Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            disabled={changePasswordMutation.isPending}
            {...register("newPassword", {
              required: "New password is required",
              minLength: { value: 8, message: "New password must be at least 8 characters long" },
            })}
            className={`w-full h-16 px-6 rounded-xl border text-lg font-medium text-[#1A1A2E] bg-white focus:outline-none focus:ring-1 focus:ring-[#0F3659] transition-all ${
              errors.newPassword ? "border-red-500 focus:ring-red-500" : "border-slate-200"
            }`}
          />
          {errors.newPassword && (
            <p className="text-sm font-semibold text-red-500 mt-1">{errors.newPassword.message}</p>
          )}
        </div>

        {/* Confirm New Password */}
        <div className="space-y-2">
          <label className="text-lg font-semibold text-[#1A1A2E]">Confirm New Password</label>
          <input
            type="password"
            placeholder="Confirm new password"
            disabled={changePasswordMutation.isPending}
            {...register("confirmNewPassword", {
              required: "Confirm password is required",
              validate: (val) => val === newPasswordVal || "Passwords do not match",
            })}
            className={`w-full h-16 px-6 rounded-xl border text-lg font-medium text-[#1A1A2E] bg-white focus:outline-none focus:ring-1 focus:ring-[#0F3659] transition-all ${
              errors.confirmNewPassword ? "border-red-500 focus:ring-red-500" : "border-slate-200"
            }`}
          />
          {errors.confirmNewPassword && (
            <p className="text-sm font-semibold text-red-500 mt-1">{errors.confirmNewPassword.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          disabled={changePasswordMutation.isPending}
          onClick={() => reset()}
          className="px-10 py-4 rounded-xl border border-slate-300 font-bold text-[#1A1A2E] text-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={changePasswordMutation.isPending}
          className="px-10 py-4 rounded-xl bg-[#0F3659] font-bold text-white text-xl hover:bg-[#0a2640] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[220px]"
        >
          {changePasswordMutation.isPending ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Change Password"
          )}
        </button>
      </div>
    </form>
  );
}
