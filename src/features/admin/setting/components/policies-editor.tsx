"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RichDocumentEditor } from "@/components/ui/rich-document-editor";
import { policySchema, type PolicyFormValues } from "@/validation/settings-schemas";
import { bindServerErrors, useSavePolicy } from "@/core/hooks/admin/settings/useAdminSettings";
import { cn } from "@/lib/utils";

type PolicyType = "privacy" | "terms" | "cookies";

const POLICY_METADATA: Record<PolicyType, { title: string; defaultText: string }> = {
  privacy: {
    title: "Privacy Policy",
    defaultText: `<h1>Privacy Policy</h1><p>Last updated: July 23, 2026</p>2. Information We Collect</h2><p>We collect personal identifiers such as name, email address, and billing details when you register as a patient or dentist on RatedDocs.</p><h2>2. How We Use Information</h2><p>We use your collected credentials to establish consultations, verify professional dentistry licensing, and guarantee payouts in our surprise guarantee escrow system.</p><h2>3. Data Protection and Compliance</h2><p>Your health history, medical records, and booking images are encrypted end-to-end and stored securely. We do not sell or share patient data with third parties.</p>`,
  },
  terms: {
    title: "Terms of Service",
    defaultText: `<h1>Terms of Service</h1><p>Last updated: July 23, 2026</p><h2>1. User Agreement</h2><p>By establishing an account on RatedDocs, you agree to comply with our patient safety standards and dispute resolution terms.</p><h2>2. Booking and Escrow Protection</h2><p>All consultations are secured under our escrow service. Payouts are released once the treatment plan has been signed and confirmed by the patient.</p><h2>3. Account Termination Guidelines</h2><p>We reserve the right to suspend any account violating compliance policies, license fraud checks, or clinical depth protocols.</p>`,
  },
  cookies: {
    title: "Cookie Policy",
    defaultText: `<h1>Cookie Policy</h1><p>Last updated: July 23, 2026</p><h2>1. What Are Cookies</h2><p>Cookies are tiny text files saved on your browser to collect user interactions and session states.</p><h2>2. Strictly Necessary Cookies</h2><p>We use necessary session tokens to keep you logged into the patient overview dashboard and admin settings panel.</p><h2>3. Performance and Analytics</h2><p>We utilize anonymous performance trackers to analyze LCP, load speeds, and user navigation paths to optimize features.</p>`,
  },
};

export function PoliciesEditor() {
  const [activeTab, setActiveTab] = useState<PolicyType>("privacy");
  const savePolicyMutation = useSavePolicy();

  // React Hook Form initialization with Zod Schema validation
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm<PolicyFormValues>({
    resolver: zodResolver(policySchema),
    defaultValues: {
      activeTab: "privacy",
      title: POLICY_METADATA.privacy.title,
      content: "",
    },
  });

  const contentValue = watch("content");
  const titleValue = watch("title");

  useEffect(() => {
    const saved =
      localStorage.getItem(`policy_${activeTab}`) || POLICY_METADATA[activeTab].defaultText;
    setValue("activeTab", activeTab);
    setValue("title", POLICY_METADATA[activeTab].title);
    setValue("content", saved, { shouldValidate: true });
  }, [activeTab, setValue]);

  const onSubmit = async (data: PolicyFormValues) => {
    try {
      localStorage.setItem(`policy_${activeTab}`, data.content);
      await savePolicyMutation.mutateAsync({
        type: activeTab,
        content: data.content,
      });
    } catch (err: any) {
      bindServerErrors(err, setError);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      
      <div className="flex gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        {(Object.keys(POLICY_METADATA) as PolicyType[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer",
              activeTab === tab
                ? "bg-primary text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            {POLICY_METADATA[tab].title}
          </button>
        ))}
      </div>

      {errors.title && (
        <p className="text-xs text-red-500 font-bold bg-red-50 p-2 rounded border border-red-200">
          Title Error: {errors.title.message}
        </p>
      )}
      {errors.content && (
        <p className="text-xs text-red-500 font-bold bg-red-50 p-2 rounded border border-red-200">
          Document Error: {errors.content.message}
        </p>
      )}

      <RichDocumentEditor
        categoryName="POLICIES & LEGAL"
        title={titleValue}
        onTitleChange={(val) => setValue("title", val, { shouldValidate: true })}
        content={contentValue || ""}
        onChange={(val) => setValue("content", val, { shouldValidate: true })}
        onSave={handleSubmit(onSubmit)}
        isSaving={savePolicyMutation.isPending}
      />
    </form>
  );
}
