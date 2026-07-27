"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Mail, Phone, MapPin, Globe } from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { generalSocialsSchema, type GeneralSocialsFormValues } from "@/validation/settings-schemas";
import { bindServerErrors, useSystemSettings, useUpdateSystemSettings } from "@/core/hooks/admin/settings/useAdminSettings";
import { cn } from "@/lib/utils";

export function GeneralSocials() {
  const { data: settingsData, isLoading } = useSystemSettings();
  const updateMutation = useUpdateSystemSettings();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<GeneralSocialsFormValues>({
    resolver: zodResolver(generalSocialsSchema),
    defaultValues: {
      footerText: "",
      email: "",
      phone: "",
      address: "",
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
    },
  });

  useEffect(() => {
    if (settingsData) {
      if (settingsData.footerText !== undefined) setValue("footerText", settingsData.footerText);
      if (settingsData.email !== undefined) setValue("email", settingsData.email);
      if (settingsData.phone !== undefined) setValue("phone", settingsData.phone);
      if (settingsData.address !== undefined) setValue("address", settingsData.address);
      if (settingsData.facebook !== undefined) setValue("facebook", settingsData.facebook);
      if (settingsData.twitter !== undefined) setValue("twitter", settingsData.twitter);
      if (settingsData.instagram !== undefined) setValue("instagram", settingsData.instagram);
      if (settingsData.linkedin !== undefined) setValue("linkedin", settingsData.linkedin);
    }
  }, [settingsData, setValue]);

  const onSubmit = async (data: GeneralSocialsFormValues) => {
    try {
      await updateMutation.mutateAsync(data);
    } catch (err: any) {
      bindServerErrors(err, setError);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-50 items-center justify-center">
        <div className="h-6 w-6 animate-spin text-slate-400 border-2 border-slate-200 border-t-[#10436B] rounded-full" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-base font-bold text-[#1A1A2E]">General & Social Branding</h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Manage dynamic site branding, footer tagline text, social media profiles, and support team details.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Footer Branding */}
        <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-5">
          <h3 className="text-xs font-bold text-[#1A1A2E] uppercase tracking-wider flex items-center gap-2">
            <Globe className="h-4 w-4 text-[#10436B]" />
            Footer Brand Tagline
          </h3>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600">Tagline Text</label>
            <textarea
              {...register("footerText")}
              rows={4}
              placeholder="Tagline under the logo in footer..."
              className={cn(
                "w-full rounded-lg border px-4 py-3 text-xs font-medium outline-none transition-colors bg-white resize-none",
                errors.footerText ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-[#10436B]"
              )}
            />
            {errors.footerText && (
              <p className="text-[11px] text-red-500 font-semibold">{errors.footerText.message}</p>
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-5">
          <h3 className="text-xs font-bold text-[#1A1A2E] uppercase tracking-wider flex items-center gap-2">
            <Mail className="h-4 w-4 text-[#10436B]" />
            Contact Details
          </h3>

          <div className="grid grid-cols-1 gap-3.5">
            {/* Support Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">Support Email</label>
              <div className="relative">
                <input
                  type="email"
                  {...register("email")}
                  className={cn(
                    "h-9 w-full rounded-lg border pl-10 pr-4 text-xs outline-none transition-colors bg-white",
                    errors.email ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-[#10436B]"
                  )}
                />
                <Mail className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
              </div>
              {errors.email && (
                <p className="text-[11px] text-red-500 font-semibold">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">Hotline Phone</label>
              <div className="relative">
                <input
                  type="text"
                  {...register("phone")}
                  className={cn(
                    "h-9 w-full rounded-lg border pl-10 pr-4 text-xs outline-none transition-colors bg-white",
                    errors.phone ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-[#10436B]"
                  )}
                />
                <Phone className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
              </div>
              {errors.phone && (
                <p className="text-[11px] text-red-500 font-semibold">{errors.phone.message}</p>
              )}
            </div>

            {/* Office Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">Office Address</label>
              <div className="relative">
                <input
                  type="text"
                  {...register("address")}
                  className={cn(
                    "h-9 w-full rounded-lg border pl-10 pr-4 text-xs outline-none transition-colors bg-white",
                    errors.address ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-[#10436B]"
                  )}
                />
                <MapPin className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
              </div>
              {errors.address && (
                <p className="text-[11px] text-red-500 font-semibold">{errors.address.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="col-span-1 md:col-span-2 flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-5">
          <h3 className="text-xs font-bold text-[#1A1A2E] uppercase tracking-wider flex items-center gap-2">
            <ShareIcon className="h-4 w-4 text-[#10436B]" />
            Social Media Links
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Facebook */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">Facebook URL</label>
              <div className="relative">
                <input
                  type="url"
                  {...register("facebook")}
                  className={cn(
                    "h-9 w-full rounded-lg border pl-10 pr-4 text-xs outline-none transition-colors bg-white",
                    errors.facebook ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-[#10436B]"
                  )}
                />
                <FaFacebook className="absolute left-3.5 top-2.5 h-4 w-4 text-[#1877F2]" />
              </div>
              {errors.facebook && (
                <p className="text-[11px] text-red-500 font-semibold">{errors.facebook.message}</p>
              )}
            </div>

            {/* X / Twitter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">X / Twitter URL</label>
              <div className="relative">
                <input
                  type="url"
                  {...register("twitter")}
                  className={cn(
                    "h-9 w-full rounded-lg border pl-10 pr-4 text-xs outline-none transition-colors bg-white",
                    errors.twitter ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-[#10436B]"
                  )}
                />
                <span className="absolute left-3.5 top-2 font-black text-xs italic text-slate-800">X</span>
              </div>
              {errors.twitter && (
                <p className="text-[11px] text-red-500 font-semibold">{errors.twitter.message}</p>
              )}
            </div>

            {/* Instagram */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">Instagram URL</label>
              <div className="relative">
                <input
                  type="url"
                  {...register("instagram")}
                  className={cn(
                    "h-9 w-full rounded-lg border pl-10 pr-4 text-xs outline-none transition-colors bg-white",
                    errors.instagram ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-[#10436B]"
                  )}
                />
                <FaInstagram className="absolute left-3.5 top-2.5 h-4 w-4 text-[#E4405F]" />
              </div>
              {errors.instagram && (
                <p className="text-[11px] text-red-500 font-semibold">{errors.instagram.message}</p>
              )}
            </div>

            {/* LinkedIn */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">LinkedIn URL</label>
              <div className="relative">
                <input
                  type="url"
                  {...register("linkedin")}
                  className={cn(
                    "h-9 w-full rounded-lg border pl-10 pr-4 text-xs outline-none transition-colors bg-white",
                    errors.linkedin ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-[#10436B]"
                  )}
                />
                <FaLinkedin className="absolute left-3.5 top-2.5 h-4 w-4 text-[#0A66C2]" />
              </div>
              {errors.linkedin && (
                <p className="text-[11px] text-red-500 font-semibold">{errors.linkedin.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end border-t border-slate-200 pt-4">
        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="flex items-center gap-2 rounded-lg bg-[#10436B] hover:bg-[#0d3656] text-white px-6 py-2.5 text-xs font-bold transition-all active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
        >
          <Save className="h-4 w-4" />
          {updateMutation.isPending ? "Saving..." : "Save Branding"}
        </button>
      </div>
    </form>
  );
}

function ShareIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185z"
      />
    </svg>
  );
}
