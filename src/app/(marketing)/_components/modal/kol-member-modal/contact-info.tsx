"use client";

import { Mail, Phone, FileText, Circle, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type ContactMethod = "email" | "whatsapp" | "platform" | "";

interface ContactData {
	contactMethod: ContactMethod;
	email: string;
	whatsapp: string;
}

interface ContactInfoFormProps {
	data: ContactData;
	onMethodChange: (method: ContactMethod) => void;
	onFieldChange: <T extends keyof ContactData>(field: T, value: ContactData[T]) => void;
}

interface ContactOption {
	id: Exclude<ContactMethod, "">;
	title: string;
	description: string;
	icon: React.ComponentType<{ className?: string }>;
	placeholder: string;
}

const options: ContactOption[] = [
	{
		id: "email",
		title: "Email address",
		description: "Collect direct email inquiries from dentists.",
		icon: Mail,
		placeholder: "dr.mendez@clinic.com",
	},
	{
		id: "whatsapp",
		title: "WhatsApp number",
		description: "Let dentists reach the KOL through a phone number.",
		icon: Phone,
		placeholder: "+34 600 000 000",
	},
	{
		id: "platform",
		title: "Contact form (platform hosted)",
		description: "Route requests through the built-in intake form.",
		icon: FileText,
		placeholder: "",
	},
];

export default function ContactInfoForm({
	data,
	onMethodChange,
	onFieldChange,
}: ContactInfoFormProps) {
	return (
		<div className="space-y-5">
			<p className="text-sm leading-6 text-muted-foreground sm:text-base">
				Choose how dentists will contact this KOL. The input field appears inside the selected option.
			</p>

			<div className="space-y-4">
				{options.map((option) => {
					const isSelected = data.contactMethod === option.id;
					const Icon = option.icon;

					return (
						<div
							key={option.id}
							className={cn(
								"rounded-xl border bg-background transition-all",
								isSelected
									? "border-primary bg-primary/5 shadow-sm"
									: "border-border hover:border-primary/40 hover:bg-muted/40",
							)}
						>
							<button
								type="button"
								onClick={() => onMethodChange(option.id)}
								className="flex w-full items-center gap-3 px-4 py-4 text-left sm:px-5"
							>
								<span
									className={cn(
										"grid size-6 place-items-center rounded-full border transition-colors",
										isSelected ? "border-primary text-primary" : "border-input text-muted-foreground",
									)}
								>
									{isSelected ? <CheckCircle2 className="size-4" /> : <Circle className="size-4" />}
								</span>

								<span className={cn("rounded-lg p-2 transition-colors", isSelected ? "text-primary" : "text-muted-foreground") }>
									<Icon className="size-5" />
								</span>

								<span className="min-w-0 flex-1">
									<span className="block text-base font-semibold text-foreground">
										{option.title}
									</span>
									<span className="mt-1 block text-sm text-muted-foreground">
										{option.description}
									</span>
								</span>

								{option.id === "platform" && (
									<span className="rounded-full border border-[color:var(--light-green)] bg-[color:var(--light-green)]/10 px-3 py-1 text-xs font-semibold text-[color:var(--light-green)]">
										Auto-generated
									</span>
								)}
							</button>

							{isSelected && option.id !== "platform" && (
								<div className="border-t border-border px-4 pb-4 sm:px-5">
									<Label className="mb-2 block text-sm font-medium text-foreground">
										{option.title}
									</Label>
									<Input
										value={option.id === "email" ? data.email : data.whatsapp}
										onChange={(event) =>
											onFieldChange(option.id === "email" ? "email" : "whatsapp", event.target.value)
										}
										placeholder={option.placeholder}
										className="h-12 rounded-xl border-input px-4 text-base shadow-none focus-visible:ring-ring"
									/>
								</div>
							)}

							{isSelected && option.id === "platform" && (
								<div className="border-t border-border px-4 pb-4 sm:px-5">
									<div className="mt-4 flex flex-col gap-2 rounded-xl border border-dashed border-[color:var(--light-green)]/40 bg-[color:var(--light-green)]/5 p-4 sm:flex-row sm:items-center sm:justify-between">
										<div>
											<p className="text-sm font-semibold text-foreground">Built-in contact flow enabled</p>
											<p className="mt-1 text-sm text-muted-foreground">
												Dentists will submit requests through the platform hosted form.
											</p>
										</div>
										<Button variant="outline" size="sm" type="button" className="rounded-full border-[color:var(--light-green)]/40 text-[color:var(--light-green)]">
											Ready to use
										</Button>
									</div>
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
