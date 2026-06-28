"use client";

import { useForm } from "react-hook-form";
import { useGetMe, useUpdateDentistProfile } from "@/hooks/user/useUser";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import toast from "react-hot-toast";
import { useEffect } from "react";

interface FormValues {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  country: string;
  specialtyId: string;
  legalName: string;
  yearsOfExperience: number;
  city: string;
}

export default function PersonalInfo() {
  const { data: response, isLoading, refetch } = useGetMe();
  const updateDentistProfileMutation = useUpdateDentistProfile();

  const user = response?.data || response;

  // Fetch specialties
  const { data: specialtiesRes } = useQuery({
    queryKey: ["specialties"],
    queryFn: () => apiClient.specialties.list(),
  });
  const specialties = specialtiesRes?.data || specialtiesRes || [];

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onTouched",
  });

  // Populate dentist data
  useEffect(() => {
    if (user) {
      setValue("firstName", user.firstName || "");
      setValue("lastName", user.lastName || "");
      setValue("phoneNumber", user.dentist?.phoneNumber || "");
      setValue("country", user.dentist?.country || "");
      setValue("specialtyId", user.dentist?.specialtyId || "");
      setValue("legalName", user.dentist?.dentistProfessionalData?.legalName || "");
      setValue("yearsOfExperience", user.dentist?.dentistProfessionalData?.yearsOfExperience || 0);
      setValue("city", user.dentist?.dentistProfessionalData?.city || "");
    }
  }, [user, setValue]);

  const onSubmit = async (data: FormValues) => {
    try {
      const payload = {
        ...data,
        yearsOfExperience: Number(data.yearsOfExperience),
      };
      const res = await updateDentistProfileMutation.mutateAsync(payload);
      toast.success(res?.message || "Profile updated successfully");
      refetch();
    } catch (error: any) {
      const errMsg = error?.response?.data?.message || error?.message || "Failed to update profile";
      toast.error(errMsg);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-[#EEF2F7] bg-white p-6 shadow-sm flex items-center justify-center h-48">
        <div className="h-8 w-8 border-3 border-[#0F3659] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <section className="rounded-xl border border-[#EEF2F7] bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-[#0E3E65]">Personal Information</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-[#475569] mb-2">First Name</label>
            <input
              type="text"
              disabled={updateDentistProfileMutation.isPending}
              {...register("firstName", { required: "First name is required" })}
              className={`w-full rounded-md border px-4 py-3 text-sm bg-white outline-none focus:ring-1 focus:ring-[#0F3659] ${
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
              disabled={updateDentistProfileMutation.isPending}
              {...register("lastName", { required: "Last name is required" })}
              className={`w-full rounded-md border px-4 py-3 text-sm bg-white outline-none focus:ring-1 focus:ring-[#0F3659] ${
                errors.lastName ? "border-red-500 focus:ring-red-500" : "border-slate-200"
              }`}
            />
            {errors.lastName && (
              <p className="mt-1 text-xs text-red-600 font-semibold">{errors.lastName.message}</p>
            )}
          </div>

          {/* Legal Name */}
          <div>
            <label className="block text-sm font-medium text-[#475569] mb-2">Legal Name</label>
            <input
              type="text"
              disabled={updateDentistProfileMutation.isPending}
              {...register("legalName", { required: "Legal name is required" })}
              className={`w-full rounded-md border px-4 py-3 text-sm bg-white outline-none focus:ring-1 focus:ring-[#0F3659] ${
                errors.legalName ? "border-red-500 focus:ring-red-500" : "border-slate-200"
              }`}
            />
            {errors.legalName && (
              <p className="mt-1 text-xs text-red-600 font-semibold">{errors.legalName.message}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-[#475569] mb-2">Phone Number</label>
            <input
              type="text"
              disabled={updateDentistProfileMutation.isPending}
              {...register("phoneNumber", { required: "Phone number is required" })}
              className={`w-full rounded-md border px-4 py-3 text-sm bg-white outline-none focus:ring-1 focus:ring-[#0F3659] ${
                errors.phoneNumber ? "border-red-500 focus:ring-red-500" : "border-slate-200"
              }`}
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-xs text-red-600 font-semibold">{errors.phoneNumber.message}</p>
            )}
          </div>

          {/* Specialty */}
          <div>
            <label className="block text-sm font-medium text-[#475569] mb-2">Primary Specialty</label>
            <select
              disabled={updateDentistProfileMutation.isPending}
              {...register("specialtyId", { required: "Specialty is required" })}
              className={`w-full rounded-md border px-4 py-3 text-sm bg-white outline-none focus:ring-1 focus:ring-[#0F3659] ${
                errors.specialtyId ? "border-red-500 focus:ring-red-500" : "border-slate-200"
              }`}
            >
              <option value="">Select Specialty</option>
              {specialties.map((spec: any) => (
                <option key={spec.id} value={spec.id}>
                  {spec.name}
                </option>
              ))}
            </select>
            {errors.specialtyId && (
              <p className="mt-1 text-xs text-red-600 font-semibold">{errors.specialtyId.message}</p>
            )}
          </div>

          {/* Years of Experience */}
          <div>
            <label className="block text-sm font-medium text-[#475569] mb-2">Years of Experience</label>
            <input
              type="number"
              disabled={updateDentistProfileMutation.isPending}
              {...register("yearsOfExperience", {
                required: "Years of experience is required",
                min: { value: 0, message: "Cannot be negative" },
              })}
              className={`w-full rounded-md border px-4 py-3 text-sm bg-white outline-none focus:ring-1 focus:ring-[#0F3659] ${
                errors.yearsOfExperience ? "border-red-500 focus:ring-red-500" : "border-slate-200"
              }`}
            />
            {errors.yearsOfExperience && (
              <p className="mt-1 text-xs text-red-600 font-semibold">{errors.yearsOfExperience.message}</p>
            )}
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-[#475569] mb-2">City</label>
            <input
              type="text"
              disabled={updateDentistProfileMutation.isPending}
              {...register("city", { required: "City is required" })}
              className={`w-full rounded-md border px-4 py-3 text-sm bg-white outline-none focus:ring-1 focus:ring-[#0F3659] ${
                errors.city ? "border-red-500 focus:ring-red-500" : "border-slate-200"
              }`}
            />
            {errors.city && (
              <p className="mt-1 text-xs text-red-600 font-semibold">{errors.city.message}</p>
            )}
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-[#475569] mb-2">Country</label>
            <input
              type="text"
              disabled={updateDentistProfileMutation.isPending}
              {...register("country", { required: "Country is required" })}
              className={`w-full rounded-md border px-4 py-3 text-sm bg-white outline-none focus:ring-1 focus:ring-[#0F3659] ${
                errors.country ? "border-red-500 focus:ring-red-500" : "border-slate-200"
              }`}
            />
            {errors.country && (
              <p className="mt-1 text-xs text-red-600 font-semibold">{errors.country.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={updateDentistProfileMutation.isPending}
            className="rounded-md bg-[#0F3659] px-6 py-3 text-sm font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed hover:bg-[#0a2640] cursor-pointer flex items-center justify-center min-w-[140px]"
          >
            {updateDentistProfileMutation.isPending ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
