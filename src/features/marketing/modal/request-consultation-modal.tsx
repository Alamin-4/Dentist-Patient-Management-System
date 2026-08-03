"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import {
  Mail,
  User,
  MessageSquare,
  Loader2,
  Sparkles,
  Phone,
  Globe,
  DollarSign,
  MessageCircle,
  Activity,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useStateContext } from "@/providers/StateProvider";
import { useMe } from "@/hooks/auth/useAuth";
import { useCan } from "@/core/hooks/auth/usePermissions";
import { useRequestDirectoryConsultation } from "@/hooks/dentist/useDentistDirectory";

const schema = z.object({
  patientName: z.string().min(1, "Name is required"),
  patientEmail: z.string().email("Please enter a valid email address"),
  patientPhone: z.string().min(1, "Phone number is required"),
  country: z.string().min(1, "Country is required"),
  procedureName: z.string().min(1, "Procedure is required"),
  budget: z.string().min(1, "Approx budget is required"),
  preferredContact: z.string().min(1, "Preferred contact method is required"),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const PROCEDURES = [
  "Dental Implants",
  "Porcelain Veneers",
  "Crowns & Bridges",
  "Teeth Whitening",
  "Root Canal Therapy",
  "Orthodontics (Invisalign/Braces)",
  "General Checkup & Cleaning",
  "Tooth Extraction",
  "Other",
];

const BUDGETS = [
  "Under $1,000",
  "$1,000 - $3,000",
  "$3,000 - $5,000",
  "$5,000 - $10,000",
  "$10,000+",
];

const CONTACT_METHODS = [
  { value: "EMAIL", label: "Email" },
  { value: "PHONE", label: "Phone Call" },
  { value: "WHATSAPP", label: "WhatsApp" },
];

const COUNTRIES = [
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "Australia",
  "Mexico",
  "Turkey",
  "Costa Rica",
  "Other",
];

export default function RequestConsultationModal() {
  const {
    showRequestConsultationModal,
    setShowRequestConsultationModal,
    requestConsultationDentist,
    setRequestConsultationDentist,
  } = useStateContext();

  const { user } = useMe();
  const requestMutation = useRequestDirectoryConsultation();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      patientName: "",
      patientEmail: "",
      patientPhone: "",
      country: "United States",
      procedureName: "General Checkup & Cleaning",
      budget: "$1,000 - $3,000",
      preferredContact: "EMAIL",
      message: "",
    },
  });

  // Auto-populate when user is logged in
  useEffect(() => {
    if (user) {
      const name = user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim();
      setValue("patientName", name);
      setValue("patientEmail", user.email || "");
      if (user.phoneNumber) {
        setValue("patientPhone", user.phoneNumber);
      }
    }
  }, [user, setValue, showRequestConsultationModal]);

  const handleClose = () => {
    setShowRequestConsultationModal(false);
    setRequestConsultationDentist(null);
    reset();
  };

  const onSubmit = (data: FormValues) => {
    if (!requestConsultationDentist?.slug) {
      toast.error("Dentist slug not found.");
      return;
    }

    requestMutation.mutate(
      {
        slug: requestConsultationDentist.slug,
        payload: data,
      },
      {
        onSuccess: (res) => {
          toast.success(res?.message || "Consultation request sent successfully!");
          handleClose();
        },
        onError: (err: any) => {
          const errMsg = err?.response?.data?.message || err?.message || "Failed to submit request.";
          toast.error(errMsg);
        },
      }
    );
  };

  const canBook = useCan("book_consultation");

  if (!requestConsultationDentist || !canBook) return null;

  return (
    <Dialog open={showRequestConsultationModal} onOpenChange={handleClose}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[650px] p-0 overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl transition-all duration-300">
        {/* Decorative top accent gradient */}
        <div className="h-2 w-full bg-linear-to-r from-blue-600 via-primary to-emerald-500" />

        <div className="p-6 md:p-8">
          <DialogHeader className="gap-2 text-left relative">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-primary border border-blue-100 w-fit">
              <Sparkles className="size-3.5 text-blue-500 animate-pulse" />
              Direct Inquiry
            </div>
            <DialogTitle className="text-2xl font-bold font-heading text-slate-900 dark:text-white leading-tight">
              Request Consultation
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Submit a detailed consultation request to{" "}
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Dr. {requestConsultationDentist.name}
              </span>
              . Once approved, you will choose your preferred appointment slot.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Patient Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <User className="size-4" />
                  </span>
                  <Input
                    placeholder="Enter your full name"
                    className={`h-12 pl-11 rounded-lg bg-slate-50 border transition-all ${
                      errors.patientName ? "border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-primary"
                    }`}
                    {...register("patientName")}
                  />
                </div>
                {errors.patientName && (
                  <span className="text-xs text-red-500 font-medium mt-0.5">{errors.patientName.message}</span>
                )}
              </div>

              {/* Patient Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail className="size-4" />
                  </span>
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    className={`h-12 pl-11 rounded-lg bg-slate-50 border transition-all ${
                      errors.patientEmail ? "border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-primary"
                    }`}
                    {...register("patientEmail")}
                  />
                </div>
                {errors.patientEmail && (
                  <span className="text-xs text-red-500 font-medium mt-0.5">{errors.patientEmail.message}</span>
                )}
              </div>

              {/* Phone Number */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Phone / WhatsApp <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Phone className="size-4" />
                  </span>
                  <Input
                    placeholder="+1 (555) 000-0000"
                    className={`h-12 pl-11 rounded-lg bg-slate-50 border transition-all ${
                      errors.patientPhone ? "border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-primary"
                    }`}
                    {...register("patientPhone")}
                  />
                </div>
                {errors.patientPhone && (
                  <span className="text-xs text-red-500 font-medium mt-0.5">{errors.patientPhone.message}</span>
                )}
              </div>

              {/* Country */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Country <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Globe className="size-4" />
                  </span>
                  <select
                    className={`h-12 pl-11 pr-4 rounded-lg bg-slate-50 border border-slate-200 focus:border-primary transition-all text-sm w-full appearance-none`}
                    {...register("country")}
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.country && (
                  <span className="text-xs text-red-500 font-medium mt-0.5">{errors.country.message}</span>
                )}
              </div>

              {/* Procedure */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Procedure Needed <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Activity className="size-4" />
                  </span>
                  <select
                    className={`h-12 pl-11 pr-4 rounded-lg bg-slate-50 border border-slate-200 focus:border-primary transition-all text-sm w-full appearance-none`}
                    {...register("procedureName")}
                  >
                    {PROCEDURES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.procedureName && (
                  <span className="text-xs text-red-500 font-medium mt-0.5">{errors.procedureName.message}</span>
                )}
              </div>

              {/* Budget */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Approx Budget <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <DollarSign className="size-4" />
                  </span>
                  <select
                    className={`h-12 pl-11 pr-4 rounded-lg bg-slate-50 border border-slate-200 focus:border-primary transition-all text-sm w-full appearance-none`}
                    {...register("budget")}
                  >
                    {BUDGETS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.budget && (
                  <span className="text-xs text-red-500 font-medium mt-0.5">{errors.budget.message}</span>
                )}
              </div>

              {/* Preferred Contact Method */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Preferred Contact <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <MessageCircle className="size-4" />
                  </span>
                  <select
                    className={`h-12 pl-11 pr-4 rounded-lg bg-slate-50 border border-slate-200 focus:border-primary transition-all text-sm w-full appearance-none`}
                    {...register("preferredContact")}
                  >
                    {CONTACT_METHODS.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.preferredContact && (
                  <span className="text-xs text-red-500 font-medium mt-0.5">{errors.preferredContact.message}</span>
                )}
              </div>
            </div>

            {/* Custom Notes / Message */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Message / Symptoms (Optional)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-4 text-slate-400">
                  <MessageSquare className="size-4" />
                </span>
                <Textarea
                  placeholder="Briefly describe your symptoms, requested treatment, or questions..."
                  className="min-h-[90px] pl-11 rounded-lg bg-slate-50 border border-slate-200 focus:border-primary transition-all resize-none"
                  {...register("message")}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={requestMutation.isPending}
                className="h-11 px-5 rounded-lg border-slate-200 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={requestMutation.isPending}
                className="h-11 px-6 rounded-lg bg-primary hover:bg-[#0c314f] text-white transition-all shadow-sm font-semibold flex items-center gap-2"
              >
                {requestMutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Send Inquiry"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
