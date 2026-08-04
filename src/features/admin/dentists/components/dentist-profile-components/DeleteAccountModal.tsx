"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteDentistAccount } from "@/core/hooks/admin/dentist/useDentist";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  dentistId: string;
  dentistIdentifier: string; // slug or email
}

export function DeleteAccountModal({
  isOpen,
  onClose,
  dentistId,
  dentistIdentifier,
}: DeleteAccountModalProps) {
  const router = useRouter();
  const deleteAccount = useDeleteDentistAccount(dentistId);

  const [confirmInput, setConfirmInput] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmInput.trim() !== dentistIdentifier.trim()) {
      setErrorMsg(`Confirmation text must match exact identifier "${dentistIdentifier}".`);
      return;
    }
    if (!reason.trim()) {
      setErrorMsg("A mandatory reason is required for audit compliance.");
      return;
    }
    setErrorMsg("");

    try {
      await deleteAccount.mutateAsync({
        confirmSlug: confirmInput.trim(),
        reason: reason.trim(),
      });
      onClose();
      router.push("/admin/dentists");
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || err.message || "Failed to delete dentist account.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-red-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-red-600">
            <Trash2 className="h-5 w-5 text-red-600" /> Danger Zone: Soft-Delete Account
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {errorMsg && (
            <div className="rounded-lg bg-red-50 p-3 text-xs text-red-600 border border-red-200">
              {errorMsg}
            </div>
          )}

          <div className="rounded-lg bg-red-50 p-3 border border-red-200 text-xs text-red-700 flex gap-2.5 items-start">
            <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-0.5">Critical Administrative Action</p>
              <p>
                This action will mark the dentist account as <strong>DELETED</strong>, invalidate all active login sessions, and immediately remove public access.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              To confirm, type <span className="font-mono font-bold text-red-600">{dentistIdentifier}</span> below:
            </label>
            <input
              type="text"
              required
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              placeholder={dentistIdentifier}
              className="w-full rounded-lg border border-red-300 px-3 py-2 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Reason for Deletion <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="State the compliance or legal justification for account soft-deletion..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
            />
          </div>

          <DialogFooter className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={deleteAccount.isPending}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={deleteAccount.isPending || confirmInput.trim() !== dentistIdentifier.trim()}
              className="bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
            >
              {deleteAccount.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
                </>
              ) : (
                "Permanently Soft-Delete Account"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
