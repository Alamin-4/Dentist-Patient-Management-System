"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface RejectPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export function RejectPlanModal({
  isOpen,
  onClose,
  onConfirm,
}: RejectPlanModalProps) {
  const [reason, setReason] = useState<string>("");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-160 p-10 gap-8 border-none rounded-3xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl lg:text-3xl font-bold text-[#1A1A2E] text-left">
            Cancel Treatment Plan?
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <label className="text-xl font-semibold text-[#1A1A2E]">Reason</label>
          <Select onValueChange={setReason}>
            <SelectTrigger className="h-14! w-full rounded-2xl border-slate-200 text-lg text-slate-400 px-6 focus:ring-[#0F3659]">
              <SelectValue placeholder="Select a reason" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-100">
              <SelectItem className="h-14! px-6 w-full" value="financial">
                Financial reasons
              </SelectItem>
              <SelectItem className="h-14! px-6 w-full" value="scheduling">
                Scheduling conflict
              </SelectItem>
              <SelectItem className="h-14! px-6 w-full" value="other">
                Changed my mind
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Policy Warning Banner - Matches image_2e0816.png */}
        <div className="bg-[#FFF9EB] py-4 px-6 rounded-xl border border-[#FEF0C7]">
          <p className="text-[#7A2E0E] text-sm font-medium">
            A 10% cancellation fee ($107.50) will be deducted as per policy.
            You'll receive $967.50 within 5 business days.
          </p>
        </div>

        <div className="flex flex-row justify-start gap-4 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="h-14 px-10 rounded-xl border-slate-300 text-xl font-bold text-[#1A1A2E] hover:bg-slate-50"
          >
            Cancel
          </Button>
          <Button
            onClick={() => onConfirm(reason)}
            className="h-14 px-10 rounded-xl bg-[#0F3659] text-xl font-bold text-white hover:bg-[#0a2640] transition-colors"
          >
            Yes, Cancel treatment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
