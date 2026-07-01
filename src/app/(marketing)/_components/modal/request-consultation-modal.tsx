"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { Mail, User, MessageSquare, Loader2, Sparkles } from "lucide-react";

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
import { useRequestDirectoryConsultation } from "@/hooks/dentist/useDentistDirectory";

const schema = z.object({
  patientName: z.string().min(1, "Name is required"),
  patientEmail: z.string().email("Please enter a valid email address"),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

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
      message: "",
    },
  });

  // Auto-populate when user is logged in
  useEffect(() => {
    if (user) {
      const name = user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim();
      setValue("patientName", name);
      setValue("patientEmail", user.email || "");
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

  if (!requestConsultationDentist) return null;

  return (
    <Dialog open={showRequestConsultationModal} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl transition-all duration-300">

        {/* Decorative top accent gradient */}
        <div className="h-2 w-full bg-linear-to-r from-blue-600 via-[#10436B] to-emerald-500" />

        <div className="p-8">
          <DialogHeader className="gap-2 text-left relative">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#10436B] border border-blue-100 w-fit">
              <Sparkles className="size-3.5 text-blue-500 animate-pulse" />
              Direct Inquiry
            </div>
            <DialogTitle className="text-2xl font-bold font-heading text-slate-900 dark:text-white leading-tight">
              Request Consultation
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Submit an inquiry to <span className="font-semibold text-slate-800 dark:text-slate-200">Dr. {requestConsultationDentist.name}</span>. The clinic will review your request and get in touch.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5" noValidate>

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
                  className={`h-12 pl-11 rounded-lg bg-slate-50 border transition-all ${errors.patientName ? "border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-[#10436B]"
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
                  className={`h-12 pl-11 rounded-lg bg-slate-50 border transition-all ${errors.patientEmail ? "border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-[#10436B]"
                    }`}
                  {...register("patientEmail")}
                />
              </div>
              {errors.patientEmail && (
                <span className="text-xs text-red-500 font-medium mt-0.5">{errors.patientEmail.message}</span>
              )}
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
                  className="min-h-[100px] pl-11 rounded-lg bg-slate-50 border border-slate-200 focus:border-[#10436B] transition-all resize-none"
                  {...register("message")}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-5">
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
                className="h-11 px-6 rounded-lg bg-[#10436B] hover:bg-[#0c314f] text-white transition-all shadow-sm font-semibold flex items-center gap-2"
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
