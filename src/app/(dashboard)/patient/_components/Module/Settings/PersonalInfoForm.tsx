"use client";

import { useForm } from "react-hook-form";
import { useUpdatePatientProfile } from "@/hooks/user/useUser";
import toast from "react-hot-toast";
import { useEffect } from "react";

interface FormValues {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string;
  country: string;
}

interface PersonalInfoFormProps {
  user: any;
}

export function PersonalInfoForm({ user }: PersonalInfoFormProps) {
  const updateProfileMutation = useUpdatePatientProfile();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onTouched",
  });

  // Populate form values when user details are retrieved
  useEffect(() => {
    if (user) {
      setValue("firstName", user.firstName || "");
      setValue("lastName", user.lastName || "");
      setValue("phoneNumber", user.patient?.phoneNumber || "");
      setValue("country", user.patient?.country || "");
      if (user.patient?.dateOfBirth) {
        // Format date to YYYY-MM-DD for native input
        const dateObj = new Date(user.patient.dateOfBirth);
        if (!isNaN(dateObj.getTime())) {
          setValue("dateOfBirth", dateObj.toISOString().split("T")[0]);
        }
      }
    }
  }, [user, setValue]);

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await updateProfileMutation.mutateAsync(data);
      toast.success(res?.message || "Profile updated successfully");
    } catch (error: any) {
      const errMsg = error?.response?.data?.message || error?.message || "Failed to update profile";
      toast.error(errMsg);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      <h2 className="text-[28px] font-bold text-[#1A1A2E]">
        Personal Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
        {/* First Name */}
        <div className="space-y-2">
          <label className="text-lg font-semibold text-[#1A1A2E]">First Name</label>
          <input
            type="text"
            placeholder="First Name"
            disabled={updateProfileMutation.isPending}
            {...register("firstName", { required: "First name is required" })}
            className={`w-full h-16 px-6 rounded-lg border text-lg font-medium text-[#1A1A2E] bg-white focus:outline-none focus:ring-1 focus:ring-[#0F3659] transition-all ${errors.firstName ? "border-red-500 focus:ring-red-500" : "border-slate-200"
              }`}
          />
          {errors.firstName && (
            <p className="text-sm font-semibold text-red-500 mt-1">{errors.firstName.message}</p>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <label className="text-lg font-semibold text-[#1A1A2E]">Last Name</label>
          <input
            type="text"
            placeholder="Last Name"
            disabled={updateProfileMutation.isPending}
            {...register("lastName", { required: "Last name is required" })}
            className={`w-full h-16 px-6 rounded-lg border text-lg font-medium text-[#1A1A2E] bg-white focus:outline-none focus:ring-1 focus:ring-[#0F3659] transition-all ${errors.lastName ? "border-red-500 focus:ring-red-500" : "border-slate-200"
              }`}
          />
          {errors.lastName && (
            <p className="text-sm font-semibold text-red-500 mt-1">{errors.lastName.message}</p>
          )}
        </div>

        {/* Email - Read-only */}
        <div className="space-y-2">
          <label className="text-lg font-semibold text-[#1A1A2E]">Email</label>
          <input
            type="email"
            value={user?.email || ""}
            readOnly
            disabled
            className="w-full h-16 px-6 rounded-lg border border-slate-200 text-lg font-medium text-slate-400 bg-slate-50 cursor-not-allowed outline-none"
          />
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <label className="text-lg font-semibold text-[#1A1A2E]">Phone Number</label>
          <input
            type="text"
            placeholder="Phone Number"
            disabled={updateProfileMutation.isPending}
            {...register("phoneNumber", { required: "Phone number is required" })}
            className={`w-full h-16 px-6 rounded-lg border text-lg font-medium text-[#1A1A2E] bg-white focus:outline-none focus:ring-1 focus:ring-[#0F3659] transition-all ${errors.phoneNumber ? "border-red-500 focus:ring-red-500" : "border-slate-200"
              }`}
          />
          {errors.phoneNumber && (
            <p className="text-sm font-semibold text-red-500 mt-1">{errors.phoneNumber.message}</p>
          )}
        </div>

        {/* Date of Birth */}
        <div className="space-y-2">
          <label className="text-lg font-semibold text-[#1A1A2E]">Date of Birth</label>
          <input
            type="date"
            disabled={updateProfileMutation.isPending}
            {...register("dateOfBirth", { required: "Date of birth is required" })}
            className={`w-full h-16 px-6 rounded-lg border text-lg font-medium text-[#1A1A2E] bg-white focus:outline-none focus:ring-1 focus:ring-[#0F3659] transition-all ${errors.dateOfBirth ? "border-red-500 focus:ring-red-500" : "border-slate-200"
              }`}
          />
          {errors.dateOfBirth && (
            <p className="text-sm font-semibold text-red-500 mt-1">{errors.dateOfBirth.message}</p>
          )}
        </div>

        {/* Country */}
        <div className="space-y-2">
          <label className="text-lg font-semibold text-[#1A1A2E]">Country</label>
          <input
            type="text"
            placeholder="Country"
            disabled={updateProfileMutation.isPending}
            {...register("country", { required: "Country is required" })}
            className={`w-full h-16 px-6 rounded-lg border text-lg font-medium text-[#1A1A2E] bg-white focus:outline-none focus:ring-1 focus:ring-[#0F3659] transition-all ${errors.country ? "border-red-500 focus:ring-red-500" : "border-slate-200"
              }`}
          />
          {errors.country && (
            <p className="text-sm font-semibold text-red-500 mt-1">{errors.country.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          disabled={updateProfileMutation.isPending}
          className="px-10 py-4 rounded-lg border border-slate-300 font-bold text-[#1A1A2E] text-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={updateProfileMutation.isPending}
          className="px-10 py-4 rounded-lg bg-[#0F3659] font-bold text-white text-xl hover:bg-[#0a2640] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[200px]"
        >
          {updateProfileMutation.isPending ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </form>
  );
}
