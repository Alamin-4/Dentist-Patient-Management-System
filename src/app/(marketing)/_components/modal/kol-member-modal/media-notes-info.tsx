"use client";

import { ChangeEvent, useRef } from "react";
import { Globe, ImageUp, Link2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface MediaNotesInfoFormProps {
	fullName: string;
	photoFile: File | null;
	linkedinUrl: string;
	websiteUrl: string;
	internalNotes: string;
	onPhotoChange: (file: File | null) => void;
	onFieldChange: (field: "linkedinUrl" | "websiteUrl" | "internalNotes", value: string) => void;
}

const getInitials = (fullName: string) => {
	const initials = fullName
		.trim()
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase() ?? "")
		.join("");

	return initials || "PC";
};

export default function MediaNotesInfoForm({
	fullName,
	photoFile,
	linkedinUrl,
	websiteUrl,
	internalNotes,
	onPhotoChange,
	onFieldChange,
}: MediaNotesInfoFormProps) {
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0] ?? null;
		onPhotoChange(file);
	};

	return (
		<div className="space-y-6">
			<div className="space-y-3">
				<Label className="text-sm font-medium text-foreground">Headshot</Label>
				<div className="rounded-xl border border-border bg-background p-4 sm:p-5">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center">
						<div className="flex items-center gap-4">
							<div className="grid size-16 shrink-0 place-items-center rounded-full bg-sidebar text-lg font-semibold text-sidebar-primary-foreground sm:size-20">
								{getInitials(fullName)}
							</div>

							<div className="space-y-1">
								<p className="text-sm font-semibold text-foreground sm:text-base">
									{photoFile ? photoFile.name : "No photo uploaded yet"}
								</p>
								<p className="text-sm text-muted-foreground">
									JPG or PNG, max 2MB. Shown in the dentist directory.
								</p>
							</div>
						</div>

						<div className="flex flex-wrap gap-3 sm:ml-auto sm:justify-end">
							<input
								ref={fileInputRef}
								type="file"
								accept="image/*"
								className="sr-only"
								onChange={handleFileChange}
							/>

							<Button
								type="button"
								variant="outline"
								className="rounded-xl border-input"
								onClick={() => fileInputRef.current?.click()}
							>
								<ImageUp className="size-4" />
								{photoFile ? "Replace photo" : "Upload photo"}
							</Button>

							{photoFile && (
								<Button
									type="button"
									variant="ghost"
									className="rounded-xl text-muted-foreground hover:text-foreground"
									onClick={() => onPhotoChange(null)}
								>
									<X className="size-4" />
									Remove
								</Button>
							)}
						</div>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
				<div className="space-y-2">
					<Label className="text-sm font-medium text-foreground">
						LinkedIn URL
					</Label>
					<div className="relative">
						<Link2 className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							value={linkedinUrl}
							onChange={(event) => onFieldChange("linkedinUrl", event.target.value)}
							placeholder="https://linkedin.com/in/..."
							className="h-12 rounded-xl border-input pl-10 pr-4 text-base shadow-none focus-visible:ring-ring sm:h-14"
						/>
					</div>
				</div>

				<div className="space-y-2">
					<Label className="text-sm font-medium text-foreground">
						Website URL
					</Label>
					<div className="relative">
						<Globe className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							value={websiteUrl}
							onChange={(event) => onFieldChange("websiteUrl", event.target.value)}
							placeholder="https://drmendezclinic.es"
							className="h-12 rounded-xl border-input pl-10 pr-4 text-base shadow-none focus-visible:ring-ring sm:h-14"
						/>
					</div>
				</div>
			</div>

			<div className="space-y-2">
				<Label className="text-sm font-medium text-foreground">
					Internal notes
				</Label>
				<Textarea
					value={internalNotes}
					onChange={(event) => onFieldChange("internalNotes", event.target.value)}
					placeholder="Admin-only notes about this KOL - never visible to dentists."
					rows={5}
					className="min-h-32 rounded-xl border-input px-4 py-3 text-base shadow-none focus-visible:ring-ring md:text-base"
				/>
				<p className="text-sm text-muted-foreground">Only visible to platform admins.</p>
			</div>
		</div>
	);
}
