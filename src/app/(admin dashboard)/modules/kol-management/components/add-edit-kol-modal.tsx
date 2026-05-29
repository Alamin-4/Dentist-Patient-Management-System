"use client";

import { useState, useEffect, useRef } from "react";
import { X, Check, Upload, Mail, Phone, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type KOL = {
  id: string;
  name: string;
  initials: string;
  avatar_color: string;
  credentials: string;
  years_experience: number;
  specialty: string;
  country: string;
  languages: string[];
  contact_type: "email" | "whatsapp" | "contact_form";
  contact_value: string;
  status: "active" | "inactive";
  bio: string;
  linkedin_url: string;
  website_url: string;
  internal_notes: string;
  headshot?: string | null;
};

const SPECIALTIES = [
  "General Dentistry",
  "Orthodontics",
  "Cosmetic Dentistry",
  "Periodontics",
  "Endodontics",
  "Implants & Oral Surgery",
  "Oral Surgery",
  "Pediatric Dentistry",
  "Prosthodontics",
  "Dental Technology",
  "Oral Pathology",
  "Dental Public Health",
];

const COUNTRIES = [
  "Australia",
  "Brazil",
  "Canada",
  "Egypt",
  "France",
  "Germany",
  "India",
  "Japan",
  "Mexico",
  "Saudi Arabia",
  "South Africa",
  "Spain",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
];

type Step = 1 | 2 | 3 | 4;

interface FormData {
  name: string;
  credentials: string;
  years_experience: string;
  specialty: string;
  country: string;
  bio: string;
  languages: string;
  contact_type: "email" | "whatsapp" | "contact_form";
  contact_value: string;
  linkedin_url: string;
  website_url: string;
  internal_notes: string;
}

interface AddEditKolModalProps {
  open: boolean;
  mode: "add" | "edit";
  kol?: KOL | null;
  onClose: () => void;
  onSave: (data: Partial<KOL>) => void;
}

const STEP_LABELS = ["Basic Info", "Bio & Languages", "Contact", "Media & Notes"];

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

const AVATAR_COLORS = [
  "#7C3AED", "#059669", "#1D4ED8", "#B45309",
  "#0F766E", "#166534", "#DC2626", "#9333EA",
  "#0369A1", "#C2410C",
];

function randomColor() {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}

export function AddEditKolModal({ open, mode, kol, onClose, onSave }: AddEditKolModalProps) {
  const [step, setStep] = useState<Step>(1);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [avatarColor] = useState(kol?.avatar_color ?? randomColor());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [headshotPreview, setHeadshotPreview] = useState<string | null>(kol?.headshot ?? null);

  const [form, setForm] = useState<FormData>({
    name: "",
    credentials: "",
    years_experience: "",
    specialty: "",
    country: "",
    bio: "",
    languages: "",
    contact_type: "email",
    contact_value: "",
    linkedin_url: "",
    website_url: "",
    internal_notes: "",
  });

  useEffect(() => {
    if (open) {
      setStep(1);
      setErrors({});
      setHeadshotPreview(kol?.headshot ?? null);
      setForm({
        name: kol?.name ?? "",
        credentials: kol?.credentials ?? "",
        years_experience: kol?.years_experience?.toString() ?? "",
        specialty: kol?.specialty ?? "",
        country: kol?.country ?? "",
        bio: kol?.bio ?? "",
        languages: kol?.languages?.join(", ") ?? "",
        contact_type: kol?.contact_type ?? "email",
        contact_value: kol?.contact_value ?? "",
        linkedin_url: kol?.linkedin_url ?? "",
        website_url: kol?.website_url ?? "",
        internal_notes: kol?.internal_notes ?? "",
      });
    }
  }, [open, kol]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const set = (field: keyof FormData, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const validateStep = (s: Step): boolean => {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (s === 1) {
      if (!form.name.trim()) errs.name = "Required";
      if (!form.credentials.trim()) errs.credentials = "Required";
      if (!form.years_experience.trim() || isNaN(Number(form.years_experience)) || Number(form.years_experience) < 0)
        errs.years_experience = "Enter a valid number";
      if (!form.specialty) errs.specialty = "Required";
      if (!form.country) errs.country = "Required";
    }
    if (s === 2) {
      if (!form.bio.trim()) errs.bio = "Required";
      if (!form.languages.trim()) errs.languages = "Required";
    }
    if (s === 3) {
      if (form.contact_type !== "contact_form" && !form.contact_value.trim())
        errs.contact_value = "Required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => {
    if (!validateStep(step)) return;
    if (step < 4) setStep((s) => (s + 1) as Step);
  };

  const back = () => {
    if (step > 1) setStep((s) => (s - 1) as Step);
  };

  const handleSave = () => {
    if (!validateStep(step)) return;
    const langList = form.languages
      .split(",")
      .map((l) => l.trim())
      .filter(Boolean);
    const kolInitials = initials(form.name) || "KL";
    onSave({
      name: form.name.trim(),
      initials: kolInitials,
      avatar_color: kol?.avatar_color ?? avatarColor,
      credentials: form.credentials.trim(),
      years_experience: Number(form.years_experience),
      specialty: form.specialty,
      country: form.country,
      languages: langList,
      contact_type: form.contact_type,
      contact_value: form.contact_type === "contact_form" ? "" : form.contact_value.trim(),
      bio: form.bio.trim(),
      linkedin_url: form.linkedin_url.trim(),
      website_url: form.website_url.trim(),
      internal_notes: form.internal_notes.trim(),
      headshot: headshotPreview,
      status: kol?.status ?? "active",
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setHeadshotPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  if (!open) return null;

  const avatarInitials = form.name ? initials(form.name) || "KL" : kol?.initials ?? "KL";

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity duration-200"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative flex w-full max-w-[520px] flex-col rounded-xl bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
            <div>
              <h2 className="text-lg font-bold text-[#1A1A2E]">
                {mode === "add" ? "Add KOL" : "Edit KOL"}
              </h2>
              <p className="mt-0.5 text-sm text-gray-500">
                {mode === "add"
                  ? "KOL will be visible to dentists immediately."
                  : "Update the KOL's profile."}
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Stepper */}
          <div className="flex items-center gap-0 border-b border-gray-100 px-6 py-4">
            {STEP_LABELS.map((label, i) => {
              const n = (i + 1) as Step;
              const done = step > n;
              const active = step === n;
              return (
                <div key={n} className="flex flex-1 flex-col items-center">
                  <div className="flex w-full items-center">
                    {/* Connector left */}
                    {i > 0 && (
                      <div className={cn("h-0.5 flex-1 transition-colors", done || active ? "bg-[#1A1A2E]" : "bg-gray-200")} />
                    )}
                    {/* Circle */}
                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors",
                        done ? "bg-[#1A1A2E] text-white" : active ? "bg-[#1A1A2E] text-white" : "bg-gray-100 text-gray-400"
                      )}
                    >
                      {done ? <Check className="h-4 w-4" /> : n}
                    </div>
                    {/* Connector right */}
                    {i < STEP_LABELS.length - 1 && (
                      <div className={cn("h-0.5 flex-1 transition-colors", done ? "bg-[#1A1A2E]" : "bg-gray-200")} />
                    )}
                  </div>
                  <span
                    className={cn(
                      "mt-1.5 text-center text-[10px] font-semibold leading-tight transition-colors",
                      active ? "text-[#1A1A2E]" : done ? "text-gray-500" : "text-gray-400"
                    )}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Body */}
          <div className="max-h-[420px] overflow-y-auto px-6 py-5">
            {/* Step 1 */}
            {step === 1 && (
              <div className="flex flex-col gap-4">
                <Field label="Full name" required error={errors.name}>
                  <input
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="e.g. Dr. Sarah Kim"
                    className={inputCls(!!errors.name)}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Credentials" required error={errors.credentials}>
                    <input
                      value={form.credentials}
                      onChange={(e) => set("credentials", e.target.value)}
                      placeholder="e.g. DDS, MSD"
                      className={inputCls(!!errors.credentials)}
                    />
                  </Field>
                  <Field label="Years of experience" required error={errors.years_experience}>
                    <input
                      type="number"
                      min={0}
                      max={60}
                      value={form.years_experience}
                      onChange={(e) => set("years_experience", e.target.value)}
                      placeholder="e.g. 18"
                      className={inputCls(!!errors.years_experience)}
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Specialty" required error={errors.specialty}>
                    <select
                      value={form.specialty}
                      onChange={(e) => set("specialty", e.target.value)}
                      className={selectCls(!!errors.specialty)}
                    >
                      <option value="">Select specialty</option>
                      {SPECIALTIES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Country" required error={errors.country}>
                    <select
                      value={form.country}
                      onChange={(e) => set("country", e.target.value)}
                      className={selectCls(!!errors.country)}
                    >
                      <option value="">Select country</option>
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </Field>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="flex flex-col gap-4">
                <Field label="Bio" required error={errors.bio}>
                  <textarea
                    value={form.bio}
                    onChange={(e) => set("bio", e.target.value)}
                    rows={5}
                    placeholder="Write a professional bio for this KOL..."
                    className={cn(inputCls(!!errors.bio), "resize-none")}
                  />
                  <p className="mt-1 text-xs text-gray-400">Shown on the KOL's card in the dentist directory.</p>
                </Field>
                <Field label="Languages spoken" required error={errors.languages}>
                  <input
                    value={form.languages}
                    onChange={(e) => set("languages", e.target.value)}
                    placeholder="English, Spanish, French"
                    className={inputCls(!!errors.languages)}
                  />
                  <p className="mt-1 text-xs text-gray-400">Separate with commas.</p>
                </Field>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="flex flex-col gap-3">
                <p className="text-sm text-gray-500">
                  Choose how dentists will contact this KOL. The input field appears inside the selected option.
                </p>
                <ContactOption
                  icon={<Mail className="h-4 w-4" />}
                  label="Email address"
                  selected={form.contact_type === "email"}
                  onSelect={() => { set("contact_type", "email"); set("contact_value", ""); }}
                >
                  {form.contact_type === "email" && (
                    <input
                      value={form.contact_value}
                      onChange={(e) => set("contact_value", e.target.value)}
                      placeholder="e.g. doctor@clinic.com"
                      type="email"
                      className={cn(inputCls(!!errors.contact_value), "mt-3")}
                    />
                  )}
                  {errors.contact_value && form.contact_type === "email" && (
                    <p className="mt-1 text-xs text-red-500">{errors.contact_value}</p>
                  )}
                </ContactOption>

                <ContactOption
                  icon={<Phone className="h-4 w-4" />}
                  label="WhatsApp number"
                  selected={form.contact_type === "whatsapp"}
                  onSelect={() => { set("contact_type", "whatsapp"); set("contact_value", ""); }}
                >
                  {form.contact_type === "whatsapp" && (
                    <input
                      value={form.contact_value}
                      onChange={(e) => set("contact_value", e.target.value)}
                      placeholder="e.g. +1 234 567 8901"
                      type="tel"
                      className={cn(inputCls(!!errors.contact_value), "mt-3")}
                    />
                  )}
                  {errors.contact_value && form.contact_type === "whatsapp" && (
                    <p className="mt-1 text-xs text-red-500">{errors.contact_value}</p>
                  )}
                </ContactOption>

                <ContactOption
                  icon={<FileText className="h-4 w-4" />}
                  label="Contact form (platform hosted)"
                  badge="Auto-generated"
                  selected={form.contact_type === "contact_form"}
                  onSelect={() => { set("contact_type", "contact_form"); set("contact_value", ""); }}
                />
              </div>
            )}

            {/* Step 4 */}
            {step === 4 && (
              <div className="flex flex-col gap-4">
                {/* Headshot */}
                <div>
                  <p className="mb-2 text-sm font-semibold text-[#1A1A2E]">Headshot</p>
                  <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <div
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white"
                      style={{ backgroundColor: kol?.avatar_color ?? avatarColor }}
                    >
                      {headshotPreview ? (
                        <img src={headshotPreview} alt="" className="h-14 w-14 rounded-full object-cover" />
                      ) : (
                        avatarInitials
                      )}
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-[#1A1A2E] hover:bg-gray-50 transition-colors"
                      >
                        <Upload className="h-3.5 w-3.5" />
                        Upload photo
                      </button>
                      <p className="mt-1 text-xs text-gray-400">JPG or PNG · max 2MB · shown in dentist directory</p>
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>

                {/* URLs */}
                <div className="grid grid-cols-2 gap-3">
                  <Field label="LinkedIn URL">
                    <input
                      value={form.linkedin_url}
                      onChange={(e) => set("linkedin_url", e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                      className={inputCls(false)}
                    />
                  </Field>
                  <Field label="Website URL">
                    <input
                      value={form.website_url}
                      onChange={(e) => set("website_url", e.target.value)}
                      placeholder="https://..."
                      className={inputCls(false)}
                    />
                  </Field>
                </div>

                {/* Internal notes */}
                <Field label="Internal notes">
                  <textarea
                    value={form.internal_notes}
                    onChange={(e) => set("internal_notes", e.target.value)}
                    rows={3}
                    placeholder="Admin-only notes about this KOL — never visible to dentists."
                    className={cn(inputCls(false), "resize-none")}
                  />
                  <p className="mt-1 text-xs text-gray-400">Only visible to platform admins.</p>
                </Field>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
            <button
              onClick={step === 1 ? onClose : back}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#1A1A2E] hover:bg-gray-50 transition-colors"
            >
              {step > 1 && <ChevronLeft className="h-4 w-4" />}
              {step === 1 ? "Cancel" : "Back"}
            </button>
            <span className="text-xs text-gray-400">Step {step} of 4</span>
            {step < 4 ? (
              <button
                onClick={next}
                className="flex items-center gap-1.5 rounded-lg bg-[#1A1A2E] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1A1A2E]/90 transition-colors"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 rounded-lg bg-[#1A1A2E] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1A1A2E]/90 transition-colors"
              >
                {mode === "add" ? "Add to directory" : "Save changes"}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
function Field({
  label, required, error, children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-[#1A1A2E]">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function ContactOption({
  icon, label, badge, selected, onSelect, children,
}: {
  icon: React.ReactNode;
  label: string;
  badge?: string;
  selected: boolean;
  onSelect: () => void;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full rounded-xl border px-4 py-3.5 text-left transition-colors",
        selected ? "border-[#1A1A2E] bg-gray-50" : "border-gray-200 bg-white hover:border-gray-300"
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors", selected ? "border-[#1A1A2E]" : "border-gray-300")}>
          {selected && <div className="h-2.5 w-2.5 rounded-full bg-[#1A1A2E]" />}
        </div>
        <span className={cn("flex items-center gap-2 text-sm font-semibold", selected ? "text-[#1A1A2E]" : "text-gray-600")}>
          {icon} {label}
        </span>
        {badge && (
          <span className="ml-auto rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
            {badge}
          </span>
        )}
      </div>
      {children}
    </button>
  );
}

const inputCls = (hasError: boolean) =>
  cn(
    "w-full rounded-lg border px-3.5 py-2.5 text-sm text-[#1A1A2E] outline-none placeholder:text-gray-400 transition-colors",
    hasError
      ? "border-red-400 focus:border-red-400 focus:ring-1 focus:ring-red-400"
      : "border-gray-200 focus:border-[#1A1A2E] focus:ring-1 focus:ring-[#1A1A2E]"
  );

const selectCls = (hasError: boolean) =>
  cn(
    "w-full rounded-lg border px-3.5 py-2.5 text-sm text-[#1A1A2E] outline-none transition-colors bg-white appearance-none",
    hasError
      ? "border-red-400 focus:border-red-400 focus:ring-1 focus:ring-red-400"
      : "border-gray-200 focus:border-[#1A1A2E] focus:ring-1 focus:ring-[#1A1A2E]"
  );
