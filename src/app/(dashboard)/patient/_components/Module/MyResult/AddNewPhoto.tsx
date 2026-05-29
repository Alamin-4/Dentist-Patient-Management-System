"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

interface AddPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddPhotoModal({ isOpen, onClose }: AddPhotoModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden border-none rounded-3xl gap-0">
        {/* Custom Header with X */}
        <div className="flex items-center justify-between p-6 border-b">
          <DialogTitle className="text-3xl font-bold text-[#1A1A2E]">
            Add New Photo
          </DialogTitle>
        </div>

        <div className="p-8 space-y-8">
          <div className="space-y-4">
            <p className="text-xl font-semibold text-[#1A1A2E]">Photos</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Before Upload */}
              <label className="cursor-pointer border-2 border-dashed border-slate-200 rounded-xl h-48 flex flex-col items-center justify-center gap-3 bg-[#F8FAFC]/30 hover:bg-slate-50 transition-colors">
                <Upload className="size-7 text-slate-400" />
                <span className="text-lg font-semibold text-[#1A1A2E]">
                  Upload Before Image
                </span>
                <input type="file" className="hidden" accept="image/*" />
              </label>

              {/* After Upload */}
              <label className="cursor-pointer border-2 border-dashed border-slate-200 rounded-xl h-48 flex flex-col items-center justify-center gap-3 bg-[#F8FAFC]/30 hover:bg-slate-50 transition-colors">
                <Upload className="size-7 text-slate-400" />
                <span className="text-lg font-semibold text-[#1A1A2E]">
                  Upload After Image
                </span>
                <input type="file" className="hidden" accept="image/*" />
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xl font-semibold text-[#1A1A2E]">
              Select Treatment
            </p>
            <Select>
              <SelectTrigger className="h-16 rounded-xl border-slate-200 px-6 text-lg text-slate-400 focus:ring-[#0F3659]">
                <SelectValue placeholder="Type here" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="invisalign">Invisalign Treatment</SelectItem>
                <SelectItem value="veneers">Dental Veneers</SelectItem>
                <SelectItem value="whitening">Teeth Whitening</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Footer Actions - Matches image_2df812.png */}
        <div className="p-8 pt-0 flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 h-16 rounded-xl border-slate-300 text-xl font-bold text-[#1A1A2E] hover:bg-slate-50"
          >
            Cancel
          </Button>
          <Button className="flex-1 h-16 rounded-xl bg-[#0F3659] text-xl font-bold text-white hover:bg-[#0a2640]">
            Add Photo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
