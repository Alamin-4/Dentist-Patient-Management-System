"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BioLanguageData {
	bio: string;
	languages: string;
}

interface BioLanguageInfoFormProps {
	data: BioLanguageData;
	onChange: (field: keyof BioLanguageData, value: string) => void;
}

export default function BioLanguageInfoForm({
	data,
	onChange,
}: BioLanguageInfoFormProps) {
	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<Label className="text-sm font-medium text-foreground">
					Bio <span className="text-destructive">*</span>
				</Label>
				<Textarea
					value={data.bio}
					onChange={(event) => onChange("bio", event.target.value)}
					placeholder="Prof. Mendez leads the implantology department at the University of Barcelona and has placed over 8,000 implants in his career."
					rows={7}
					className="min-h-40 rounded-lg border-input px-4 py-3 text-base shadow-none focus-visible:ring-ring md:text-base"
				/>
				<p className="text-sm text-muted-foreground">
					Shown on the KOL&apos;s card in the dentist directory.
				</p>
			</div>

			<div className="space-y-2">
				<Label className="text-sm font-medium text-foreground">
					Languages spoken <span className="text-destructive">*</span>
				</Label>
				<Input
					value={data.languages}
					onChange={(event) => onChange("languages", event.target.value)}
					placeholder="Spanish, English, Portuguese"
					className="h-12 rounded-lg border-input px-4 text-base shadow-none focus-visible:ring-ring sm:h-14"
				/>
				<p className="text-sm text-muted-foreground">Separate with commas.</p>
			</div>
		</div>
	);
}
