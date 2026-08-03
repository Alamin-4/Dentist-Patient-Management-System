"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import {
  Send,
  CheckCircle2,
  ShieldCheck,
  Award,
  HeartHandshake,
  Sparkles,
  Mail,
  Loader2
} from "lucide-react";
import CustomSectionHeading from "@/features/shared/custom-section-heading";
import CustomDesText from "@/features/shared/custom-des-text";
import { apiClient } from "@/core/api/client";

const contactFormSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  subject: z.string().min(4, "Subject must be at least 4 characters."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormValues): Promise<void> => {
    setSubmitting(true);
    setSubmitted(false);

    try {
      await apiClient.contact.sendInquiry({
        name: data.fullName,
        email: data.email,
        subject: data.subject,
        message: data.message,
      });

      setSubmitting(false);
      setSubmitted(true);
      toast.success("Message sent successfully!");

      reset();

      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    } catch (error: any) {
      setSubmitting(false);
      const errorMsg = error?.response?.data?.message || "Failed to send message. Please try again.";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="bg-slate-50 flex-1 py-10 sm:py-14 px-4 sm:px-6 md:px-12 flex flex-col justify-center text-left">
      <div className="max-w-400 w-full md:w-11/12 mx-auto space-y-10 flex-1 flex flex-col justify-center">

        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-primary text-xs font-bold border border-border">
            <Sparkles className="size-3.5 text-accent shrink-0" />
            <span>Trusted Global Dental Network</span>
          </div>
          <CustomSectionHeading value="Connect with RatedDocs Support" center_align />
          <CustomDesText
            value="Whether you have questions about verified dental specialists, procedure costs, or consultation bookings, our team is here to assist you."
            center_align
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">

          <div className="lg:col-span-5 flex flex-col justify-between bg-linear-to-br from-[#0E3E65] via-[#113254] to-[#163E5C] text-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-lg space-y-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <span className="text-accent text-xs font-extrabold uppercase tracking-wider">
                  The RatedDocs Standard
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight text-white">
                  Your Bridge to World-Class Dental Care
                </h3>
                <p className="text-xs sm:text-sm text-sky-100 leading-relaxed font-medium">
                  RatedDocs empowers patients worldwide to discover, compare, and book consultations with top-rated, board-certified international dentists with absolute confidence.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xs">
                  <div className="w-9 h-9 rounded-xl bg-accent/20 flex items-center justify-center text-accent shrink-0 mt-0.5">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-white">100% Verified Specialists</h4>
                    <p className="text-xs text-sky-100/90 leading-relaxed">
                      Every dentist undergoes rigorous license verification, board background checks, and facility quality audits.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xs">
                  <div className="w-9 h-9 rounded-xl bg-sky-400/20 flex items-center justify-center text-sky-300 shrink-0 mt-0.5">
                    <Award className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-white">Transparent Procedure Pricing</h4>
                    <p className="text-xs text-sky-100/90 leading-relaxed">
                      Compare upfront cost estimates for implants, veneers, and full-mouth restorations with zero hidden fees.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xs">
                  <div className="w-9 h-9 rounded-xl bg-emerald-400/20 flex items-center justify-center text-emerald-300 shrink-0 mt-0.5">
                    <HeartHandshake className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-white">Dedicated Patient Care</h4>
                    <p className="text-xs text-sky-100/90 leading-relaxed">
                      From initial inquiry to post-treatment follow-up, our team guides you through every step of your dental journey.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6 flex items-center justify-between gap-4 text-xs text-sky-200">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-accent" />
                <span className="font-semibold">support@rateddocs.com</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white border border-border rounded-3xl p-6 sm:p-8 md:p-10 shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-2 border-b border-slate-100 pb-5">
              <h3 className="text-xl sm:text-2xl font-bold text-text">Send Us a Message</h3>
              <p className="text-xs sm:text-sm text-sec-text">Fill out the details below and our team will get back to you within 24 hours.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 flex-1 flex flex-col justify-between">
              <div className="space-y-5">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="fullName" className="text-[11px] font-bold text-sec-text uppercase tracking-wider">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    {...register("fullName")}
                    placeholder="Enter your full name"
                    className="h-11 w-full rounded-xl border border-gray-200 px-4 text-xs sm:text-sm font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-slate-50/50 transition-colors"
                  />
                  {errors.fullName && <p className="text-xs text-red-500 font-medium">{errors.fullName.message}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-[11px] font-bold text-sec-text uppercase tracking-wider">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="name@example.com"
                    className="h-11 w-full rounded-xl border border-gray-200 px-4 text-xs sm:text-sm font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-slate-50/50 transition-colors"
                  />
                  {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>}
                </div>

                {/* 3. Subject */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="subject" className="text-[11px] font-bold text-sec-text uppercase tracking-wider">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="subject"
                    type="text"
                    {...register("subject")}
                    placeholder="How can we help you?"
                    className="h-11 w-full rounded-xl border border-gray-200 px-4 text-xs sm:text-sm font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-slate-50/50 transition-colors"
                  />
                  {errors.subject && <p className="text-xs text-red-500 font-medium">{errors.subject.message}</p>}
                </div>

                {/* 4. Message */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="text-[11px] font-bold text-sec-text uppercase tracking-wider">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    {...register("message")}
                    rows={5}
                    placeholder="Write your message or inquiry here..."
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-xs sm:text-sm font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-slate-50/50 resize-none transition-colors"
                  />
                  {errors.message && <p className="text-xs text-red-500 font-medium">{errors.message.message}</p>}
                </div>
              </div>

              {/* Submit Button with Loading & Success States */}
              <button
                type="submit"
                disabled={submitting}
                className={`flex w-full items-center justify-center gap-2 rounded-xl h-11 px-6 text-xs sm:text-sm font-bold shadow-xs transition-all active:scale-98 cursor-pointer border ${submitted
                  ? "bg-badge text-white border-badge"
                  : "bg-primary hover:bg-[#0d3656] text-white border-primary"
                  } disabled:bg-gray-300 disabled:border-gray-300 disabled:cursor-not-allowed`}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>Sending...</span>
                  </>
                ) : submitted ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-white" />
                    <span>Message Sent!</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 text-accent" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
