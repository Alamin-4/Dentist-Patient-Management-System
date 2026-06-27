import z from "zod";

export interface StepOneI {
    country: string;
    city: string;
    registrationAuthority: string;
    registrationNumber: string;
}
export interface ProfessionalDetailsI {
    primarySpecialty: string;
    yearsOfExperience: string;
    legalName: string;
    country: string;
    city: string
}
export interface ClinicAddressI {
    address: string;
    lat: string;
    lng: string
}
export interface MaterialI {
    own_procedure: string | number | boolean;
    ce_certificate: File | null;
    material_brands: File | string | null;
    invoice: File | null;
    protocol_pdf: File | null;
}

export interface StepThreeI {
    clinic_address: ClinicAddressI;
    materials: MaterialI[];
}

export interface StepTwoI {
    jciCertificate?: File | null;
    walkthroughVideo?: File | null;
    signerName: string;
    signature: string;
    agreedToGuarantee: boolean;
    procedures: {
        procedureName: string;
        price: number;
        notes?: string;
    }[];
}

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
    role: z.enum(["PATIENT", "DENTIST"]),
})

export type LoginFormData = z.infer<typeof loginSchema>;

export const adminLoginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
})

export type AdminLoginFormData = z.infer<typeof adminLoginSchema>;
