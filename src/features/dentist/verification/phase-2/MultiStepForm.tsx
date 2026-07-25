"use client";

import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { SterilizationSection } from "./SterilizationSection";
import { ProcedurePricingSection } from "./ProcedurePricingSection";
import { GuaranteeSection } from "./GuaranteeSection";
import { formSchema, FormValues } from "@/validation/Verification-doctor-phase/phase-form";
import { useStepTwoMutation } from "@/hooks/dentist/useDentist";
import toast from "react-hot-toast";
import useVerificationProgress from "@/hooks/dentist/useStepProgress";
import { VerificationStatusScreen } from "../VerificationStatusScreen";
import { useVerificationStore } from "@/lib/hooks/verification-store-hooks";

export default function MultiStepForm() {
  const router = useRouter();
  const stepTwoMutation = useStepTwoMutation();
  const { checkPhotoVerifyProgress, step2Status, step2Note } = useVerificationProgress();
  const { setVerificationStepReady } = useVerificationStore();
  const progressData = checkPhotoVerifyProgress?.data;
  const hasServerData = !!progressData?.data;

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      jciCertificate: null,
      videoWalkthrough: null,
      procedures: [{ name: "", price: 0, notes: "" }],
      signerFullName: "",
      typedSignature: "",
      agreeToGuarantee: false,
    },
  });

  // Populate form with existing server data if available
  useEffect(() => {
    if (hasServerData && progressData?.data) {
      const serverData = progressData.data as any;
      let procedures = [];
      try { procedures = typeof serverData.procedures === "string" ? JSON.parse(serverData.procedures) : serverData.procedures || []; } catch { procedures = []; }

      let guarantee = {};
      try { guarantee = typeof serverData.guarantee === "string" ? JSON.parse(serverData.guarantee) : serverData.guarantee || {}; } catch { guarantee = {}; }

      methods.reset({
        jciCertificate: serverData.jci_certificate ? new File([], "JCI Certificate") : null,
        videoWalkthrough: serverData.walkthrough_video ? new File([], "Video Walkthrough") : null,
        procedures: procedures.map((p: any) => ({
          id: p.procedure_id,
          name: p.procedure_name || p.name,
          price: p.price,
          notes: p.option_notes || p.notes || "",
        })),
        signerFullName: (guarantee as any).signer_name || "",
        typedSignature: (guarantee as any).typed_signature || "",
        agreeToGuarantee: (guarantee as any).accepted_terms || false,
      });
    }
  }, [hasServerData, progressData, methods]);

  const onSubmit = (data: FormValues) => {
    const payload = {
      jciCertificate: data.jciCertificate instanceof File ? data.jciCertificate : null,
      walkthroughVideo: data.videoWalkthrough instanceof File ? data.videoWalkthrough : null,
      signerName: data.signerFullName,
      signature: data.typedSignature,
      agreedToGuarantee: data.agreeToGuarantee,
      procedures: data.procedures.map((p) => ({
        procedureName: p.name,
        price: Number(p.price),
        notes: p.notes || "",
      })),
    };

    stepTwoMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Operations verification submitted successfully!");
        setTimeout(() => router.push("/dentist/verification?phase=clinic-depth-verify"), 1500);
      },
      onError: (error: any) => {
        const resData = error?.response?.data;
        const newErrors: Record<string, string> = {};

        // 🚨 ROBUST AppError Mapping based on your backend structure
        const mapError = (path: string | string[] | undefined, message: string) => {
          if (!path) return;
          const p = Array.isArray(path) ? path.join(".") : path;

          // Map backend field names to frontend RHF field names
          let fieldName = p;
          if (p === "signerName") fieldName = "signerFullName";
          else if (p === "signature") fieldName = "typedSignature";
          else if (p === "agreedToGuarantee") fieldName = "agreeToGuarantee";
          else if (p === "walkthroughVideo") fieldName = "videoWalkthrough";

          newErrors[fieldName] = message;
        };

        // Case 1: Single AppError with path and message
        if (resData?.path && resData?.message) {
          mapError(resData.path, resData.message);
        }
        // Case 2: Array of AppError in errorDetails
        else if (Array.isArray(resData?.errorDetails)) {
          resData.errorDetails.forEach((issue: any) => mapError(issue.path, issue.message));
        }
        // Case 3: Standard { errors: [{ field, message }] }
        else if (Array.isArray(resData?.errors)) {
          resData.errors.forEach((err: any) => mapError(err.field, err.message));
        }

        // Case 4: Fallback for generic multer/file size errors
        if (Object.keys(newErrors).length === 0 && resData?.message) {
          const msg = resData.message.toLowerCase();
          if (msg.includes("5mb") || msg.includes("file size") || msg.includes("multer")) {
            if (data.jciCertificate instanceof File && data.jciCertificate.size > 5 * 1024 * 1024) {
              newErrors["jciCertificate"] = "File size exceeds 5MB limit.";
            }
            if (data.videoWalkthrough instanceof File && data.videoWalkthrough.size > 5 * 1024 * 1024) {
              newErrors["videoWalkthrough"] = "File size exceeds 5MB limit.";
            }
          }
        }

        // Apply all mapped errors to React Hook Form
        if (Object.keys(newErrors).length > 0) {
          Object.entries(newErrors).forEach(([field, message]) => {
            methods.setError(field as any, { type: "server", message });
          });
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          toast.error(resData?.message || "Submission failed. Please try again.");
        }
      },
    });
  };

  const formLocked = step2Status === "APPROVED";
  const { isValid } = methods.formState;

  useEffect(() => {
    if (formLocked) {
      setVerificationStepReady(2, true);
      return;
    }
    const timeoutId = window.setTimeout(() => {
      setVerificationStepReady(2, methods.formState.isValid);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [methods.formState.isValid, formLocked, setVerificationStepReady]);

  if (step2Status === "SUBMITTED") {
    return <VerificationStatusScreen status="SUBMITTED" phaseName="Operations Verification" />;
  }

  return (
    <div className="space-y-6">
      {step2Status === "REJECTED" && (
        <VerificationStatusScreen status="REJECTED" phaseName="Operations Verification" rejectionNote={step2Note} />
      )}

      <FormProvider {...methods}>
        <form id="phase-2-verification-form" onSubmit={methods.handleSubmit(onSubmit)} className="space-y-0">
          <SterilizationSection disabled={formLocked} />
          <ProcedurePricingSection disabled={formLocked} />
          <GuaranteeSection disabled={formLocked} />
        </form>
      </FormProvider>
    </div>
  );
}