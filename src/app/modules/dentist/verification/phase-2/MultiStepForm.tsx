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
import useDentist from "@/hooks/dentist/useDentist";
import { StepTwoI } from "@/hooks/dentist/dentist.interface";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import useVerificationProgress from "@/hooks/dentist/useStepProgress";

export default function MultiStepForm() {
  const router = useRouter();
  const { stepTwoMutation } = useDentist();
  const { checkPhotoVerifyProgress } = useVerificationProgress();

  const progressData = checkPhotoVerifyProgress?.data;
  const isAlreadySubmitted = progressData?.submitted === true;

  const methods = useForm<FormInputValues, unknown, FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      jciCertificate: null,
      videoWalkthrough: null,
      procedures: [{ name: "Implant consultation", price: 250, notes: "" }],
      signerFullName: "",
      typedSignature: "",
      agreeToGuarantee: false,
    },
  });

  // Load existing data if already submitted
  useEffect(() => {
    if (isAlreadySubmitted && progressData?.data) {
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
  }, [isAlreadySubmitted, progressData, methods]);

  const onSubmit = (data: FormValues) => {
    if (isAlreadySubmitted) {
      toast.error(
        "Operations verification is already submitted and pending review.",
      );
      return;
    }

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

    stepTwoMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Phase 2 submitted successfully! Moving to Phase 3...");

        // ✅ সরাসরি redirect করুন (modal বাদ দিয়ে)
        setTimeout(() => {
          router.push("/dentist/verification?phase=clinic-depth-verify");
        }, 1500); // 1.5 second delay for toast to show
      },
      onError: (error: unknown) => {
        const errMsg =
          typeof error === "object" && error !== null
            ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message ||
            "Operations verification submission failed. Please try again."
            : "Operations verification submission failed. Please try again.";
        toast.error(errMsg);
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <form
        id="phase-2-verification-form"
        onSubmit={methods.handleSubmit(onSubmit)}
        className="space-y-0"
      >
        <SterilizationSection disabled={isAlreadySubmitted} />
        <ProcedurePricingSection disabled={isAlreadySubmitted} />
        <GuaranteeSection disabled={isAlreadySubmitted} />
        {stepTwoMutation.isPending && (
          <div className="flex justify-center items-center py-6 border-t bg-card">
            <Loader2 className="animate-spin h-6 w-6 text-[#0E3E65]" />
            <span className="ml-2 text-sm text-muted-foreground">
              Submitting Phase 2...
            </span>
          </div>
        )}
      </form>
    </FormProvider>
  );
}