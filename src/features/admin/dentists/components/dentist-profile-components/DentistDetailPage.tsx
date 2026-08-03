"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ArrowLeft, Mail, Phone, MapPin, Clock, CheckCircle2, Star,
    Pencil, ShieldOff, Trash2, AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CustomTab } from "@/app/(admin-dashboard)/modules/shared/custom-tab";
import { DentistBookingsTab, DentistConsultationsTab, DentistReviewsTab } from "./dentist-bookings-tab";
import { useAdminDentist } from "@/hooks/admin/dentist/useDentist";
import { DentistDetailPageSkeleton } from "../../DentistDetailPageSkeleton";
import { DentistOverviewTab } from "./DentistOverviewTab";

type MainTab = "overview" | "bookings" | "consultations" | "reviews" | "patient_results";

interface DentistDetailPageProps { dentistId: string; }

// Derive initials + deterministic avatar colour from a name string
function getAvatarMeta(name: string): { initials: string; color: string } {
    const COLORS = ["#1A3A5C", "#1E40AF", "#0F172A", "#7C3AED", "#0891B2", "#0D9488", "#4F46E5"];
    const initials = name
        .split(" ")
        .map((n) => n[0] ?? "")
        .join("")
        .toUpperCase()
        .slice(0, 2) || "D";
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return { initials, color: COLORS[Math.abs(hash) % COLORS.length] };
}

function VerificationStatus({ label, status, short }: { label: string; status: string; short: string }) {
    const done = ["APPROVED", "approved", "complete", "completed"].includes(status);
    const isRejected = ["REJECTED", "rejected"].includes(status);
    const isPending = ["SUBMITTED", "submitted", "PENDING", "pending", "in_review", "SUBMIT", "submit"].includes(status);

    let textColor = "text-gray-400";
    let textLabel = "Not started";

    if (done) {
        textColor = "text-emerald-600";
        textLabel = "Complete";
    } else if (isRejected) {
        textColor = "text-red-600 bg-red-50 px-2 py-0.5 rounded";
        textLabel = "Rejected";
    } else if (isPending) {
        textColor = "text-accent";
        textLabel = "Pending";
    }

    return (
        <div className="flex items-center justify-between py-1.5">
            <div className="flex items-center gap-2">
                <span className="flex h-6 w-8 items-center justify-center rounded-md bg-gray-100 text-xs font-bold text-gray-500">{short}</span>
                <span className="text-sm text-gray-600">{label}</span>
            </div>
            <span className={cn("text-xs font-semibold", textColor)}>
                {textLabel}
            </span>
        </div>
    );
}

export default function DentistDetailPage({ dentistId }: DentistDetailPageProps) {
    const [activeTab, setActiveTab] = useState<MainTab>("overview");

    // Single API call — returns flat { dentist, user_profile, license_step, operation_step, clinical_step }
    const { dentist: data, isLoading, isError } = useAdminDentist(dentistId);

    if (isLoading) return <DentistDetailPageSkeleton />;
    if (isError || !data) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <AlertCircle className="mb-3 h-10 w-10 text-red-400" />
                <p className="text-lg font-semibold text-red-500">Dentist not found or failed to load</p>
                <Link href="/admin/dentists" className="mt-4 text-sm text-blue-600 underline underline-offset-2">
                    Back to dentists
                </Link>
            </div>
        );
    }

    // --- Derive display values from the flat API shape ---
    const fullName = data.dentist?.name || "";
    const { initials, color } = getAvatarMeta(fullName);
    const rdvScore = data.dentist?.rdv_score ?? 0;
    const specialty = data.dentist?.specialty || "";
    const email = data.user_profile?.email || "0";
    const phone = data.user_profile?.phone || "0";
    const location = data.license_step
        ? [data.license_step.city, data.license_step.country].filter(Boolean).join(", ")
        : "0";

    // Queue / overall status badge
    const queueStatus = data.queue_status ?? "pending";
    const STATUS_BADGE: Record<string, string> = {
        approved: "bg-emerald-50 text-emerald-600",
        pending: "bg-accent/5 text-accent",
        rejected: "bg-red-50 text-red-500",
    };
    const STATUS_DOT: Record<string, string> = {
        approved: "bg-emerald-500",
        pending: "bg-accent",
        rejected: "bg-red-500",
    };
    const STATUS_LABEL: Record<string, string> = {
        approved: "Verified",
        pending: "Pending Review",
        rejected: "Rejected",
    };

    const tabs = [
        { key: "overview", label: "Overview" },
        { key: "bookings", label: "Bookings" },
        { key: "consultations", label: "Consultations" },
        { key: "reviews", label: "Reviews" },
        { key: "patient_results", label: "Patient Results" },
    ];

    // Verification sidebar statuses from flat fields
    const ph1Status = data.license_verification ?? "PENDING";
    const ph2Status = data.operations_verification ?? "PENDING";
    const ph3Status = data.clinical_verification ?? "PENDING";

    return (
        <div className="flex flex-col gap-5">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <Link href="/admin/dentists" className="flex items-center gap-1.5 font-medium text-gray-500 transition-colors hover:text-text">
                    <ArrowLeft className="h-4 w-4" /> Dentists
                </Link>
                <span>/</span>
                <span className="font-medium text-text">{fullName}</span>
            </div>

            {/* Profile header */}
            <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-4">
                        <div
                            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white sm:h-16 sm:w-16"
                            style={{ backgroundColor: color }}
                        >
                            {initials}
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-xl font-bold text-text sm:text-2xl">{fullName}</h2>
                                {rdvScore > 0 && (
                                    <span className="flex items-center gap-1 rounded-full bg-text px-2.5 py-0.5 text-xs font-bold text-white">
                                        <CheckCircle2 className="h-3 w-3" /> RDV · {rdvScore}
                                    </span>
                                )}
                                <span className={cn("flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold", STATUS_BADGE[queueStatus] ?? "bg-gray-100 text-gray-500")}>
                                    <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_DOT[queueStatus] ?? "bg-gray-400")} />
                                    {STATUS_LABEL[queueStatus] ?? queueStatus}
                                </span>
                                <span className="rounded-full border border-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-500">{specialty}</span>
                            </div>
                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-gray-500">
                                <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 shrink-0" />{email}</span>
                                <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 shrink-0" />{phone}</span>
                                {location !== "0" && (
                                    <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 shrink-0" />{location}</span>
                                )}
                                <span className="flex items-center gap-1.5">
                                    <Clock className="h-3.5 w-3.5 shrink-0" />
                                    Member since {data.created_at ? new Date(data.created_at).toLocaleDateString() : "0"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* RDV Score badge on the right */}
                    {rdvScore > 0 && (
                        <div className="shrink-0 text-right">
                            <div className="flex items-center justify-end gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} className={`h-4 w-4 ${i < Math.round(rdvScore / 20) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`} />
                                ))}
                                <span className="ml-1 text-xl font-bold text-text">{rdvScore}</span>
                            </div>
                            <p className="mt-0.5 text-xs text-gray-400">RDV Score</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Main content */}
            <div className="flex gap-5">
                <div className="min-w-0 flex-1">
                    <div className="rounded-t-xl overflow-x-auto border-b border-gray-100 bg-white px-4 pt-1 shadow-sm *:whitespace-nowrap">
                        <CustomTab tabs={tabs} active={activeTab} onChange={(k) => setActiveTab(k as MainTab)} />
                    </div>
                    <div className="mt-4">
                        {activeTab === "overview" && (
                            <DentistOverviewTab apiData={data} />
                        )}
                        {activeTab === "bookings" && <DentistBookingsTab bookings={[]} />}
                        {activeTab === "consultations" && <DentistConsultationsTab consultations={[]} />}
                        {activeTab === "reviews" && <DentistReviewsTab reviews={[]} totalReviews={0} />}
                        {activeTab === "patient_results" && (
                            <div className="rounded-lg border border-gray-100 bg-white p-8 text-center text-sm text-gray-400 shadow-sm">No patient results yet</div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="hidden w-64 shrink-0 flex-col gap-4 lg:flex">
                    <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
                        <p className="mb-3 text-sm font-bold text-text">Verification Status</p>
                        <div className="divide-y divide-gray-50">
                            <VerificationStatus label="Phase 1 — Identity" status={ph1Status} short="Ph.1" />
                            <VerificationStatus label="Phase 2 — Operations" status={ph2Status} short="Ph.2" />
                            <VerificationStatus label="Phase 3 — Clinical" status={ph3Status} short="Ph.3" />
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
                        <p className="mb-3 text-sm font-bold text-text">Admin Actions</p>
                        <div className="flex flex-col gap-2">
                            <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                                <Pencil className="h-4 w-4 text-gray-400" /> Edit profile
                            </button>
                            <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-accent transition-colors hover:bg-accent/5">
                                <ShieldOff className="h-4 w-4" /> Suspend account
                            </button>
                            <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50">
                                <Trash2 className="h-4 w-4" /> Delete account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}