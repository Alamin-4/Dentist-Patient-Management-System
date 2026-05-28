"use client";

import { useState } from "react";
import { User, Lock, Camera, Eye, EyeOff, Check, Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

type ProfileTab = "profile" | "password";

const ADMIN = {
  first_name: "Jordan",
  last_name: "Smith",
  email: "jordan@rateddocs.com",
  phone: "+1 415 555 0100",
  role: "Platform Administrator",
  department: "Engineering",
  initials: "JS",
  avatar_color: "#7C3AED",
  bio: "Managing the RatedDocs admin platform. Passionate about building great dental experiences.",
};

/* ─── Profile Info section ──────────────────────────────────────────────── */
function ProfileInfo() {
  const [form, setForm] = useState({
    first_name: ADMIN.first_name,
    last_name: ADMIN.last_name,
    email: ADMIN.email,
    phone: ADMIN.phone,
    bio: ADMIN.bio,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex-1 space-y-6">
      {/* Avatar card */}
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white" style={{ backgroundColor: ADMIN.avatar_color }}>
              {ADMIN.initials}
            </div>
            <button className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-[#1A1A2E] text-white shadow">
              <Camera className="h-3 w-3" />
            </button>
          </div>
          <div>
            <p className="text-lg font-bold text-[#1A1A2E]">{ADMIN.first_name} {ADMIN.last_name}</p>
            <p className="text-sm text-gray-400">{ADMIN.role} · {ADMIN.department}</p>
          </div>
        </div>
      </div>

      {/* Personal details */}
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <h3 className="mb-5 text-base font-semibold text-[#1A1A2E]">Personal details</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* First name */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-500">First name</label>
            <input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-[#1A1A2E] outline-none focus:border-[#1A1A2E] focus:ring-1 focus:ring-[#1A1A2E]" />
          </div>
          {/* Last name */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-500">Last name</label>
            <input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-[#1A1A2E] outline-none focus:border-[#1A1A2E] focus:ring-1 focus:ring-[#1A1A2E]" />
          </div>
          {/* Email */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-500">Email address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm text-[#1A1A2E] outline-none focus:border-[#1A1A2E] focus:ring-1 focus:ring-[#1A1A2E]" />
            </div>
          </div>
          {/* Phone */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-500">Phone number</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm text-[#1A1A2E] outline-none focus:border-[#1A1A2E] focus:ring-1 focus:ring-[#1A1A2E]" />
            </div>
          </div>
          {/* Bio */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-500">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={3}
              className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#1A1A2E] outline-none focus:border-[#1A1A2E] focus:ring-1 focus:ring-[#1A1A2E]"
            />
            <p className="mt-1 text-xs text-gray-400">A short description visible to other admins</p>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button onClick={handleSave} className={cn("flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors", saved ? "bg-emerald-600" : "bg-[#1A1A2E] hover:bg-[#1A1A2E]/90")}>
            {saved ? <><Check className="h-4 w-4" /> Saved!</> : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Change Password section ───────────────────────────────────────────── */
function ChangePassword() {
  const [form, setForm] = useState({ current: "", newPass: "", confirm: "" });
  const [show, setShow] = useState({ current: false, newPass: false, confirm: false });

  const checks = {
    length: form.newPass.length >= 8,
    casing: /[a-z]/.test(form.newPass) && /[A-Z]/.test(form.newPass),
    number: /[0-9]/.test(form.newPass),
    special: /[^a-zA-Z0-9]/.test(form.newPass),
  };

  const allValid = Object.values(checks).every(Boolean) && form.newPass === form.confirm && form.current.length > 0;

  const PasswordInput = ({ field, placeholder }: { field: keyof typeof form; placeholder: string }) => (
    <div className="relative">
      <input
        type={show[field] ? "text" : "password"}
        value={form[field]}
        onChange={(e) => setForm({ ...form, [field]: e.target.value })}
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 pr-11 text-sm text-[#1A1A2E] outline-none placeholder:text-gray-300 focus:border-[#1A1A2E] focus:ring-1 focus:ring-[#1A1A2E]"
      />
      <button type="button" onClick={() => setShow((s) => ({ ...s, [field]: !s[field] }))} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
        {show[field] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );

  return (
    <div className="flex-1">
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <Lock className="h-5 w-5 text-gray-400" />
          <div>
            <h3 className="text-base font-semibold text-[#1A1A2E]">Change Password</h3>
            <p className="text-sm text-gray-400">Choose a strong password with at least 8 characters.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-500">Current password</label>
            <PasswordInput field="current" placeholder="Enter your current password" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-500">New password</label>
            <PasswordInput field="newPass" placeholder="Min 8 characters" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-500">Confirm new password</label>
            <PasswordInput field="confirm" placeholder="Re-enter new password" />
          </div>
        </div>

        {/* Requirements */}
        <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
          <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Password Requirements</p>
          <div className="space-y-1.5">
            {[
              { key: "length", label: "At least 8 characters" },
              { key: "casing", label: "Uppercase & lowercase letters" },
              { key: "number", label: "At least one number" },
              { key: "special", label: "At least one special character" },
            ].map((r) => (
              <div key={r.key} className="flex items-center gap-2">
                <div className={cn("flex h-4 w-4 shrink-0 items-center justify-center rounded-full", checks[r.key as keyof typeof checks] ? "bg-emerald-500 text-white" : "border border-gray-300")}>
                  {checks[r.key as keyof typeof checks] && <Check className="h-2.5 w-2.5" />}
                </div>
                <span className={cn("text-xs", checks[r.key as keyof typeof checks] ? "text-emerald-600" : "text-gray-400")}>{r.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-xs text-gray-400">
            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-gray-300 text-[9px]">i</span>
            You will be asked to log in again after changing your password.
          </p>
          <button disabled={!allValid} className={cn("flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors", allValid ? "bg-[#1A1A2E] hover:bg-[#1A1A2E]/90" : "bg-gray-200 text-gray-400 cursor-not-allowed")}>
            <Lock className="h-4 w-4" /> Update password
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */
export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("profile");

  const navItems = [
    { key: "profile" as ProfileTab, label: "Profile Info", icon: User },
    { key: "password" as ProfileTab, label: "Password", icon: Lock },
  ];

  const sectionLabel = activeTab === "profile" ? "ACCOUNT" : "PROFILE";

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#1A1A2E]">My Profile</h1>
        <p className="mt-0.5 text-sm text-gray-400">System / My Profile</p>
      </div>

      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        {/* Sidebar nav */}
        <div className="w-full rounded-xl border border-gray-100 bg-white p-3 shadow-sm sm:w-56 sm:shrink-0">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">{sectionLabel}</p>
          {navItems.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                activeTab === key ? "bg-gray-100 text-[#1A1A2E]" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "profile" ? <ProfileInfo /> : <ChangePassword />}
      </div>
    </div>
  );
}
