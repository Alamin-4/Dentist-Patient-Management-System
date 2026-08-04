"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSpecialties } from "@/core/hooks/admin/specialty/useSpecialty";
import { useUpdateAdminDentistData } from "@/core/hooks/admin/dentist/useDentist";
import { Loader2 } from "lucide-react";

interface EditAdminDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  dentistId: string;
  initialData?: {
    specialtyId?: string | null;
    yearsOfExperience?: number | null;
    registrationNumber?: string | null;
    registrationAuthority?: string | null;
  };
}

export function EditAdminDataModal({
  isOpen,
  onClose,
  dentistId,
  initialData,
}: EditAdminDataModalProps) {
  const { data: specialties = [] } = useSpecialties();
  const updateAdminData = useUpdateAdminDentistData(dentistId);

  const [specialtyId, setSpecialtyId] = useState<string>(initialData?.specialtyId || "");
  const [yearsOfExperience, setYearsOfExperience] = useState<string>(
    initialData?.yearsOfExperience !== undefined && initialData?.yearsOfExperience !== null
      ? String(initialData.yearsOfExperience)
      : ""
  );
  const [registrationNumber, setRegistrationNumber] = useState<string>(initialData?.registrationNumber || "");
  const [registrationAuthority, setRegistrationAuthority] = useState<string>(
    initialData?.registrationAuthority || ""
  );
  const [reason, setReason] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    if (initialData) {
      setSpecialtyId(initialData.specialtyId || "");
      setYearsOfExperience(
        initialData.yearsOfExperience !== undefined && initialData.yearsOfExperience !== null
          ? String(initialData.yearsOfExperience)
          : ""
      );
      setRegistrationNumber(initialData.registrationNumber || "");
      setRegistrationAuthority(initialData.registrationAuthority || "");
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setErrorMsg("A detailed reason is required for administrative audit logs.");
      return;
    }
    setErrorMsg("");

    try {
      await updateAdminData.mutateAsync({
        specialtyId: specialtyId || undefined,
        yearsOfExperience: yearsOfExperience !== "" ? Number(yearsOfExperience) : undefined,
        registrationNumber: registrationNumber.trim() || undefined,
        registrationAuthority: registrationAuthority.trim() || undefined,
        reason: reason.trim(),
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || err.message || "Failed to update admin data.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-900">
            Edit Administrative Profile
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {errorMsg && (
            <div className="rounded-lg bg-red-50 p-3 text-xs text-red-600 border border-red-200">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Primary Specialty
            </label>
            <select
              value={specialtyId}
              onChange={(e) => setSpecialtyId(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none"
            >
              <option value="">-- Select Specialty --</option>
              {specialties.map((s) => (
                <option key={String(s.id)} value={String(s.id)}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Years of Experience
            </label>
            <input
              type="number"
              min="0"
              max="70"
              value={yearsOfExperience}
              onChange={(e) => setYearsOfExperience(e.target.value)}
              placeholder="e.g. 10"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              License Registration Number
            </label>
            <input
              type="text"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              placeholder="e.g. DEN-98402"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Registration Authority
            </label>
            <input
              type="text"
              value={registrationAuthority}
              onChange={(e) => setRegistrationAuthority(e.target.value)}
              placeholder="e.g. General Dental Council"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Reason for Administrative Change <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide justification for audit logging..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none"
            />
          </div>

          <DialogFooter className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={updateAdminData.isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateAdminData.isPending} className="bg-accent text-white hover:bg-accent/90">
              {updateAdminData.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save Administrative Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
