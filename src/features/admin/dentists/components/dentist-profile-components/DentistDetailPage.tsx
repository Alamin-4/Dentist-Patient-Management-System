"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ArrowLeft, Mail, Phone, MapPin, Clock, CheckCircle2, Star,
    Pencil, ShieldOff, ShieldCheck, Trash2, AlertCircle, Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CustomTab } from "@/app/(admin-dashboard)/modules/shared/custom-tab";
import { DentistBookingsTab, DentistConsultationsTab, DentistReviewsTab } from "./dentist-bookings-tab";
import { useAdminDentist } from "@/core/hooks/admin/dentist/useDentist";
import { DentistDetailPageSkeleton } from "../../DentistDetailPageSkeleton";
import { DentistOverviewTab } from "./DentistOverviewTab";
import { EditAdminDataModal } from "./EditAdminDataModal";
import { SuspendAccountModal } from "./SuspendAccountModal";
import { DeleteAccountModal } from "./DeleteAccountModal";

type MainTab = "overview" | "bookings" | "consultations" | "reviews" | "patient_results";

interface DentistDetailPageProps { dentistId: string; }

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

function renderStepIcon(status: string) {
    const isApproved = ["APPROVED", "approved", "complete", "completed"].includes(status);
    const isSubmitted = ["SUBMITTED", "submitted", "in_review"].includes(status);
    const isRejected = ["REJECTED", "rejected"].includes(status);

    if (isApproved) {
        return (
            <div className="flex p-1 items-center justify-center rounded-full bg-emerald-500 text-white">
                <Check className="h-3 w-3 stroke-3" />
            </div>
        );
    }
    if (isSubmitted) {
        return (
            <div className="flex p-1 items-center justify-center rounded-full bg-accent text-white animate-pulse">
                <Clock className="h-3 w-3 stroke-3" />
            </div>
        );
    }
    if (isRejected) {
        return (
            <div className="flex p-1 items-center justify-center rounded-full bg-red-500 text-white">
                <AlertCircle className="h-3.5 w-3.5" />
            </div>
        );
    }

    return (
        <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-gray-200 bg-white">
            <div className="h-1.5 w-1.5 rounded-full bg-gray-300" />
        </div>
    );
}

export default function DentistDetailPage({ dentistId }: DentistDetailPageProps) {
    const [activeTab, setActiveTab] = useState<MainTab>("overview");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [localStatus, setLocalStatus] = useState<string | null>(null);

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

    const fullName = data?.dentist?.full_name || (data as any)?.user_profile?.name || "";
    const { initials, color } = getAvatarMeta(fullName);
    const rdvScore = data.dentist?.rdv_score ?? 0;
    const specialty = data.dentist?.specialty || "";
    const email = data.user_profile?.email || "N/A";
    const phone = data.user_profile?.phone || "N/A";
    const location = data.license_step
        ? [data.license_step.city, data.license_step.country].filter(Boolean).filter((x: string) => x !== "0").join(", ") || "N/A"
        : "N/A";

    const accountStatus = localStatus ?? (data.user_profile as any)?.status ?? "ACTIVE";
    const isAccountSuspended = accountStatus === "SUSPENDED";
    const queueStatus = data.queue_status ?? "not_started";
    const STATUS_BADGE: Record<string, string> = {
        approved: "bg-emerald-50 text-emerald-600",
        submitted: "bg-accent/5 text-accent",
        pending: "bg-gray-100 text-gray-500",
        rejected: "bg-red-50 text-red-500",
        not_started: "bg-gray-100 text-gray-500",
    };
    const STATUS_DOT: Record<string, string> = {
        approved: "bg-emerald-500",
        submitted: "bg-accent",
        pending: "bg-gray-400",
        rejected: "bg-red-500",
        not_started: "bg-gray-400",
    };
    const STATUS_LABEL: Record<string, string> = {
        approved: "Verified",
        submitted: "Pending Review",
        pending: "Pending Submission",
        rejected: "Rejected",
        not_started: "Not Started",
    };

    const tabs = [
        { key: "overview", label: "Overview" },
        { key: "bookings", label: "Bookings" },
        { key: "consultations", label: "Consultations" },
        { key: "reviews", label: "Reviews" },
        { key: "patient_results", label: "Patient Results" },
    ];

    const ph1Status = data.license_verification;
    const ph2Status = data.operations_verification;
    const ph3Status = data.clinical_verification;

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
                                {data?.has_user_account === false ? (
                                    <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
                                        Unclaimed Directory Profile
                                    </span>
                                ) : (
                                    isAccountSuspended && (
                                        <span className="flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700 border border-red-200">
                                            <ShieldOff className="h-3 w-3" /> Suspended
                                        </span>
                                    )
                                )}
                                <span className="rounded-full border border-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-500">{specialty}</span>
                            </div>
                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-gray-500">
                                <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 shrink-0" />{email}</span>
                                <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 shrink-0" />{phone}</span>
                                {location && location !== "N/A" && (
                                    <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 shrink-0" />{location}</span>
                                )}
                                <span className="flex items-center gap-1.5">
                                    <Clock className="h-3.5 w-3.5 shrink-0" />
                                    Member since {data.created_at ? new Date(data.created_at).toLocaleDateString() : "0"}
                                </span>
                            </div>
                        </div>
                    </div>

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

                <div className="hidden w-72 shrink-0 flex-col gap-4 lg:flex">
                    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                        <h3 className="mb-6 font-bold text-gray-900 text-sm tracking-wide">Verification Progress</h3>

                        <div className="space-y-8 relative">
                            <div className="absolute left-2.25 top-2.5 bottom-2.5 w-0.5 bg-gray-100" />

                            {[
                                {
                                    title: "Phase 1 — Identity",
                                    sub: "~5 min · RDV +30%",
                                    status: ph1Status,
                                },
                                {
                                    title: "Phase 2 — Operations",
                                    sub: "~20-30 min · RDV +40%",
                                    status: ph2Status,
                                },
                                {
                                    title: "Phase 3 — Clinical depth",
                                    sub: "Async · RDV +30%",
                                    status: ph3Status,
                                },
                            ].map((step, i) => {
                                return (
                                    <div key={i} className="relative flex gap-4 pl-8">
                                        <div className="absolute left-0 top-0.5 z-10 flex items-center justify-center rounded-full bg-white">
                                            {renderStepIcon(step.status)}
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-sm font-semibold text-gray-800">
                                                {step.title}
                                            </p>
                                            <p className="text-xs text-gray-400 font-medium">
                                                {step.sub}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                    </div>

                    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                        <p className="mb-3 text-sm font-bold text-text">Admin Actions</p>
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 cursor-pointer"
                            >
                                <Pencil className="h-4 w-4 text-gray-400" /> Edit profile
                            </button>
                            <button
                                disabled={data?.has_user_account === false}
                                onClick={() => setIsSuspendModalOpen(true)}
                                title={data?.has_user_account === false ? "Unclaimed directory profiles without a user account cannot be suspended." : undefined}
                                className={`flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium transition-colors ${data?.has_user_account === false
                                    ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                                    : isAccountSuspended
                                        ? "bg-white text-emerald-600 hover:bg-emerald-50 cursor-pointer"
                                        : "bg-white text-amber-600 hover:bg-amber-50 cursor-pointer"
                                    }`}
                            >
                                {isAccountSuspended
                                    ? <><ShieldCheck className="h-4 w-4" /> Unsuspend account</>
                                    : <><ShieldOff className="h-4 w-4" /> Suspend account</>}
                            </button>
                            <button
                                onClick={() => setIsDeleteModalOpen(true)}
                                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 cursor-pointer"
                            >
                                <Trash2 className="h-4 w-4" /> Delete account
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <EditAdminDataModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                dentistId={dentistId}
                initialData={{
                    specialtyId: data.dentist?.specialtyId,
                    yearsOfExperience: data.dentist?.yearsOfExperience,
                    registrationNumber: data.license_step?.registration_no,
                    registrationAuthority: data.license_step?.registration_authority_name,
                }}
            />

            <SuspendAccountModal
                isOpen={isSuspendModalOpen}
                onClose={() => setIsSuspendModalOpen(false)}
                dentistId={dentistId}
                currentStatus={accountStatus}
                onSuccess={(newStatus) => setLocalStatus(newStatus)}
            />

            <DeleteAccountModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                dentistId={dentistId}
                dentistIdentifier={data.dentist?.slug || data.user_profile?.email || dentistId}
            />
        </div>
    );
}