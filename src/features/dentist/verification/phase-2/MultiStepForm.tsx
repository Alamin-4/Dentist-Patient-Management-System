"use client";

import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { SterilizationSection } from "./SterilizationSection";
import { ProcedurePricingSection } from "./ProcedurePricingSection";
import { GuaranteeSection } from "./GuaranteeSection";
import {
  formSchema,
  FormInputValues,
  FormValues,
} from "@/validation/Verification-doctor-phase/phase-form";
import { useStepTwoMutation } from "@/hooks/dentist/useDentist";
import { StepTwoI } from "@/hooks/dentist/dentist.interface";
import toast from "react-hot-toast";
import { Loader2, XCircle } from "lucide-react";
import useVerificationProgress from "@/hooks/dentist/useStepProgress";
import { VerificationStatusScreen } from "../VerificationStatusScreen";

export default function MultiStepForm() {
  const router = useRouter();
  const stepTwoMutation = useStepTwoMutation();
  const { checkPhotoVerifyProgress, step2Status, step2Note } = useVerificationProgress();

  const progressData = checkPhotoVerifyProgress?.data;
  const hasServerData = !!progressData?.data;

  const methods = useForm<FormInputValues, unknown, FormValues>({
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

  useEffect(() => {
    if (hasServerData && progressData?.data) {
      const serverData = progressData.data as any;

      let procedures = [];
      try {
        procedures = typeof serverData.procedures === "string"
          ? JSON.parse(serverData.procedures)
          : serverData.procedures || [];
      } catch (e) {
        procedures = serverData.procedures || [];
      }

      let guarantee = {} as any;
      try {
        guarantee = typeof serverData.guarantee === "string"
          ? JSON.parse(serverData.guarantee)
          : serverData.guarantee || {};
      } catch (e) {
        guarantee = serverData.guarantee || {};
      }

      methods.reset({
        jciCertificate: serverData.jci_certificate ? new File([], "JCI Certificate") : null,
        videoWalkthrough: serverData.walkthrough_video ? new File([], "Video Walkthrough") : null,
        procedures: procedures.map((p: any) => ({
          id: p.procedure_id,
          name: p.procedure_name || p.name,
          price: p.price,
          notes: p.option_notes || p.notes || "",
        })),
        signerFullName: guarantee.signer_name || "",
        typedSignature: guarantee.typed_signature || "",
        agreeToGuarantee: guarantee.accepted_terms || false,
      });
    }
  }, [hasServerData, progressData, methods]);

  const onSubmit = (data: FormValues) => {
    const procedures = data.procedures.map((p) => ({
      procedureName: p.name,
      price: Number(p.price),
      notes: p.notes || "",
    }));

    const payload: StepTwoI = {
      jciCertificate: data.jciCertificate || null,
      walkthroughVideo: data.videoWalkthrough || null,
      signerName: data.signerFullName,
      signature: data.typedSignature,
      agreedToGuarantee: data.agreeToGuarantee,
      procedures,
    };

    console.log("clicked")

    stepTwoMutation.mutate(payload, {
      onSuccess: () => {
        setTimeout(() => {
          router.push("/dentist/verification?phase=clinic-depth-verify");
        }, 1500);
      },
      onError: (error: any) => {
        const resData = error?.response?.data;
        const newErrors: Record<string, string> = {};

        // 1. Check if there is an errorDetails.field
        const field = resData?.errorDetails?.field || resData?.field;
        const msg = resData?.message || error?.message || "Operations verification submission failed. Please try again.";
        if (field) {
          newErrors[field] = msg;
        }

        // 2. Check if there is an errors array
        if (Array.isArray(resData?.errors)) {
          for (const errObj of resData.errors) {
            if (errObj.field) {
              newErrors[errObj.field] = errObj.message;
            }
          }
        }

        // 3. Check if there are ZodIssues
        if (Array.isArray(resData?.errorDetails)) {
          for (const issue of resData.errorDetails) {
            const fieldName = issue.path?.[issue.path.length - 1];
            if (fieldName) {
              newErrors[fieldName] = issue.message;
            }
          }
        }

        const getFileObj = (fileValue: any): File | null => {
          if (fileValue instanceof File) return fileValue;
          if (fileValue instanceof FileList && fileValue.length > 0) return fileValue[0];
          return null;
        };

        // 4. Map file size limit errors from backend if not mapped to a specific field
        if (
          Object.keys(newErrors).length === 0 &&
          (msg.toLowerCase().includes("5mb") || msg.toLowerCase().includes("file size is too large") || msg.toLowerCase().includes("multer"))
        ) {
          const jci = getFileObj(methods.watch("jciCertificate"));
          const video = getFileObj(methods.watch("videoWalkthrough"));
          if (jci && jci.size > 5 * 1024 * 1024) {
            newErrors["jciCertificate"] = "File size is too large. Maximum allowed size is 5MB.";
          }
          if (video && video.size > 5 * 1024 * 1024) {
            newErrors["walkthroughVideo"] = "File size is too large. Maximum allowed size is 5MB.";
          }
        }

        if (Object.keys(newErrors).length > 0) {
          Object.entries(newErrors).forEach(([fieldName, message]) => {
            // Map backend fields to frontend form names
            let mappedName: any = fieldName;
            if (fieldName === "signerName") mappedName = "signerFullName";
            if (fieldName === "signature") mappedName = "typedSignature";
            if (fieldName === "agreedToGuarantee") mappedName = "agreeToGuarantee";
            if (fieldName === "walkthroughVideo") mappedName = "videoWalkthrough";

            methods.setError(mappedName, {
              type: "manual",
              message,
            });
          });
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      },
    });
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).getFormErrors = () => methods.formState.errors;
      (window as any).getFormValues = () => methods.getValues();
    }
    return () => {
      if (typeof window !== "undefined") {
        delete (window as any).getFormErrors;
        delete (window as any).getFormValues;
      }
    };
  }, [methods]);

  const onInvalid = (errors: any) => {
    console.warn("Validation failed for Phase 2 Form:", errors);
    toast.error("Please fill all required fields correctly.");
  };

  // While waiting for admin review — show status screen only
  if (step2Status === "SUBMITTED") {
    return (
      <VerificationStatusScreen
        status="SUBMITTED"
        phaseName="Operations Verification"
      />
    );
  }

  const formLocked = step2Status === "APPROVED";

  return (
    <div className="space-y-6">
      {step2Status === "REJECTED" && (
        <VerificationStatusScreen
          status="REJECTED"
          phaseName="Operations Verification"
          rejectionNote={step2Note || undefined}
        />
      )}
      <FormProvider {...methods}>
        <form
          id="phase-2-verification-form"
          onSubmit={methods.handleSubmit(onSubmit, onInvalid)}
          className="space-y-0"
        >
          <SterilizationSection disabled={formLocked} />
          <ProcedurePricingSection disabled={formLocked} />
          <GuaranteeSection disabled={formLocked} />

          {stepTwoMutation.error && (
            <div className="p-4 mt-6 rounded-lg border border-red-200 bg-red-50 text-red-600 text-sm font-semibold flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-1">
              <XCircle className="h-5 w-5 shrink-0 text-red-500" />
              <span>
                {(stepTwoMutation.error as any)?.response?.data?.message || stepTwoMutation.error?.message || "Operations verification submission failed. Please try again."}
              </span>
            </div>
          )}
        </form>
      </FormProvider>
    </div>
  );
}