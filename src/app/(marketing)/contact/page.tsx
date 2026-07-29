"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Phone, MapPin, Send, HelpCircle } from "lucide-react";
import toast from "react-hot-toast";
import { apiClient } from "@/core/api/client";

import CustomSectionHeading from "@/features/shared/custom-section-heading";
import CustomDesText from "@/features/shared/custom-des-text";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  subject: z.string().min(4, "Subject must be at least 4 characters."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [contactInfo, setContactInfo] = useState({
    email: "support@rateddocs.com",
    phone: "",
    address: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadContactInfo = async () => {
      try {
        const response = await apiClient.settings.get();
        if (response?.data) {
          setContactInfo({
            email: response.data.email || "",
            phone: response.data.phone || "",
            address: response.data.address || "",
          });
        }
      } catch (e) {
        console.error("Error loading contact info from database:", e);
      }
    };

    loadContactInfo();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setSubmitting(true);
    try {
      await apiClient.contact.sendInquiry({
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      });

      toast.success("Thank you! Your message has been sent successfully.");
      reset();
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-dvh py-6 sm:py-10 md:py-12 px-4 sm:px-6 md:px-12">
      <div className="max-w-400 w-full md:w-11/12 mx-auto space-y-6 sm:space-y-8 lg:space-y-10">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <CustomSectionHeading value="Contact Our Support Team" center_align />
          <CustomDesText value="Have questions about bookings, escrow payouts, or dentist verification? Fill out the form or reach out directly." center_align />
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-12 items-start">

          {/* Left: Contact Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-5">

            {/* Info Cards */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-border p-4 sm:p-6 shadow-xs flex items-start gap-3.5 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#F4F9FD] flex items-center justify-center shrink-0">
                <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-text text-sm sm:text-base">Email Support</h4>
                <p className="text-[11px] sm:text-xs text-gray-400">Response within 24 hours</p>
                <a href={`mailto:${contactInfo.email}`} className="text-xs sm:text-sm font-semibold text-primary hover:underline block pt-0.5">
                  {contactInfo.email}
                </a>
              </div>
            </div>

            {contactInfo.phone && (
              <div className="bg-white rounded-xl sm:rounded-2xl border border-border p-4 sm:p-6 shadow-xs flex items-start gap-3.5 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#F4F9FD] flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-text text-sm sm:text-base">Hotline Phone</h4>
                  <a href={`tel:${contactInfo.phone}`} className="text-xs sm:text-sm font-semibold text-primary hover:underline block pt-0.5">
                    {contactInfo.phone}
                  </a>
                </div>
              </div>
            )}

            {contactInfo.address && (
              <div className="bg-white rounded-xl sm:rounded-2xl border border-border p-4 sm:p-6 shadow-xs flex items-start gap-3.5 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#F4F9FD] flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-text text-sm sm:text-base">Headquarters</h4>
                  <p className="text-[11px] sm:text-xs text-gray-400">Global Operations Center</p>
                  <p className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed pt-0.5">
                    {contactInfo.address}
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Right: Contact Form (3 cols) */}
          <div className="lg:col-span-3 bg-white border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-xs space-y-4 sm:space-y-6">
            <h3 className="text-lg sm:text-xl font-medium text-text flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              Send Us a Message
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">Your Name</label>
                  <input
                    type="text"
                    {...register("name")}
                    placeholder="Enter name"
                    className="h-10 sm:h-11 w-full rounded-lg border border-gray-200 px-3.5 sm:px-4 text-xs sm:text-sm font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-slate-50/30"
                  />
                  {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    {...register("email")}
                    placeholder="name@example.com"
                    className="h-10 sm:h-11 w-full rounded-lg border border-gray-200 px-3.5 sm:px-4 text-xs sm:text-sm font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-slate-50/30"
                  />
                  {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">Subject</label>
                <input
                  type="text"
                  {...register("subject")}
                  placeholder="How can we help you?"
                  className="h-10 sm:h-11 w-full rounded-lg border border-gray-200 px-3.5 sm:px-4 text-xs sm:text-sm font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-slate-50/30"
                />
                {errors.subject && <p className="text-xs text-red-500 font-medium">{errors.subject.message}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">Message Description</label>
                <textarea
                  {...register("message")}
                  rows={4}
                  placeholder="Write your inquiry details here..."
                  className="w-full rounded-lg border border-gray-200 px-3.5 sm:px-4 py-3 text-xs sm:text-sm font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-slate-50/30 resize-none"
                />
                {errors.message && <p className="text-xs text-red-500 font-medium">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary hover:bg-[#0d3656] text-white h-10 sm:h-11 px-6 text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
              >
                <Send className="h-4 w-4" />
                {submitting ? "Sending message…" : "Send Message"}
              </button>

            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
