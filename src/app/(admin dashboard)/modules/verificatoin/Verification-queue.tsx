"use client";

import { useCallback, useMemo, useState } from "react";
import { BarChart2, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { CustomTab } from "@/app/(admin dashboard)/modules/shared/custom-tab";
import { VerificationCard } from "./components/verification-card";
import { CustomDrawer } from "./components/custom-drawer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { QueueStatus, VerificationDentist, PhaseKey } from "./types";
import {
  API_STATUS_BY_QUEUE_STATUS,
  normalizeLicenseQueue,
  normalizeVerificationDentist,
  PAGE_SIZE,
} from "./verification-utils";
import useVerifications, {
  useDentistVerificationPhases,
  useVerifyPhase,
} from "@/hooks/admin/verifications/useVerifications";
import { apiClient } from "@/api/client";

const STAT_CARDS = [
  {
    icon: <BarChart2 className="h-6 w-6 text-blue-500" />,
    iconBg: "bg-blue-50",
    label: "Total verifications",
    key: "total_verifications" as const,
    sub: "In verification pipeline",
  },
  {
    icon: <Clock className="h-6 w-6 text-amber-500" />,
    iconBg: "bg-amber-50",
    label: "Pending review",
    key: "pending_review" as const,
    sub: "Ph.2 & Ph.3 submissions",
  },
  {
    icon: <CheckCircle2 className="h-6 w-6 text-emerald-500" />,
    iconBg: "bg-emerald-50",
    label: "Fully approved",
    key: "fully_approved" as const,
    sub: "All 3 phases complete",
  },
  {
    icon: <XCircle className="h-6 w-6 text-red-500" />,
    iconBg: "bg-red-50",
    label: "Rejected",
    key: "rejected" as const,
    sub: "Awaiting resubmission",
  },
];

const FOOTER_MESSAGES: Record<QueueStatus, (count: number) => string> = {
  pending: (n) => `${n} submission${n !== 1 ? "s" : ""} awaiting review`,
  approved: (n) => `${n} dentist${n !== 1 ? "s" : ""} fully approved`,
  rejected: (n) => `${n} dentist${n !== 1 ? "s" : ""} awaiting resubmission`,
};

export default function VerificationQueue() {
  const [activeTab, setActiveTab] = useState<QueueStatus>("pending");
  const [page, setPage] = useState(1);
  const [activeDentistId, setActiveDentistId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectDentistId, setRejectDentistId] = useState<string | null>(null);
  const [rejectPhase, setRejectPhase] = useState<PhaseKey | null>(null);
  const [rejectNote, setRejectNote] = useState("");

  const licenseQueueParams = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      status: API_STATUS_BY_QUEUE_STATUS[activeTab],
    }),
    [activeTab, page],
  );

  const { verificationslist, isVerificationslistLoading, isVerificationslistError } =
    useVerifications(licenseQueueParams);

  const { data: activeDentistPhasesData, isFetching: isActiveDentistFetching } =
    useDentistVerificationPhases(activeDentistId);

  const selectedDentist = useMemo(() => {
    if (!activeDentistPhasesData) return null;
    return normalizeVerificationDentist(activeDentistPhasesData);
  }, [activeDentistPhasesData]);

  const verifyMutation = useVerifyPhase();

  const actionLoading = verifyMutation.isPending;
  const drawerLoading = isActiveDentistFetching;

  const { meta, mappedLicenses, pagination } = useMemo(
    () => normalizeLicenseQueue(verificationslist.data),
    [verificationslist.data],
  );

  const filtered = useMemo(
    () =>
      mappedLicenses.filter((dentist) => dentist.queue_status === activeTab),
    [mappedLicenses, activeTab],
  );

  const tabs = [
    { key: "pending", label: "Pending", count: meta.pending_review },
    { key: "approved", label: "Approved", count: meta.fully_approved },
    { key: "rejected", label: "Rejected", count: meta.rejected },
  ];

  const activeTotal =
    activeTab === "pending"
      ? meta.pending_review
      : activeTab === "approved"
        ? meta.fully_approved
        : meta.rejected;

  const handleTabChange = useCallback((key: string) => {
    setActiveTab(key as QueueStatus);
    setPage(1);
  }, []);

  const handleViewSubmission = useCallback((dentist: VerificationDentist) => {
    setActiveDentistId(dentist.id);
    setDrawerOpen(true);
  }, []);

  const handleApprove = async (dentistId: string, phase: PhaseKey) => {
    try {
      await verifyMutation.mutateAsync({
        dentistId,
        phase,
        isApproved: true,
        note: "Approved by Admin",
      });
      setDrawerOpen(false);
      setActiveDentistId(null);
    } catch (e: any) {
      alert(e.message || "Failed to approve verification phase");
    }
  };

  const handleReject = useCallback((dentistId: string, phase: PhaseKey) => {
    setRejectDentistId(dentistId);
    setRejectPhase(phase);
    setRejectNote("");
    setRejectModalOpen(true);
  }, []);

  const submitReject = async () => {
    if (!rejectDentistId || !rejectPhase) return;
    if (rejectNote.trim() === "") {
      alert("Rejection reason is required.");
      return;
    }

    setRejectModalOpen(false);
    try {
      await verifyMutation.mutateAsync({
        dentistId: rejectDentistId,
        phase: rejectPhase,
        isApproved: false,
        note: rejectNote,
      });
      setDrawerOpen(false);
      setActiveDentistId(null);
    } catch (e: any) {
      alert(e.message || "Failed to reject verification phase");
    }
  };

  if (isVerificationslistLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#163E5C]" />
      </div>
    );
  }

  if (isVerificationslistError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-red-500">
        Failed to load verification queue. Please try again.
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1A1A2E]">
            Verification Queue
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Review dentist credentials across 3 phases before they go live.
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {STAT_CARDS.map((card) => (
            <div
              key={card.key}
              className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5"
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-full ${card.iconBg}`}
              >
                {card.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="mt-0.5 text-3xl font-bold tracking-tight text-[#1A1A2E]">
                  {meta[card.key]}
                </p>
                <p className="mt-0.5 text-xs text-gray-400">{card.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs + list */}
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-4 pt-1">
            <CustomTab
              tabs={tabs}
              active={activeTab}
              onChange={handleTabChange}
            />
          </div>

          <div className="space-y-3 p-4">
            {filtered.length === 0 && (
              <div className="py-12 text-center text-sm text-gray-400">
                No dentists in this category
              </div>
            )}
            {filtered.map((dentist) => (
              <VerificationCard
                key={dentist.id}
                dentist={dentist}
                onViewSubmission={handleViewSubmission}
              />
            ))}
          </div>

          {(filtered.length > 0 || pagination.totalPages > 1) && (
            <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-400">
                {FOOTER_MESSAGES[activeTab](activeTotal || filtered.length)}
              </p>
              {pagination.totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={page <= 1 || verificationslist.isFetching}
                    onClick={() => setPage((value) => Math.max(1, value - 1))}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-xs text-gray-400">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={
                      page >= pagination.totalPages ||
                      verificationslist.isFetching
                    }
                    onClick={() =>
                      setPage((value) =>
                        Math.min(pagination.totalPages, value + 1),
                      )
                    }
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Loading Overlay */}
      {(actionLoading || drawerLoading) && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
          <div className="rounded-lg bg-white p-4 shadow-lg flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-[#163E5C]" />
            <span className="text-sm font-semibold text-gray-700">Processing...</span>
          </div>
        </div>
      )}

      {/* Drawer */}
      <CustomDrawer
        dentist={selectedDentist}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setActiveDentistId(null);
        }}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      {/* Rejection Modal */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#1A1A2E]">
              Reject Verification Phase
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Please provide a clear reason for rejecting this verification step. The dentist will see this feedback to submit corrections.
            </DialogDescription>
          </DialogHeader>
          <div className="my-2">
            <label htmlFor="reject-reason" className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
              Rejection Reason *
            </label>
            <textarea
              id="reject-reason"
              rows={4}
              className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-[#163E5C] focus:ring-1 focus:ring-[#163E5C] outline-none resize-none transition-colors"
              placeholder="e.g. The headshot photo does not match the government ID image, please upload a clearer photo."
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
            />
          </div>
          <DialogFooter className="flex sm:justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => setRejectModalOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={rejectNote.trim() === ""}
              onClick={submitReject}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Rejection
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
