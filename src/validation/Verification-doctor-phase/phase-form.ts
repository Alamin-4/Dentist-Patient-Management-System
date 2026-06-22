import z from "zod";

export const procedureSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Required"),
  price: z.coerce.number().min(0, "Invalid price"),
  notes: z.string().optional(),
});

export const formSchema = z.object({
  jciCertificate: z.any().optional(),
  videoWalkthrough: z.any().optional(),
  procedures: z.array(procedureSchema).min(1),
  signerFullName: z.string().min(1, "Required"),
  typedSignature: z.string().min(1, "Required"),
  agreeToGuarantee: z.boolean().refine((val) => val === true, "Must agree"),
}).refine(
  (data) => !!data.jciCertificate || !!data.videoWalkthrough,
  {
    message: "Either JCI Certificate or Video Walkthrough must be submitted.",
    path: ["jciCertificate"],
  }
);

export type FormValues = z.infer<typeof formSchema>;
export type FormInputValues = z.input<typeof formSchema>;