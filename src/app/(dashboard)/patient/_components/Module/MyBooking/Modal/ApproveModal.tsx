import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmReleaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  doctorName: string;
}

export function ConfirmReleaseModal({
  isOpen,
  onClose,
  onConfirm,
  doctorName,
}: ConfirmReleaseModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl w-full rounded-xl p-8 gap-6 border-none">
        <DialogHeader className="gap-3">
          <DialogTitle className="text-2xl lg:text-3xl font-bold text-[#1A1A2E] text-left">
            Confirm & Release Payment
          </DialogTitle>
          <DialogDescription className="text-slate-500 leading-relaxed text-left">
            You are about to release your payment to {doctorName} and begin
            treatment.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-row justify-start gap-4 sm:justify-start pt-2">
          <button
            onClick={onClose}
            className="mt-0 h-auto px-8 py-3 rounded-xl border border-slate-300 text-[#1A1A2E] text-base font-bold hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="h-auto px-8 py-3 rounded-xl bg-[#0F3659] text-white text-base font-bold hover:bg-[#0a2640] transition-colors"
          >
            Yes, Confirm
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
