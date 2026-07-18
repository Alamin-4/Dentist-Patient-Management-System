"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useUpdatePatientProfile } from "@/hooks/user/useUser";
import toast from "react-hot-toast";
import { Pencil } from "lucide-react";

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
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onTouched",
  });

  const getFormattedDOB = (dobStr?: string) => {
    if (!dobStr) return "";
    const dateObj = new Date(dobStr);
    return !isNaN(dateObj.getTime()) ? dateObj.toISOString().split("T")[0] : "";
  };

  // Populate form values when user details are retrieved
  useEffect(() => {
    if (user) {
      let fName = user.firstName || "";
      let lName = user.lastName || "";
      if (!fName && !lName && user.name) {
        const parts = user.name.trim().split(/\s+/);
        fName = parts[0] || "";
        lName = parts.slice(1).join(" ") || "";
      }
      reset({
        firstName: fName,
        lastName: lName,
        phoneNumber: user.patient?.phoneNumber || "",
        country: user.patient?.country || "",
        dateOfBirth: getFormattedDOB(user.patient?.dateOfBirth),
      });
    }
  }, [user, reset]);

  const handleCancel = () => {
    if (user) {
      let fName = user.firstName || "";
      let lName = user.lastName || "";
      if (!fName && !lName && user.name) {
        const parts = user.name.trim().split(/\s+/);
        fName = parts[0] || "";
        lName = parts.slice(1).join(" ") || "";
      }
      reset({
        firstName: fName,
        lastName: lName,
        phoneNumber: user.patient?.phoneNumber || "",
        country: user.patient?.country || "",
        dateOfBirth: getFormattedDOB(user.patient?.dateOfBirth),
      });
    }
    setIsEditing(false);
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await updateProfileMutation.mutateAsync(data);
      toast.success(res?.message || "Profile updated successfully");
      setIsEditing(false);
    } catch (error: any) {
      const errMsg = error?.response?.data?.message || error?.message || "Failed to update profile";
      toast.error(errMsg);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-xl font-bold text-[#1A1A2E]">
          Personal Information
        </h2>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-[#475569] mb-2">First Name</label>
            <input
              type="text"
              placeholder="First Name"
              disabled={!isEditing || updateProfileMutation.isPending}
              {...register("firstName", { required: "First name is required" })}
              className={`w-full rounded-md border px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-[#0F3659] disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-100 transition-all ${
                errors.firstName ? "border-red-500 focus:ring-red-500" : "border-slate-200"
              }`}
            />
            {errors.firstName && (
              <p className="mt-1 text-xs text-red-600 font-semibold">{errors.firstName.message}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-[#475569] mb-2">Last Name</label>
            <input
              type="text"
              placeholder="Last Name"
              disabled={!isEditing || updateProfileMutation.isPending}
              {...register("lastName", { required: "Last name is required" })}
              className={`w-full rounded-md border px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-[#0F3659] disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-100 transition-all ${
                errors.lastName ? "border-red-500 focus:ring-red-500" : "border-slate-200"
              }`}
            />
            {errors.lastName && (
              <p className="mt-1 text-xs text-red-600 font-semibold">{errors.lastName.message}</p>
            )}
          </div>

          {/* Email - Read-only */}
          <div>
            <label className="block text-sm font-medium text-[#475569] mb-2">Email</label>
            <input
              type="email"
              value={user?.email || ""}
              readOnly
              disabled
              className="w-full rounded-md border px-4 py-3 text-sm outline-none bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-[#475569] mb-2">Phone Number</label>
            <input
              type="text"
              placeholder="Phone Number"
              disabled={!isEditing || updateProfileMutation.isPending}
              {...register("phoneNumber", { required: "Phone number is required" })}
              className={`w-full rounded-md border px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-[#0F3659] disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-100 transition-all ${
                errors.phoneNumber ? "border-red-500 focus:ring-red-500" : "border-slate-200"
              }`}
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-xs text-red-600 font-semibold">{errors.phoneNumber.message}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-[#475569] mb-2">Date of Birth</label>
            <input
              type="date"
              disabled={!isEditing || updateProfileMutation.isPending}
              {...register("dateOfBirth", { required: "Date of birth is required" })}
              className={`w-full rounded-md border px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-[#0F3659] disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-100 transition-all ${
                errors.dateOfBirth ? "border-red-500 focus:ring-red-500" : "border-slate-200"
              }`}
            />
            {errors.dateOfBirth && (
              <p className="mt-1 text-xs text-red-600 font-semibold">{errors.dateOfBirth.message}</p>
            )}
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-[#475569] mb-2">Country</label>
            <input
              type="text"
              placeholder="Country"
              disabled={!isEditing || updateProfileMutation.isPending}
              {...register("country", { required: "Country is required" })}
              className={`w-full rounded-md border px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-[#0F3659] disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-100 transition-all ${
                errors.country ? "border-red-500 focus:ring-red-500" : "border-slate-200"
              }`}
            />
            {errors.country && (
              <p className="mt-1 text-xs text-red-600 font-semibold">{errors.country.message}</p>
            )}
          </div>
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
              disabled={updateProfileMutation.isPending}
              className="rounded-md bg-[#0F3659] px-6 py-3 text-sm font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed hover:bg-[#0a2640] cursor-pointer flex items-center justify-center min-w-[140px]"
            >
              {updateProfileMutation.isPending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
