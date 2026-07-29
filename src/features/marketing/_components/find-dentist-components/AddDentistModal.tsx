"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAddDentistToDirectory } from "@/hooks/dentist/useDentistDirectory";

interface AddDentistModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const INITIAL_FORM = {
    fullName: "",
    clinicName: "",
    city: "",
    country: "",
    specialty: "",
    phone: "",
};

export default function AddDentistModal({ open, onOpenChange }: AddDentistModalProps) {
    const router = useRouter();
    const addDentistMutation = useAddDentistToDirectory();
    const [form, setForm] = useState(INITIAL_FORM);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.fullName.trim()) {
            toast.error("Dentist full name is required.");
            return;
        }

        const toastId = toast.loading("Adding dentist to directory...");

        addDentistMutation.mutate(form, {
            onSuccess: (res: any) => {
                const slug = res?.data?.slug;
                if (slug) {
                    toast.success(res.message || "Dentist profile ready for claim!", { id: toastId });
                    onOpenChange(false);
                    setForm(INITIAL_FORM);
                    router.push(`/find-dentists/${slug}/claim`);
                } else {
                    toast.error("Failed to process dentist profile. Please try again.", { id: toastId });
                }
            },
            onError: (err: any) => {
                const errMsg = err?.response?.data?.message || err?.message || "Failed to add dentist profile.";
                toast.error(errMsg, { id: toastId });
                console.error("Add dentist error:", err);
            },
        });
    };

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) setForm(INITIAL_FORM); // Reset form on close
        onOpenChange(isOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md bg-white border border-slate-200 shadow-xl rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-primary font-bold text-xl">Add a Dentist Profile</DialogTitle>
                    <DialogDescription className="text-slate-500">
                        Enter details to add a dentist who isn't already in the RatedDocs database directory, then proceed to claim it.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="fullName" className="font-semibold text-slate-700 text-sm">Full Name *</Label>
                        <Input
                            id="fullName"
                            value={form.fullName}
                            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                            placeholder="Dr. John Smith"
                            required
                            className="border-slate-200 focus:border-primary h-10 text-sm"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="clinicName" className="font-semibold text-slate-700 text-sm">Clinic Name</Label>
                            <Input
                                id="clinicName"
                                value={form.clinicName}
                                onChange={(e) => setForm({ ...form, clinicName: e.target.value })}
                                placeholder="Bright Smile Clinic"
                                className="border-slate-200 focus:border-primary h-10 text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="specialty" className="font-semibold text-slate-700 text-sm">Specialty</Label>
                            <Input
                                id="specialty"
                                value={form.specialty}
                                onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                                placeholder="Implantology"
                                className="border-slate-200 focus:border-primary h-10 text-sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="city" className="font-semibold text-slate-700 text-sm">City</Label>
                            <Input
                                id="city"
                                value={form.city}
                                onChange={(e) => setForm({ ...form, city: e.target.value })}
                                placeholder="Tijuana"
                                className="border-slate-200 focus:border-primary h-10 text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="country" className="font-semibold text-slate-700 text-sm">Country</Label>
                            <Input
                                id="country"
                                value={form.country}
                                onChange={(e) => setForm({ ...form, country: e.target.value })}
                                placeholder="Mexico"
                                className="border-slate-200 focus:border-primary h-10 text-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone" className="font-semibold text-slate-700 text-sm">Phone Number</Label>
                        <Input
                            id="phone"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            placeholder="+1 234 567 890"
                            className="border-slate-200 focus:border-primary h-10 text-sm"
                        />
                    </div>

                    <DialogFooter className="pt-4 border-t border-slate-100 mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                            className="border-slate-200 text-slate-600 hover:bg-slate-50 h-10 text-sm"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={addDentistMutation.isPending}
                            className="bg-primary hover:bg-[#002850] text-white font-bold h-10 text-sm px-6"
                        >
                            {addDentistMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                "Add & Claim Profile"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}