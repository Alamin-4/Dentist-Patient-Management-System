"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Phone, MapPin, Send, HelpCircle } from "lucide-react";
import toast from "react-hot-toast";
import { apiClient } from "@/core/api/client";

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
    <div className="bg-slate-50 min-h-screen py-16 px-6 md:px-12">
      <div className="max-w-400 w-11/12 mx-auto space-y-12">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h1 className="text-4xl font-black text-[#10436B] tracking-tight">Contact Our Support Team</h1>
          <p className="text-gray-500 text-lg leading-relaxed">
            Have questions about bookings, escrow payouts, or dentist verification? Fill out the form or reach out directly.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">

          {/* Left: Contact Info (2 cols) */}
          <div className="lg:col-span-2 space-y-6">

            {/* Info Cards */}
            <div className="bg-white rounded-2xl border border-[#CEE0F4] p-6 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#F4F9FD] flex items-center justify-center shrink-0">
                <Mail className="h-6 w-6 text-[#10436B]" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-[#1A1A2E] text-base">Email Support</h4>
                <p className="text-xs text-gray-400">Response within 24 hours</p>
                <a href={`mailto:${contactInfo.email}`} className="text-sm font-semibold text-[#10436B] hover:underline block pt-1">
                  {contactInfo.email}
                </a>
              </div>
            </div>

            {contactInfo.phone && (
              <div className="bg-white rounded-2xl border border-[#CEE0F4] p-6 shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#F4F9FD] flex items-center justify-center shrink-0">
                  <Phone className="h-6 w-6 text-[#10436B]" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-[#1A1A2E] text-base">Hotline Phone</h4>
                  <a href={`tel:${contactInfo.phone}`} className="text-sm font-semibold text-[#10436B] hover:underline block pt-1">
                    {contactInfo.phone}
                  </a>
                </div>
              </div>
            )}

            {contactInfo.address && (
              <div className="bg-white rounded-2xl border border-[#CEE0F4] p-6 shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#F4F9FD] flex items-center justify-center shrink-0">
                  <MapPin className="h-6 w-6 text-[#10436B]" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-[#1A1A2E] text-base">Headquarters</h4>
                  <p className="text-xs text-gray-400">Global Operations Center</p>
                  <p className="text-sm font-medium text-slate-600 leading-relaxed pt-1">
                    {contactInfo.address}
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Right: Contact Form (3 cols) */}
          <div className="lg:col-span-3 bg-white border border-[#CEE0F4] rounded-2xl p-6 md:p-10 shadow-sm space-y-6">
            <h3 className="text-xl font-black text-[#1A1A2E] flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-[#10436B]" />
              Send Us a Message
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Your Name</label>
                  <input
                    type="text"
                    {...register("name")}
                    placeholder="Enter name"
                    className="h-11 w-full rounded-lg border border-gray-200 px-4 text-sm font-medium outline-none focus:border-[#10436B] focus:ring-1 focus:ring-[#10436B] bg-slate-50/30"
                  />
                  {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    {...register("email")}
                    placeholder="name@example.com"
                    className="h-11 w-full rounded-lg border border-gray-200 px-4 text-sm font-medium outline-none focus:border-[#10436B] focus:ring-1 focus:ring-[#10436B] bg-slate-50/30"
                  />
                  {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Subject</label>
                <input
                  type="text"
                  {...register("subject")}
                  placeholder="How can we help you?"
                  className="h-11 w-full rounded-lg border border-gray-200 px-4 text-sm font-medium outline-none focus:border-[#10436B] focus:ring-1 focus:ring-[#10436B] bg-slate-50/30"
                />
                {errors.subject && <p className="text-xs text-red-500 font-medium">{errors.subject.message}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Message Description</label>
                <textarea
                  {...register("message")}
                  rows={5}
                  placeholder="Write your inquiry details here..."
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium outline-none focus:border-[#10436B] focus:ring-1 focus:ring-[#10436B] bg-slate-50/30 resize-none"
                />
                {errors.message && <p className="text-xs text-red-500 font-medium">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#10436B] hover:bg-[#0d3656] text-white h-11 px-6 font-bold shadow-sm transition-all active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
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
