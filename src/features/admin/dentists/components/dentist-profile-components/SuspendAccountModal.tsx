"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUpdateDentistStatus } from "@/core/hooks/admin/dentist/useDentist";
import { ShieldOff, ShieldCheck, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";

interface SuspendAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  dentistId: string;
  currentStatus: string;
  onSuccess?: (newStatus: "SUSPENDED" | "ACTIVE") => void;
}

export function SuspendAccountModal({
  isOpen,
  onClose,
  dentistId,
  currentStatus,
  onSuccess,
}: SuspendAccountModalProps) {
  const updateStatus = useUpdateDentistStatus(dentistId);
  const isCurrentlySuspended = currentStatus === "SUSPENDED";

  const [reason, setReason] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setErrorMsg("A detailed reason is required for account status changes.");
      return;
    }
    setErrorMsg("");

    const newStatus = isCurrentlySuspended ? "ACTIVE" : "SUSPENDED";

    try {
      await updateStatus.mutateAsync({ status: newStatus, reason: reason.trim() });
      setSuccessMsg(
        newStatus === "SUSPENDED"
          ? "Account suspended successfully. All sessions have been revoked."
          : "Account unsuspended successfully. The dentist can now log in."
      );
      onSuccess?.(newStatus);
      // Close after a short delay to let user read the message
      setTimeout(() => {
        setSuccessMsg("");
        setReason("");
        onClose();
      }, 1800);
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || err.message || "Failed to update account status.");
    }
  };

  const handleClose = () => {
    setReason("");
    setErrorMsg("");
    setSuccessMsg("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
            {isCurrentlySuspended ? (
              <>
                <ShieldCheck className="h-5 w-5 text-emerald-600" /> Unsuspend Dentist Account
              </>
            ) : (
              <>
                <ShieldOff className="h-5 w-5 text-amber-600" /> Suspend Dentist Account
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Success state */}
          {successMsg && (
            <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700 border border-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              {successMsg}
            </div>
          )}

          {/* Error state */}
          {errorMsg && !successMsg && (
            <div className="rounded-lg bg-red-50 p-3 text-xs text-red-600 border border-red-200">
              {errorMsg}
            </div>
          )}

          {!successMsg && (
            <>
              <div className="rounded-lg bg-amber-50 p-3 border border-amber-200 text-xs text-amber-800 flex gap-2.5 items-start">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  {isCurrentlySuspended ? (
                    <p>
                      Unsuspending this account will restore dashboard access and public profile visibility in the directory.
                    </p>
                  ) : (
                    <p>
                      Suspending this account will <strong>immediately revoke all active sessions</strong> and hide this profile from the public directory.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Reason for {isCurrentlySuspended ? "Unsuspension" : "Suspension"} <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="State the compliance or administrative reason..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                />
              </div>

              <DialogFooter className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={handleClose} disabled={updateStatus.isPending}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateStatus.isPending}
                  className={
                    isCurrentlySuspended
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "bg-amber-600 text-white hover:bg-amber-700"
                  }
                >
                  {updateStatus.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                    </>
                  ) : isCurrentlySuspended ? (
                    "Confirm Unsuspension"
                  ) : (
                    "Confirm Suspension"
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
