"use client";

import { useEffect, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { SterilizationSection } from "./SterilizationSection";
import { ProcedurePricingSection } from "./ProcedurePricingSection";
import { GuaranteeSection } from "./GuaranteeSection";
import { formSchema, FormValues } from "@/validation/Verification-doctor-phase/phase-form";
import { useStepTwoMutation } from "@/hooks/dentist/useDentist";
import toast from "react-hot-toast";
import useVerificationProgress from "@/hooks/dentist/useStepProgress";
import { VerificationStatusScreen } from "../VerificationStatusScreen";
import { useVerificationStore } from "@/lib/hooks/verification-store-hooks";

function mapBackendField(rawPath: string | string[] | undefined): string | null {
  if (!rawPath) return null;

  let path = Array.isArray(rawPath) ? rawPath.join(".") : rawPath;

  path = path.replace(/\[(\d+)\]/g, ".$1");

  const FIELD_MAP: Record<string, string> = {
    signerName: "signerFullName",
    signature: "typedSignature",
    agreedToGuarantee: "agreeToGuarantee",
    walkthroughVideo: "videoWalkthrough",
    jciCertificate: "jciCertificate",
  };

  const root = path.split(".")[0];
  if (FIELD_MAP[root]) {
    path = path.replace(root, FIELD_MAP[root]);
  }

  return path;
}


export default function MultiStepForm() {
  const router = useRouter();
  const stepTwoMutation = useStepTwoMutation();
  const { checkPhotoVerifyProgress, step2Status, step2Note } = useVerificationProgress();
  const { setVerificationStepReady } = useVerificationStore();

  const progressData = checkPhotoVerifyProgress?.data;
  const hasServerData = !!progressData?.data;

  const bannerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (hasServerData && progressData?.data) {
      const serverData = progressData.data as any;

      let procedures: any[] = [];
      try {
        procedures =
          typeof serverData.procedures === "string"
            ? JSON.parse(serverData.procedures)
            : serverData.procedures || [];
      } catch {
        procedures = [];
      }

      let guarantee: any = {};
      try {
        guarantee =
          typeof serverData.guarantee === "string"
            ? JSON.parse(serverData.guarantee)
            : serverData.guarantee || {};
      } catch {
        guarantee = {};
      }

      methods.reset({
        jciCertificate: serverData.jci_certificate
          ? new File([], "JCI Certificate")
          : null,
        videoWalkthrough: serverData.walkthrough_video
          ? new File([], "Video Walkthrough")
          : null,
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
    methods.clearErrors("root");

    const payload = {
      jciCertificate:
        data.jciCertificate instanceof File ? data.jciCertificate : null,
      walkthroughVideo:
        data.videoWalkthrough instanceof File ? data.videoWalkthrough : null,
      signerName: data.signerFullName,
      signature: data.typedSignature,
      agreedToGuarantee: data.agreeToGuarantee,
      procedures: data.procedures.map((p) => ({
        procedureName: p.name,
        price: Number(p.price),
        notes: p.notes || "",
      })),
    };

    if (payload.jciCertificate instanceof File && payload.jciCertificate.size > 5 * 1024 * 1024) {
      const sizeMB = (payload.jciCertificate.size / (1024 * 1024)).toFixed(2);
      const msg = `JCI Certificate file size (${sizeMB} MB) exceeds the 5MB limit. Please upload a file under 5MB.`;
      methods.setError("jciCertificate", { type: "manual", message: msg });
      return;
    }

    if (payload.walkthroughVideo instanceof File && payload.walkthroughVideo.size > 5 * 1024 * 1024) {
      const sizeMB = (payload.walkthroughVideo.size / (1024 * 1024)).toFixed(2);
      const msg = `Video Walkthrough file size (${sizeMB} MB) exceeds the 5MB limit. Please upload a video under 5MB.`;
      methods.setError("videoWalkthrough", { type: "manual", message: msg });
      return;
    }

    stepTwoMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Operations verification submitted successfully!");
        setTimeout(
          () => router.push("/dentist/verification?phase=clinic-depth-verify"),
          1500,
        );
      },

      onError: (error: any) => {
        // ── 413 Request Entity Too Large (nginx rejected before backend) ──
        if (error?.status === 413 || error?.isFileTooLarge || error?.response?.status === 413) {
          const msg = "Your uploaded file is too large. The maximum allowed file size is 5MB.";
          methods.setError("root", { type: "server", message: msg });
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }

        const resData = error?.response?.data;

        const fieldErrors: Record<string, string> = {};
        let rootMessage: string | null = null;

        const tryMapField = (
          path: string | string[] | undefined,
          message: string,
        ): boolean => {
          const mapped = mapBackendField(path);
          if (!mapped) return false;
          fieldErrors[mapped] = message;
          return true;
        };

        if (resData?.path && resData?.message) {
          tryMapField(resData.path, resData.message);
        }
        else if (Array.isArray(resData?.errorDetails)) {
          resData.errorDetails.forEach((issue: any) =>
            tryMapField(issue.path, issue.message),
          );
        }
        else if (Array.isArray(resData?.errors)) {
          resData.errors.forEach((err: any) =>
            tryMapField(err.field ?? err.path, err.message),
          );
        }

        if (
          Object.keys(fieldErrors).length === 0 &&
          resData?.message
        ) {
          const msg: string = resData.message.toLowerCase();
          if (
            msg.includes("5mb") ||
            msg.includes("file size") ||
            msg.includes("multer")
          ) {
            if (
              data.jciCertificate instanceof File &&
              data.jciCertificate.size > 5 * 1024 * 1024
            ) {
              fieldErrors["jciCertificate"] = "File size exceeds 5 MB limit.";
            }
            if (
              data.videoWalkthrough instanceof File &&
              data.videoWalkthrough.size > 5 * 1024 * 1024
            ) {
              fieldErrors["videoWalkthrough"] = "File size exceeds 5 MB limit.";
            }
          }
        }

        if (Object.keys(fieldErrors).length > 0) {
          Object.entries(fieldErrors).forEach(([field, message]) => {
            methods.setError(field as any, { type: "server", message });
          });
        } else {
          rootMessage =
            resData?.message ||
            error?.message ||
            "Submission failed. Please check your inputs and try again.";
        }

        if (rootMessage) {
          methods.setError("root", { type: "server", message: rootMessage });
        }

        window.scrollTo({ top: 0, behavior: "smooth" });
      },
    });
  };

  const formLocked = step2Status === "APPROVED";

  useEffect(() => {
    if (formLocked) {
      setVerificationStepReady(2, true);
      return;
    }
    const id = window.setTimeout(() => {
      setVerificationStepReady(2, methods.formState.isValid);
    }, 0);
    return () => window.clearTimeout(id);
  }, [methods.formState.isValid, formLocked, setVerificationStepReady]);

  if (step2Status === "SUBMITTED") {
    return (
      <VerificationStatusScreen
        status="SUBMITTED"
        phaseName="Operations Verification"
      />
    );
  }

  const rootError = methods.formState.errors.root;

  return (
    <div className="space-y-6">
      {step2Status === "REJECTED" && (
        <VerificationStatusScreen
          status="REJECTED"
          phaseName="Operations Verification"
          rejectionNote={step2Note}
        />
      )}

      {rootError?.message && (
        <div
          ref={bannerRef}
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-5 py-4 text-sm text-destructive animate-in fade-in slide-in-from-top-2"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <p>
            <span className="font-semibold">Action Required: </span>
            {rootError.message}
          </p>
        </div>
      )}

      <FormProvider {...methods}>
        <form
          id="phase-2-verification-form"
          onSubmit={methods.handleSubmit(onSubmit)}
          className="space-y-0"
        >
          <SterilizationSection disabled={formLocked} />
          <ProcedurePricingSection disabled={formLocked} />
          <GuaranteeSection disabled={formLocked} />
        </form>
      </FormProvider>
    </div>
  );
}